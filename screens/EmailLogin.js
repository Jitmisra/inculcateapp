import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  ImageBackground, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

const EmailLogin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
    'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
    'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.ttf'),
    'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.ttf'),
  });

  useEffect(() => {
    checkExistingAuth();
  }, [navigation]);

  const checkExistingAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.replace('Swiper2');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://app.error6o6.tech/api/consumer/v1/auth/',
        { email, password },
        { timeout: 5000 }
      );
      
      if (response.data.token && response.data.user) {
        await AsyncStorage.multiSet([
          ['userToken', response.data.token],
          ['userName', response.data.user.name],
          ['userEmail', response.data.user.email],
          ['userId', response.data.user.id.toString()]
        ]);

        navigation.replace('Swiper2');
      }
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Please check your credentials'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || checkingAuth) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6A34" />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ImageBackground 
        source={require('../assets/images/backgrounds/login-background.png')} 
        style={styles.imageBackground}
      >
        <View style={styles.overlay}>
          <View style={styles.formContainer}>
            {!isKeyboardVisible && (
              <Text style={styles.headerText}>
                Login with Email
              </Text>
            )}
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#4D4D4D"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput 
                style={[styles.textInput, { marginTop: 16 }]}
                placeholder="Enter your password"
                placeholderTextColor="#4D4D4D"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity  
                onPress={handleLogin}
                style={styles.button}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
              {!isKeyboardVisible && (
              <Text style={styles.infoText}>
                By clicking Login, you are agreeing to our Terms of Service and Privacy Policy
              </Text>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover'
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  formContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    bottom: "-15%",
    height: '53%'
  },
  headerText: {
    color: '#4D4D4D',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'MonaSans-Bold'
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center'
  },
  textInput: {
    width: 330,
    height: 46,
    backgroundColor: '#F6F6F6',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    fontSize: 16,
    textAlignVertical: 'center',
    fontFamily: 'MonaSans-Regular'
  },
  button: {
    width: 330,
    height: 46,
    backgroundColor: '#FF6A34',
    marginTop: 20,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6A34',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'MonaSans-Medium'
  },
  infoText: {
    color: '#4D4D4D',
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    width: '90%',
    fontFamily: 'MonaSans-Regular'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EmailLogin;