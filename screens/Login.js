import React from 'react';
import { 
  Text, 
  View, 
  ImageBackground, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground 
          source={require('../assets/images/backgrounds/login-background.png')} 
          style={styles.imageBackground}
        >
          <View style={styles.centerContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.headerText}>
                Enter your mobile number
              </Text>
              <View style={styles.inputContainer}>
                {/* Mobile Number Input */}
                <TextInput 
                  style={styles.textInput}
                  placeholder="Enter your mobile"
                  placeholderTextColor="#4D4D4D"
                  keyboardType="numeric"
                />
                {/* Get Started Button */}
                <TouchableOpacity  
                  onPress={() => navigation.push('otp')}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
                {/* Terms and Privacy Policy Text */}
                <Text style={styles.infoText}>
                  By clicking Get Started or Login via auth, you are agreeing to our Terms of Service and Privacy Policy
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '40%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    color: '#4D4D4D',
    fontWeight: 'bold',
    fontSize: 16,
    position: 'absolute',
    top: 20
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40
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
    textAlignVertical: 'center'
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
    fontSize: 16
  },
  infoText: {
    color: '#4D4D4D',
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    width: '90%'
  }
});

export default Login;