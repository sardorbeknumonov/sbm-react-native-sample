import {useState} from 'react';
import {StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import DnDIcon from '../../assets/DnDIcon.svg';
import ExitIcon from '../../assets/ExitIcon.svg';
import ThemeIcon from '../../assets/ThemeIcon.svg';
import {handleSignOut} from '../../redux/slices/sendbird';

export default function SettingsContent() {
  const [state, setState] = useState({
    darkTheme: false,
    doNotDisturb: false,
  });

  const dispatch = useDispatch();

  const handleSignOutButton = () => {
    dispatch(handleSignOut());
  };

  const Avatar = () => {
    return (
      <View style={styles.avatarContainer}>
        <FastImage style={styles.avatarImage} source={require('../../assets/Avatar.png')} />
        <Text style={styles.avatarText}>Mickey Cheong</Text>
      </View>
    );
  };

  const UserDetails = () => {
    return (
      <View style={styles.userContainer}>
        <View style={styles.userContainerWrapper}>
          <Text style={styles.userPrimaryText}>User ID</Text>
          <Text style={styles.userSecondaryText}>mickey</Text>
        </View>
      </View>
    );
  };

  const MenuItems = () => {
    return (
      <View style={styles.menuContainer}>
        <View style={styles.menuItemContainer}>
          <ThemeIcon />
          <Text style={styles.menuItemText}>Dark theme</Text>
          <Switch
            style={styles.menuSwitch}
            value={state.darkTheme}
            trackColor={{true: '#742DDD'}}
            onValueChange={() =>
              setState({
                ...state,
                darkTheme: !state.darkTheme,
              })
            }
          />
        </View>
        <View style={styles.menuItemContainer}>
          <DnDIcon />
          <Text style={styles.menuItemText}>Do not disturb</Text>
          <Switch
            value={state.doNotDisturb}
            style={styles.menuSwitch}
            trackColor={{true: '#742DDD'}}
            onValueChange={() =>
              setState({
                ...state,
                doNotDisturb: !state.doNotDisturb,
              })
            }
          />
        </View>
        <View style={styles.menuItemContainer}>
          <TouchableOpacity style={styles.menuButton} onPress={handleSignOutButton}>
            <ExitIcon />
            <Text style={styles.menuItemText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <Avatar />
      <UserDetails />
      <MenuItems />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingTop: 32,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  avatarContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 25,
  },
  avatarImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
  },
  userContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#0000001F',
  },
  userContainerWrapper: {
    paddingVertical: 16,
  },
  userPrimaryText: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: '#00000080',
    paddingBottom: 4,
  },
  userSecondaryText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#000000E0',
  },
  menuContainer: {
    width: '100%',
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#0000001F',
  },
  menuItemText: {
    paddingLeft: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000E0',
  },
  menuButton: {
    flexDirection: 'row',
    width: '100%',
  },
  menuSwitch: {
    marginLeft: 'auto',
  },
});
