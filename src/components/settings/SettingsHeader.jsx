import {useNavigation} from '@react-navigation/native';
import {Platform, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import ChevronLeft from '../../assets/ChevronLeft.svg';
import {parseThemeColor} from '../../utils';

export default function SettingsHeader() {
  const navigation = useNavigation();
  const selectedTheme = useColorScheme();
  const headerSettings = useSelector(state => state.sendbird.globalSettings.themes[0].header);

  return (
    <>
      <View style={styles.outerContainer(headerSettings, selectedTheme)}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft height={24} width={24} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.primaryText}>Settings</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
          <Text style={styles.secondaryText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLine(headerSettings, selectedTheme)} />
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: (headerSettings, selectedTheme) => ({
    width: '100%',
    paddingLeft: 10,
    alignItems: 'center',
    paddingRight: 12,
    flexDirection: 'row',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 12,
    backgroundColor: parseThemeColor(headerSettings.backgroundColor, selectedTheme),
    borderBottomWidth: 1,
    borderBottomColor: parseThemeColor(headerSettings.lineColor, selectedTheme),
  }),
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  secondaryText: {
    fontSize: 16,
    lineHeight: 16,
    color: '#742DDD',
  },
  backButton: {
    marginRight: 'auto',
  },
  iconButton: {
    marginLeft: 'auto',
  },
  icon: {
    color: '#742DDD',
  },
  headerLine: (headerSettings, selectedTheme) => ({
    flex: 1,
    height: 1,
    maxHeight: 1,
    backgroundColor: parseThemeColor(headerSettings.lineColor, selectedTheme),
  }),
});
