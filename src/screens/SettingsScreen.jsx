import {SafeAreaView, StyleSheet, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import SettingsContent from '../components/settings/SettingsContent';
import SettingsHeader from '../components/settings/SettingsHeader';
import {parseThemeColor} from '../utils';

export default function SettingsScreen() {
  const selectedTheme = useColorScheme();
  const headerSettings = useSelector(state => state.sendbird.globalSettings.themes[0].header);
  const listSettings = useSelector(state => state.sendbird.globalSettings.themes[0].list);

  return (
    <>
      <SafeAreaView style={styles.upperSafeView(headerSettings, selectedTheme)} />
      <SafeAreaView style={styles.lowerSafeView(listSettings, selectedTheme)}>
        <View style={styles.container}>
          <SettingsHeader />
          <SettingsContent />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  upperSafeView: (headerSettings, selectedTheme) => ({
    flex: 0,
    backgroundColor: parseThemeColor(headerSettings.backgroundColor, selectedTheme),
  }),
  lowerSafeView: (listSettings, selectedTheme) => ({
    backgroundColor: parseThemeColor(listSettings.backgroundColor, selectedTheme),
    flex: 1,
  }),
  container: {
    height: '100%',
    alignItems: 'center',
  },
});
