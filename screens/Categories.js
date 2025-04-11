import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  ImageBackground,
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  ActivityIndicator,
  Dimensions  
} from 'react-native';
import * as amplitude from '@amplitude/analytics-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const responsiveFontSize = (size) => Math.round(size * (SCREEN_WIDTH / guidelineBaseWidth));

import axios from 'axios';
import Swiper from 'react-native-swiper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Whiteheader from '../components/Whiteheader';
import Whiteheader2 from '../components/Whiteheader2';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  wrapper: {
    marginTop: 0
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    width: wp(90),
    position: 'absolute',
    top: hp(34),
    fontFamily: 'MonaSans-Bold',
    numberOfLines: 2,
    ellipsizeMode: 'tail'
  },
  descriptionContainer: {
    width: wp(90),
    height: "42%",
    position: 'absolute',
    top: hp(42),
    overflow: 'hidden'
  },
  description: {
    fontSize: responsiveFontSize(15.5),
    fontFamily: 'MonaSans-Regular',
    lineHeight: responsiveFontSize(16) * 1.05
  },
  image: {
    width: wp(100),
    height: hp(32),
    position: 'absolute',
    top: 0,
  },
  readMore: {
    bottom: 0,
    width: wp(100),
    position: 'absolute',
    height: hp(7),
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: {
    marginVertical: hp(1),
    paddingVertical: hp(1.5),
    backgroundColor: '#EFEFEF',
    borderRadius: 4,
    alignItems: 'center',
    width: wp(80)
  },
  optionsContainer: {
    position: 'absolute',
    top: hp(60),
    width: wp(90),
  }
});

const quizStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    overflow: 'hidden'
  },
  quizContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 40
  },
  questionNumber: {
    color: '#FF6A34',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'MonaSans-Medium'
  },
  questionText: {
    color: '#25252D',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    width: '90%',
    fontFamily: 'MonaSans-SemiBold'
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
  optionText: {
    color: '#832300',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'MonaSans-Regular'
  },
  selectedOption: {
    borderColor: '#FF6A34',
    backgroundColor: '#FFF5EF',
    shadowColor: '#FF6A34',
  },
  selectedOptionText: {
    color: '#FF6A34',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'MonaSans-Medium'
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
    shadowColor: '#4CAF50',
  },
  correctOptionText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'MonaSans-Medium'
  },
  wrongOption: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
    shadowColor: '#F44336',
  },
  wrongOptionText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'MonaSans-Medium'
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    height: "50%",
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: 'rgba(255,106,52,0.25)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 9.1,
    elevation: 5,
  },
  correctTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'MonaSans-Bold'
  },
  correctDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'MonaSans-Regular'
  },
  wrongTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'MonaSans-Bold'
  },
  wrongDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'MonaSans-Regular'
  },
  button: {
    width: 330,
    height: 46,
    paddingHorizontal: 46,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#FF6A34',
    shadowColor: 'rgba(255,106,52,0.25)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 9.1,
    elevation: 5,
    alignSelf: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'MonaSans-Bold'
  }
});

const QuizSlide = ({ quiz, navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleOptionPress = (index) => {
    if (!isAnswered) {
      setSelectedOption(index);
      setIsAnswered(true);
      setBottomSheetVisible(true);
      // Track quiz answer event with amplitude
      amplitude.track('Quiz Answered', {
        question: quiz.question,
        selectedAnswer: index,
        correctAnswer: quiz.correct
      });
    }
  };

  const getOptionStyle = (index) => {
    if (!isAnswered) {
      return selectedOption === index ? quizStyles.selectedOption : quizStyles.option;
    }
    if (index === quiz.correct) {
      return quizStyles.correctOption;
    }
    if (selectedOption === index && index !== quiz.correct) {
      return quizStyles.wrongOption;
    }
    return quizStyles.option;
  };

  const getTextStyle = (index) => {
    if (!isAnswered) {
      return selectedOption === index ? quizStyles.selectedOptionText : quizStyles.optionText;
    }
    if (index === quiz.correct) {
      return quizStyles.correctOptionText;
    }
    if (selectedOption === index && index !== quiz.correct) {
      return quizStyles.wrongOptionText;
    }
    return quizStyles.optionText;
  };

  return (
    <>
      <ImageBackground
        source={require('../assets/images/backgrounds/Home-background.png')}
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <SafeAreaView style={quizStyles.container}>
          <View style={quizStyles.quizContainer}>
            <Text style={quizStyles.questionNumber}>Quiz Time!</Text>
            <Text style={quizStyles.questionText}>{quiz.question}</Text>
            <View style={{ width: '100%', alignItems: 'center' }}>
              {quiz.options.map((option, optIndex) => (
                <TouchableOpacity
                  key={optIndex}
                  style={[quizStyles.baseOption, getOptionStyle(optIndex)]}
                  onPress={() => handleOptionPress(optIndex)}
                >
                  <Text style={getTextStyle(optIndex)}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
      <Modal
        visible={bottomSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPressOut={() => setBottomSheetVisible(false)}>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={quizStyles.bottomSheetContainer}>
              <Image 
                source={selectedOption === quiz.correct 
                  ? require('../assets/images/Icons/quiz/congo.png') 
                  : require('../assets/images/Icons/quiz/sad.png')} 
                style={{ width: 80, height: 80, alignSelf: 'center', marginBottom: 20 }}
                resizeMode="contain"
              />
              {selectedOption === quiz.correct ? (
                <>
                  <Text style={quizStyles.correctTitle}>
                   Congratulations! You answered correctly!
                  </Text>
                  <Text style={quizStyles.correctDescription}>
                  Keep going!
                  </Text>
                </>
              ) : (
                <>
                  <Text style={quizStyles.wrongTitle}>
                    Better luck next time!
                  </Text>
                  <Text style={quizStyles.wrongDescription}>
                    There are several quizzes, train yourself to win the next one ;)
                  </Text>
                </>
              )}
              <TouchableOpacity
                style={quizStyles.button}
                onPress={() => setBottomSheetVisible(false)}
              >
                <Text style={quizStyles.buttonText}>Go back to capsule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const Swipercatagories = () => {
  const [fontsLoaded] = useFonts({
    'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
    'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
    'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.ttf'),
    'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.ttf'),
  });

  // Add loading check
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#FF6A34" />;
  }

  const navigation = useNavigation();
  const route = useRoute();
  const swiperRef = useRef(null);
  
  const categoryName = route.params?.category;
  const categoryArticles = route.params?.articles;
  const articleId = route.params?.articleId;
  
  const [articles, setArticles] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // If we have category articles, use those
        if (categoryName && categoryArticles) {
          console.log(`Loading ${categoryArticles.length} articles for category: ${categoryName}`);
          setArticles(categoryArticles);
          setIsLoaded(true);
          return;
        }

        // Otherwise fetch all articles
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const response = await axios.get(
          'https://rail.app.error6o6.tech/api/consumer/v1/article/short',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const allArticles = response.data.knowledge_capsule.map(item => ({
          id: item.id,
          category: item.category,
          image: item.Short_image,
          title: item.Short_title,
          description: item.Short_content,
          description2: item.Short_content,
          tags: item.tags,
          longarticle: []
        }));

        setArticles(allArticles);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setIsLoaded(true);
      }
    };

    fetchArticles();
  }, [categoryName, categoryArticles]);


  useEffect(() => {
    if (isLoaded && articleId && articles.length) {
      const articleIndex = articles.findIndex(article => article.id === articleId);
      if (articleIndex !== -1) {
       
        const adjustment = Math.floor(articleIndex / 5);
        setInitialIndex(articleIndex + adjustment);
      }
    }
  }, [isLoaded, articleId, articles]);

  useEffect(() => {
    if (isLoaded && swiperRef.current) {
      const timer = setTimeout(() => {
        try {
          swiperRef.current.scrollBy(initialIndex, false);
        } catch (error) {
          console.warn('Failed to auto-scroll:', error);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, initialIndex]);

  const quizData = [
    {
      question: "Which sage is attributed on the Indian treatise of Natya Shastra (Performing Arts)?",
      options: ["Vishvamitra", "Bhrigu", "Atri", "Bharat Muni"],
      correct: 3,
      reward: "50 Coins"
    },
    {
      question: "Where did the royal Naval Mutiny of 1946 began?",
      options: ["Karachi", "Calcutta", "Bombay", "Madras"],
      correct: 2,
      reward: "50 Coins"
    },
    {
      question: "The Tridosha system dates back over 3,000 years, with roots in",
      options: ["Atharva Veda", "Yajur Veda", "Rig Veda", "Sama Veda"],
      correct: 0,
      reward: "50 Coins"
    },
    {
      question: "Which one of the following is not a characteristic of the Wootz steel?",
      options: ["High Carbon Content", "Advanced Smelting Process", "Microstructure", "Flexible Alloys"],
      correct: 3,
      reward: "50 Coins"
    }
  ];
  // Build slides array and insert a quiz slide every 5 regular slides, cycling through quizzes continuously
  const slides = [];
  let quizIndex = 0;

  for (let i = 0; i < articles.length; i++) {
    slides.push(articles[i]);
    if ((i + 1) % 5 === 0) {
      slides.push({
        isQuiz: true,
        quiz: quizData[quizIndex % quizData.length] // Cycle through quizData continuously
      });
      quizIndex++;
    }
  }

  // Helper function to remove stars from a text
  const removeStars = (text) => {
    if (!text) return '';
    return text.replace(/\*+/g, '');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Whiteheader />
        <View style={{ flex: 1 }}>
          <Swiper
            style={styles.wrapper}
            showsPagination={false}
            horizontal={false}
            index={0} 
            loop={false}
            ref={swiperRef}
            removeClippedSubviews={false}
            onMomentumScrollEnd={() => {}}
          >
            {slides.map((item, index) =>
              item.isQuiz ? (
                <QuizSlide quiz={item.quiz} navigation={navigation} key={`quiz-${index}`} />
              ) : (
                <View style={styles.slide} key={index}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <Text 
                    style={styles.title}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.9}
                  >
                    {removeStars(item.title) || 'No Title Available'}
                  </Text>
                  <ScrollView
                    style={styles.descriptionContainer}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text
                      style={styles.description}
                      adjustsFontSizeToFit={true}
                      numberOfLines={Math.floor(hp(42) * 0.8)} 
                      minimumFontScale={0.9}
                    >
                      {removeStars(item.description2) || 'No Description Available'}
                    </Text>
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.readMore}
                    onPress={() => {
                      console.log("Navigating with id:", item.id);
                      amplitude.track('Detailed Article Selected', { 
                        id: item.id, 
                        title: item.title 
                      });
                      navigation.push("LongPage", { id: item.id });
                    }}
                  >
                    <Text>Tap to Learn More →</Text>
                  </TouchableOpacity>
                </View>
              )
            )}
          </Swiper>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Swipercatagories;