import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { 
  Text, 
  View, 
  ImageBackground, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';

const Otp = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value exists
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground 
          source={require('../assets/images/backgrounds/login-background.png')} 
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ 
              backgroundColor: 'white',
              width: '100%',
              height: '40%',
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 45,
              borderTopRightRadius: 45,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ 
                color: '#4D4D4D',
                fontWeight: 'bold',
                fontSize: 16,
                position: 'absolute',
                top: 20
              }}>
                Enter The OTP Sent To You!
              </Text>
              
              <View style={{ width: '100%', alignItems: 'center', marginTop: -10 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[0, 1, 2, 3].map((index) => (
                    <TextInput
                      key={index}
                      ref={ref => inputRefs.current[index] = ref}
                      style={{
                        width: 46,
                        height: 46,
                        backgroundColor: '#F6F6F6',
                        borderRadius: 18,
                        borderWidth: 1,
                        borderColor: '#EBEBEB',
                        textAlign: 'center',
                        fontSize: 18,
                        lineHeight: undefined,
                        padding: 0
                      }}
                      maxLength={1}
                      keyboardType="numeric"
                      value={otp[index]}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                    />
                  ))}
                </View>

                <TouchableOpacity 
                  onPress={() => navigation.push('Swiper2')}
                  style={{
                    width: 330,
                    height: 46,
                    backgroundColor: '#FF6A34',
                    marginTop: 20,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#FF6A34',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '500', fontSize: 16 }}>
                    Proceed
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Otp;