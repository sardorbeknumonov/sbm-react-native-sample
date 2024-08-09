import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS} from '../../../constants';
import {parseThemeColor} from '../../../utils';

// Text only no buttons

export default function FeedDataPromoteProduct({notification, template_data}) {
  const selectedTheme = useColorScheme();
  const globalSettings = useSelector(state => state.sendbird.globalSettings.themes[0]);
  const variables = notification.notificationData.templateVariables;
  console.log(template_data)
  return (
    <View style={styles.wrapper(globalSettings.notification, selectedTheme)}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText(selectedTheme)}>{formatString(template_data['title'], variables)}</Text>
      </View>
      <View>
        <Text style={styles.bodyText(selectedTheme)}>{formatString(template_data['body'], variables)}</Text>
      </View>
    </View>
  );
}

function formatString(template, values) {
  return template.replace(/{(\w+)}/g, function(match, key) {
      return typeof values[key] !== 'undefined' ? values[key] : match;
  });
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
