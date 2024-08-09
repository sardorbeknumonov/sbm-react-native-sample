import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import SBMLogo from '../../assets/SBMLogo.svg';

import {COLORS} from '../../constants/theme';

export default function LoginHeader() {
  const selectedTheme = useColorScheme();
  return (
    <View style={styles.container}>
      <SBMLogo height={32} width={266.67} />
      <Text style={styles.text(selectedTheme)}>React Native sample app</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  text: selectedTheme => ({
    height: 24,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: 4,
    marginBottom: 32,
    opacity: 0.88,
    color: COLORS[selectedTheme].text,
  }),
});
