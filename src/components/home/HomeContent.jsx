import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ChevronRight from '../../assets/ChevronRight.svg';
import {handleSignOut, initCollection} from '../../redux/slices/sendbird';

export default function HomeContent() {
  const [state, setState] = useState({
    hasError: false,
    errorMessage: '',
  });
  const unreadCount = useSelector(state => state.sendbird.unreadCount);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  useEffect(() => {
    // Since we're not using Websockets, we can immediately fetch the collection
    dispatch(initCollection())
      .unwrap()
      .catch(error => {
        setState({
          hasError: true,
          errorMessage: error.message,
        });
      });
  }, []);

  const handleSignOutButton = () => {
    dispatch(handleSignOut());
  };

  const isUnread = unreadCount > 0;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} disabled={state.hasError}>
          <View style={styles.feedBtnContainer}>
            <Text style={styles.feedBtnText}>Feed Channel</Text>
            <View style={{marginLeft: 'auto', flexDirection: 'row'}}>
              {isUnread && (
                <View style={styles.unreadCount(unreadCount)}>
                  <Text style={styles.unreadCountText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              )}
              <ChevronRight height={20} width={20} style={styles.image} />
            </View>
          </View>
        </TouchableOpacity>
        {state.hasError && (
          <View style={styles.error}>
            <Text style={styles.errorText}>{state.errorMessage}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOutButton}>
          <Text style={styles.signOutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingTop: 24,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  feedBtnContainer: {
    alignItems: 'center',
    height: 72,
    maxHeight: 72,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    backgroundColor: '#FFFFFF',
  },
  feedBtnText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
    marginLeft: 24,
  },
  unreadCount: count => ({
    borderRadius: 9999,
    width: count > 99 ? 33 : 20,
    height: 20,
    backgroundColor: '#DE360B',
    alignItems: 'center',
    marginRight: 8,
  }),
  unreadCountText: {
    fontSize: 12,
    fontWeight: '700',
    top: '10%',
    color: '#FFFFFF',
  },
  image: {
    marginRight: 16,
    color: '#000',
  },
  signOutBtn: {
    marginTop: 32,
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutBtnText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
  },
  error: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff0000',
    lineHeight: 24,
    marginLeft: 10,
  },
});
