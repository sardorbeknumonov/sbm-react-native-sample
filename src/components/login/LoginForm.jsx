import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {initCollection, initSendbird} from '../../redux/slices/sendbird';

import {COLORS} from '../../constants';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [state, setState] = useState({
    appId: '',
    userId: '',
    token: '',
    channelUrl: '',
    isLoading: false,
    hasError: false,
    errorMessage: '',
  });

  useEffect(() => {
    AsyncStorage.getItem('loginInformation').then(data => {
      data = JSON.parse(data);
      setState({
        appId: data?.appId || 'D714C6FE-E788-44AF-BB0D-329AD2756907',
        userId: data?.userId || 'sardorbek',
        token: data?.token || '102b9d28a72f270bc4dfcf54bd3dd53ce869d992',
        channelUrl: data?.channelUrl || 'notification_15707_promote-product-data',
        isSignedIn: data?.isSignedIn || false,
      });
    });
  }, []);

  useEffect(() => {
    if (state.isSignedIn) {
      setState({
        ...state,
        isLoading: true,
      });
      dispatch(initSendbird(state))
        .unwrap()
        .then(() => {
          dispatch(initCollection());
          setState({
            ...state,
            isLoading: false,
          });
        })
        .catch(error => {
          setState({
            ...state,
            isLoading: false,
            hasError: true,
            errorMessage: error.message,
          });
        });
    }
  }, [state.isSignedIn]);

  const handleTextChange = (element, text) => {
    setState({
      ...state,
      [element]: text,
    });
  };

  const handleLogin = async () => {
    try {
      setState({
        ...state,
        isLoading: true,
      });
      dispatch(initSendbird(state))
        .unwrap()
        .then(() => {
          dispatch(initCollection());
          setState({
            ...state,
            isLoading: false,
          });
        })
        .catch(error => {
          setState({
            ...state,
            isLoading: false,
            hasError: true,
            errorMessage: error.message,
          });
        });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        hasError: true,
        errorMessage: error.message,
      });
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={state.appId}
        autoCapitalize="none"
        onChangeText={text => handleTextChange('appId', text)}
        placeholder="Application ID"
        placeholderTextColor="#00000050"
      />
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        value={state.userId}
        onChangeText={text => handleTextChange('userId', text)}
        placeholder="User ID"
        placeholderTextColor="#00000050"
      />
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        value={state.token}
        onChangeText={text => handleTextChange('token', text)}
        placeholder="Token"
        placeholderTextColor="#00000050"
      />
      <TextInput
        style={styles.textInput}
        autoCapitalize="none"
        value={state.channelUrl}
        onChangeText={text => handleTextChange('channelUrl', text)}
        placeholder="Channel URL (Optional)"
        placeholderTextColor="#00000050"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {state.isLoading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Sign in</Text>}
      </TouchableOpacity>

      {state.hasError && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{state.errorMessage}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  textInput: {
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: '#EEEEEE',
    width: '100%',
    height: 56,
    maxHeight: 56,
    paddingHorizontal: 16,
  },
  button: {
    width: '100%',
    height: 48,
    marginTop: 8,
    backgroundColor: COLORS.purple,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '500',
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
