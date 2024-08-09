import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../constants';
import {parseThemeColor} from '../../../utils';

// Text only no buttons

export default function FeedDataPrizeTemplate({notification}) {
  const selectedTheme = useColorScheme();
  const globalSettings = useSelector(state => state.sendbird.globalSettings.themes[0]);
  const variables = notification.notificationData.templateVariables;

  
  return (
    <View style={styles.wrapper(globalSettings.notification, selectedTheme)}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText(selectedTheme)}>Hello, {variables.nickname}</Text>
      </View>
      <View>
        <Text style={styles.bodyText(selectedTheme)}>{"Thank you for participating in our contest!\nYou won "}{variables.numbers_ticket} tickets!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: (theme, selectedTheme) => ({
    width: '100%',
    backgroundColor: parseThemeColor(theme.backgroundColor, selectedTheme),
    padding: 12,
    borderRadius: 8,
  }),
  headerContainer: {
    paddingBottom: 6,
  },
  headerText: selectedTheme => ({
    fontSize: 16,
    fontWeight: '700',
    color: COLORS[selectedTheme].text,
  }),
  bodyText: selectedTheme => ({
    fontSize: 14,
    fontWeight: '400',
    color: COLORS[selectedTheme].text,
  }),
});
