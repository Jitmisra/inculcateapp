import { 
    View, 
    ImageBackground, 
    Text, 
    SafeAreaView, 
    TouchableOpacity,
    StatusBar,
    Platform,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Whiteheader from '../components/Whiteheader';

const Quiz = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const correctAnswer = 1; 

  const [fontsLoaded] = useFonts({
    'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
    'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
    'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.ttf'),
    'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6A34" />
      </View>
    );
  }

  const options = [
    "Project Shakti",
    "Project Sakhi",
    "Project Udaan",
    "Project Jyoti"
  ];

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    setIsAnswered(true);
  };

  const getOptionStyle = (index) => {
    if (!isAnswered) {
      return selectedOption === index ? styles.selectedOption : styles.option;
    }
    if (index === correctAnswer) {
      return styles.correctOption;
    }
    if (selectedOption === index && index !== correctAnswer) {
      return styles.wrongOption;
    }
    return styles.option;
  };

  const getTextStyle = (index) => {
    if (!isAnswered) {
      return selectedOption === index ? styles.selectedOptionText : styles.optionText;
    }
    if (index === correctAnswer) {
      return styles.correctOptionText;
    }
    if (selectedOption === index && index !== correctAnswer) {
      return styles.wrongOptionText;
    }
    return styles.optionText;
  };

  return (
    <View className="flex-1 bg-[#FFC4AF]">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground 
        source={require('../assets/images/backgrounds/Home-background.png')} 
        className="flex-1 w-full h-full"
      >
        <SafeAreaView style={styles.container}>
          <Whiteheader/>
          
          <View className="px-4 mt-6 items-center">
            <Text className="text-[#FF6A34] text-[16px] font-medium mb-2 text-center">
              Question 1 out of 1
            </Text>
            <Text className="text-[#25252D] text-[20px] font-medium mb-6 w-[90%] text-center">
              Under Rajashree Birla's guidance, which CSR initiative was launched to empower rural women?
            </Text>

            <View className="w-full items-center">
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOptionSelect(index)}
                  disabled={isAnswered}
                  style={[styles.baseOption, getOptionStyle(index)]}
                >
                  <Text style={getTextStyle(index)}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {isAnswered && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                  {selectedOption === correctAnswer 
                    ? "Correct! Project Sakhi is indeed the initiative launched to empower rural women."
                    : "Incorrect. Project Sakhi is the correct answer. This initiative focuses on women's empowerment in rural areas."}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    overflow: 'hidden'
  },
  baseOption: {
    height: 46,
    marginBottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 9.1,
    elevation: 5,
  },
  option: {
    borderColor: '#FFC1A6',
    backgroundColor: '#FDF2EF',
    shadowColor: '#FF6A34',
  },
  selectedOption: {
    borderColor: '#FF6A34',
    backgroundColor: '#FFF5EF',
    shadowColor: '#FF6A34',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
    shadowColor: '#4CAF50',
  },
  wrongOption: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
    shadowColor: '#F44336',
  },
  optionText: {
    color: '#832300',
    fontSize: 16,
    fontFamily: 'MonaSans-Medium'
  },
  selectedOptionText: {
    color: '#FF6A34',
    fontSize: 16,
    fontFamily: 'MonaSans-Medium'
  },
  correctOptionText: {
    color: '#4CAF50',
    fontSize: 16,
    fontFamily: 'MonaSans-Medium'
  },
  wrongOptionText: {
    color: '#F44336',
    fontSize: 16,
    fontFamily: 'MonaSans-Medium'
  },
  feedbackText: {
    color: '#832300',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'MonaSans-Regular'
  }
});

export default Quiz;