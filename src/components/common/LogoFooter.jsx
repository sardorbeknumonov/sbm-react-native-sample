import {Image, StyleSheet, Text, View} from 'react-native';
const lockJson = require('../../../package-lock.json');

export default function LogoFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.versionText}>SDK v{lockJson.packages['node_modules/@sendbird/chat']['version']}</Text>
      <Image style={styles.image} source={require('../../assets/SendbirdLogo.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    paddingBottom: 24,
  },
  image: {
    height: 16,
    width: 94,
  },
  versionText: {
    fontSize: 12,
    paddingBottom: 16,
    fontWeight: '400',
    color: '#00000080',
  },
});
