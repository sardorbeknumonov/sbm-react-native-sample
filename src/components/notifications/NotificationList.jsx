import {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import NotificationBell from '../../assets/notification-bell.svg';
import {loadPrev, logImpression, markMessagesAsRead, refreshCollection} from '../../redux/slices/sendbird';
import {parseThemeColor} from '../../utils';
import CategoryFilters from './CategoryFilters';
import Notification from './Notification';

export default function NotificationList() {
  const [refreshing, setRefreshing] = useState(false);
  const seenNotifications = useRef({}).current;
  const flatListRef = useRef();
  const dispatch = useDispatch();
  const hasNewNotifications = useSelector(state => state.sendbird.hasNewNotifications);
  const selectedTheme = useColorScheme();
  const isNotificationsLoading = useSelector(state => state.sendbird.isNotificationsLoading);
  const isChannelLoading = useSelector(state => state.sendbird.isChannelLoading);
  const listSettings = useSelector(state => state.sendbird.globalSettings.themes[0].list);
  const isCategoryFilterEnabled = useSelector(state => state.sendbird.feedChannel.isCategoryFilterEnabled);
  const notifications = useSelector(state => state.sendbird.notifications);

  const templates = useSelector(state => state.sendbird.templates);

  const NoNotifications = () => (
    <View style={styles.listEmpty}>
      <View>
        <NotificationBell height={60} width={60} style={styles.notificationBell(selectedTheme)} />
      </View>
      <Text style={styles.listEmptyText(selectedTheme)}>No Notifications</Text>
    </View>
  );

  const NewNotifications = () => (
    <TouchableOpacity
      style={styles.newNotificationsContainer}
      onPress={() => {
        dispatch(refreshCollection())
          .unwrap()
          .then(() => {
            flatListRef.current.scrollToOffset({animated: true, offset: 0});
          });
        dispatch(markChannelAsRead());
      }}>
      <Text style={styles.newNotificationsText} allowFontScaling={false}>
        New Notifications
      </Text>
    </TouchableOpacity>
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      dispatch(refreshCollection())
        .unwrap()
        .then(() => {
          setRefreshing(false);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    const trackableNotifications = [];
    const visibleNotifications = viewableItems.filter(it => it.isViewable).map(({item}) => item);

    visibleNotifications.forEach(notification => {
      if (!seenNotifications[notification.notificationId]) {
        seenNotifications[notification.notificationId] = true;
        trackableNotifications.push(notification);
      }
    });
    dispatch(markMessagesAsRead(trackableNotifications));
    dispatch(logImpression(trackableNotifications));
  }, []);
  const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

  if (isChannelLoading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isCategoryFilterEnabled && notifications.length === 0) {
    return <NoNotifications />;
  }

  return (
    <View style={styles.listContainer(listSettings, selectedTheme)}>
      <CategoryFilters />
      {isNotificationsLoading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.listPadding} id="notification-list-pad">
          <FlatList
            ref={flatListRef}
            contentContainerStyle={{paddingBottom: 40}}
            data={notifications}
            keyExtractor={item => item.notificationId}
            ListEmptyComponent={<NoNotifications />}
            onEndReached={() => {
              if (!this.onEndReachedCalledDuringMomentum) {
                dispatch(loadPrev());
                this.onEndReachedCalledDuringMomentum = true;
              }
            }}
            onEndReachedThreshold={0.1}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            onRefresh={onRefresh}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            refreshing={refreshing}
            renderItem={({item}) => <Notification notification={item} template={templates[item.notificationData.templateKey]} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      {hasNewNotifications && <NewNotifications />}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: (listSettings, selectedTheme) => ({
    width: '100%',
    flex: 1,
    backgroundColor: parseThemeColor(listSettings.backgroundColor, selectedTheme),
  }),
  activityIndicator: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: '50%',
    width: '100%',
  },
  listEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 600,
  },
  listEmptyText: selectedTheme => ({
    width: 200,
    height: 20,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 19,
    textAlign: 'center',
    color: selectedTheme === 'light' ? '#000' : '#fff',
  }),
  listPadding: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 20,
    height: '100%',
  },
  notificationBell: selectedTheme => ({
    color: selectedTheme === 'light' ? '#000' : '#fff',
  }),
  newNotificationsContainer: {
    height: 38,
    width: 152,
    position: 'absolute',
    top: 45,
    alignSelf: 'center',
    flex: 1,
    zIndex: 1,
    borderRadius: 19,
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#742DDD',
  },
  newNotificationsText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.1,
    alignSelf: 'center',
  },
});
