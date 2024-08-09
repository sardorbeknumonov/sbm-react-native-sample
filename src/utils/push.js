import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {isSendbirdNotification, parseSendbirdNotification} from '@sendbird/uikit-utils';
import {Platform} from 'react-native';
import {requestNotifications} from 'react-native-permissions';
import {navigationRef} from '../../App';
import {initSendbird, refreshCollection, sb, updateHasNewNotifications} from '../redux/slices/sendbird';
import {dispatch, store} from '../redux/store';

class AndroidNotificationHandler {
  ANDROID_NOTIFICATION_CHANNEL_ID = 'default';

  constructor() {
    notifee.createChannel({
      id: this.ANDROID_NOTIFICATION_CHANNEL_ID,
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  startOnAppOpened() {}
  startOnForeground() {
    messaging().onMessage(async remoteMessage => {
      try {
        console.log(remoteMessage.data)
        if (isSendbirdNotification(remoteMessage.data)) {
          if (isViewingChannel(remoteMessage.data)) {
            dispatch(updateHasNewNotifications(true));
          } else {
            dispatch(refreshCollection());
            await this.displayNotification(remoteMessage);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      notifee.onForegroundEvent(async ({type, detail}) => {
        try {
          if (type === EventType.PRESS && detail.notification && isSendbirdNotification(detail.notification.data)) {
            sb.markPushNotificationAsClicked(detail.notification.data);
            navigationRef.current?.navigate('Notifications');
          }
        } catch (error) {
          console.error(error);
        }
      });
    };
  }
  startOnBackground() {
   
    // Specifies the action to take when the user presses the notification in the background.
    notifee.onBackgroundEvent(async ({type, detail}) => {
      console.log(detail.notification.data)
      sb.markPushNotificationAsDelivered(detail.notification.data);
      try {
        if (type === EventType.PRESS && detail.notification && isSendbirdNotification(detail.notification.data)) {
          sb.markPushNotificationAsClicked(detail.notification.data);
          navigationRef.current?.navigate('Notifications');
        }
      } catch (error) {
        console.error(error);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      try {
        if (isSendbirdNotification(remoteMessage.data)) {
          sb.markPushNotificationAsDelivered(remoteMessage.data);
          await this.displayNotification(remoteMessage);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  displayNotification = async message => {
    try {
      const sendbird = parseSendbirdNotification(message.data);
      await notifee.displayNotification({
        id: String(sendbird.message_id),
        title: `${sendbird['push_title'] || sendbird.channel.name || 'Message received'}`,
        body: sendbird.message,
        data: message.data,
        android: {
          channelId: this.ANDROID_NOTIFICATION_CHANNEL_ID,
          importance: 4,
          largeIcon: sendbird.sender?.profile_url || sendbird.channel.channel_url,
          circularLargeIcon: true,
          pressAction: {id: 'default'},
          showTimestamp: true,
          timestamp: sendbird.created_at,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
}
class iOSNotificationHandler {
  startOnAppOpened() {
    PushNotificationIOS.getInitialNotification().then(async notification => {
      try {
        const data = notification?.getData();
        const isClicked = data?.userInteraction === 1;
        const localData = JSON.parse(await AsyncStorage.getItem('loginInformation'));
        if (data) {
          if (isClicked && isSendbirdNotification(data)) {
            sb.markPushNotificationAsClicked(data);
            if (store.getState().isAuthenticated) {
              navigationRef.current?.navigate('Notifications');
            } else if (localData.isSignedIn) {
              dispatch(initSendbird(localData))
                .unwrap()
                .then(() => {
                  navigationRef.current?.navigate('Notifications');
                });
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
  startOnForeground() {
    const unsubscribes = [];
    PushNotificationIOS.addEventListener('notification', async notification => {
      try {
        const data = notification.getData();
        if (isSendbirdNotification(data)) {
          if (isViewingChannel(data)) {
            dispatch(updateHasNewNotifications(true));
          } else {
            dispatch(refreshCollection());
            this.displayNotification(notification);
          }
        }

        notification.finish('UIBackgroundFetchResultNoData');
      } catch (error) {
        console.error(error);
      }
    });

    unsubscribes.push(() => PushNotificationIOS.removeEventListener('notification'));
    unsubscribes.push(
      notifee.onForegroundEvent(({type, detail}) => {
        const data = detail.notification.data.stringData
          ? JSON.parse(detail.notification.data.stringData)
          : detail.notification.data;
        switch (type) {
          case EventType.PRESS:
            try {
              navigationRef.current?.navigate('Notifications');
              break;
            } catch (error) {
              console.error(error);
            }
          case EventType.DELIVERED:
            try {
              sb.markPushNotificationAsDelivered(data);
              break;
            } catch (error) {
              console.error(error);
            }
        }
      }),
    );

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }
  startOnBackground() {}

  displayNotification = async message => {
    try {
      const sendbird = parseSendbirdNotification(message.getData());
      await notifee.displayNotification({
        id: String(sendbird.message_id),
        title: `${sendbird['push_title'] || sendbird.channel.name || 'Message received'}`,
        body: sendbird.message,
        data: {stringData: JSON.stringify(message.getData())},
      });
    } catch (error) {
      console.error(error);
    }
  };
}

function isViewingChannel(data) {
  const currentScreen = navigationRef.current?.getCurrentRoute()?.name;
  if (currentScreen === 'Notifications') {
    const sendbirdData = parseSendbirdNotification(data);
    if (sendbirdData.channel.channel_url === store.getState().sendbird.feedChannel._url) {
      return true;
    }
  } else {
    return false;
  }
}

export const requestPermissions = async () => {
  const result = await requestNotifications([]);
  return result.status === 'granted' || result.status === 'limited';
};

export const notificationHandler =
  Platform.OS === 'ios' ? new iOSNotificationHandler() : new AndroidNotificationHandler();
