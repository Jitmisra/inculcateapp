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
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Whiteheader2 from '../components/Whiteheader2';
import { useFonts } from 'expo-font';
// Import Amplitude Analytics
import * as amplitude from '@amplitude/analytics-react-native';

// Add a responsive font-size helper.
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const responsiveFontSize = (size) => Math.round(size * (SCREEN_WIDTH / guidelineBaseWidth));

// Helper function
const removeStars = (text) => {
  if (!text) return '';
  return text.replace(/\*+/g, '');
};

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
    elevation: 5
  },
  option: {
    borderColor: '#FFC1A6',
    backgroundColor: '#FDF2EF',
    shadowColor: '#FF6A34'
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
    shadowColor: '#FF6A34'
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
    shadowColor: '#4CAF50'
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
    shadowColor: '#F44336'
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
    elevation: 5
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

const QuizSlide = ({ quiz }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleOptionPress = (index) => {
    if (!isAnswered) {
      setSelectedOption(index);
      setIsAnswered(true);
      setBottomSheetVisible(true);
      // Track quiz answer event
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
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPressOut={() => setBottomSheetVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={quizStyles.bottomSheetContainer}>
              <Image
                source={
                  selectedOption === quiz.correct
                    ? require('../assets/images/Icons/quiz/congo.png')
                    : require('../assets/images/Icons/quiz/sad.png')
                }
                style={{ width: 80, height: 80, alignSelf: 'center', marginBottom: 20 }}
                resizeMode="contain"
              />
              {selectedOption === quiz.correct ? (
                <>
                  <Text style={quizStyles.correctTitle}>
                    Congratulations! You answered correctly!
                  </Text>
                  <Text style={quizStyles.correctDescription}>Keep going!</Text>
                </>
              ) : (
                <>
                  <Text style={quizStyles.wrongTitle}>Better luck next time!</Text>
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
    backgroundColor: '#FFFFFF',
    position: 'relative', // Add this to enable absolute positioning within slide
  },
  imageContainer: {
    width: wp(100),
    height: hp(32),
    marginTop: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    paddingHorizontal: wp(5),
    marginTop: hp(1),
  },
  title: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    fontFamily: 'MonaSans-Bold',
    numberOfLines: 2, // Limit to two lines
    ellipsizeMode: 'tail', // Add ellipsis at the end
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.7
  },
  descriptionOuterContainer: {
    
    height: hp(33), // Adjust height to make room for tags and button
    paddingHorizontal: wp(5),
  },
  descriptionContainer: {
    height: '100%',
  },
  description: {
    fontSize: responsiveFontSize(15.5),
    fontFamily: 'MonaSans-Regular',
    lineHeight: responsiveFontSize(16) * 1.05
  },
  readMore: {
    width: wp(100),
    height: hp(7),
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Position at the bottom
    bottom: 0,
    left: 0
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: wp(5),
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  tagItem: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'MonaSans-Medium',
    color: '#4B4B4B', // updated from '#333'
  },
  moreTagsButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'MonaSans-Bold',
  },
  closeButton: {
    fontSize: 16,
    fontFamily: 'MonaSans-Medium',
    color: '#FF6A34',
  },
  modalTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const testingswiper = () => {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
    'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
    'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.ttf'),
    'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.ttf')
  });

  const [articles, setArticles] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideStartTime, setSlideStartTime] = useState(Date.now());
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  
  // Add pagination state variables
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const articlesPerPage = 5;
  
  const slideHeight = Dimensions.get('window').height - hp(15);
  const scrollViewRef = useRef(null);

  // Initial fetch - only get first 5 articles
  useEffect(() => {
    fetchArticles(1);
  }, []);

  // Function to fetch articles with pagination
  const fetchArticles = async (page) => {
    try {
      if (page === 1) {
        setIsDataReady(false);
      } else {
        setIsLoadingMore(true);
        console.log(`Fetching more articles: page ${page}`);
      }
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token available');
      
      // In a real implementation, your API would support pagination parameters
      // For this example, we'll simulate pagination by slicing the full dataset
      const response = await axios.get('https://rail.app.error6o6.tech/api/consumer/v1/article/short', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const capsuleArray = response.data?.knowledge_capsule || [];
      
      // Simulate pagination by slicing the data
      const startIndex = (page - 1) * articlesPerPage;
      const endIndex = startIndex + articlesPerPage;
      const paginatedData = capsuleArray.slice(startIndex, endIndex);
      
      // Check if we've reached the end
      if (paginatedData.length < articlesPerPage) {
        setHasMoreData(false);
      }
      
      const formattedData = paginatedData.map((item) => ({
        id: item.id,
        category: item.category,
        image: item.Short_image,
        title: item.Short_title,
        description: item.Short_content,
        description2: item.Short_content,
        tags: item.tags,
        longarticle: []
      }));
      
      // Append new articles to existing ones
      if (page === 1) {
        setArticles(formattedData);
      } else {
        setArticles(prevArticles => [...prevArticles, ...formattedData]);
      }
      
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsDataReady(true);
      setIsLoadingMore(false);
    }
  };

  // Handle scrolling to check if we need to load more
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const containerHeight = event.nativeEvent.layoutMeasurement.height;
    
    // When user scrolls to 80% of the content, load more
    if (offsetY + containerHeight > contentHeight * 0.8) {
      loadMoreArticles();
    }
  };

  // Load more articles function
  const loadMoreArticles = () => {
    if (!isLoadingMore && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchArticles(nextPage);
    }
  };

  // Define quizData inside the component - this was missing
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
    },
    {}
  ];

  // Build slides (with quiz slides) based on available articles
  const buildSlides = () => {
    const result = [];
    let quizIndex = 0;
    
    for (let i = 0; i < articles.length; i++) {
      result.push(articles[i]);
      // Insert a quiz slide after every 5 articles if there is a valid quiz object
      if ((i + 1) % 5 === 0 && quizIndex < quizData.length && quizData[quizIndex]?.question) {
        result.push({ isQuiz: true, quiz: quizData[quizIndex] });
        quizIndex++;
      }
    }
    
    return result;
  };

  const slides = buildSlides();

  // Handle slide change to track duration on each short article slide
  const handleSlideChange = (newIndex) => {
    const now = Date.now();
    const viewDuration = now - slideStartTime;
    // Track only if the previous slide was a short article (not a quiz)
    const previousSlide = slides[currentSlideIndex];
    if (previousSlide && !previousSlide.isQuiz) {
      amplitude.track('Short Article View Duration', {
        id: previousSlide.id,
        title: previousSlide.title,
        durationMinutes: viewDuration / 60000  // duration in minutes
      });
    }
    setCurrentSlideIndex(newIndex);
    setSlideStartTime(now);
  };

  // Add this function to render tags with limited display
  const renderTags = (item, maxDisplayTags = 3) => {
    if (!item.tags || item.tags.length === 0) return null;
    // Filter out tags that are empty or contain only spaces
    const validTags = item.tags.filter(tag => tag.name.trim() !== '');
    if (validTags.length === 0) return null;

    const displayTags = validTags.slice(0, maxDisplayTags);
    const hasMoreTags = validTags.length > maxDisplayTags;

    return (
      <View style={styles.tagsContainer}>
        {displayTags.map((tag) => (
          <View key={tag.id} style={styles.tagItem}>
            <Text style={styles.tagText}>{tag.name.replace(/_/g, ' ').trim()}</Text>
          </View>
        ))}
        {hasMoreTags && (
          <TouchableOpacity 
            style={styles.moreTagsButton}
            onPress={() => {
              setSelectedTags(validTags);
              setTagModalVisible(true);
            }}
          >
            <Text style={styles.tagText}>more...</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#FF6A34" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Whiteheader2 />
        {/* Updated slider: a ScrollView occupying full height below Whiteheader2 */}
        <View style={{ height: slideHeight }}>
          <ScrollView
            ref={scrollViewRef}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}  // Added onScroll handler
            scrollEventThrottle={16} // Optimize scroll event firing
            onMomentumScrollEnd={(e) => {
              const scrollHeight = e.nativeEvent.layoutMeasurement.height;
              const newIndex = Math.round(e.nativeEvent.contentOffset.y / scrollHeight);
              
              // Log slide index and the id from the fetched article (item.id)
              console.log("Slide index:", newIndex);
              const currentSlide = slides[newIndex];
              if (currentSlide && !currentSlide.isQuiz) {
                console.log("id:", currentSlide.id); // using id from formattedData (item.id)
              } else if (currentSlide && currentSlide.isQuiz) {
                console.log("Quiz slide");
              }
              
              handleSlideChange(newIndex);
            }}
            // Add these props to optimize scrolling performance
            removeClippedSubviews={true}
            maxToRenderPerBatch={3}
            windowSize={5}
            initialNumToRender={6} // Render enough for index 4 to exist
          >
            {slides.map((item, index) => (
              <View style={{ height: slideHeight }} key={index}>
                {item.isQuiz ? (
                  <QuizSlide quiz={item.quiz} />
                ) : (
                  // ...existing article slide code...
                  <View style={styles.slide}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.titleContainer}>
                      <Text
                        style={styles.title}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        adjustsFontSizeToFit={true}
                        minimumFontScale={0.7}
                      >
                        {removeStars(item.title) || 'No Title Available'}
                      </Text>
                    </View>
                    {renderTags(item, 3)}
                    <View style={styles.descriptionOuterContainer}>
                      <ScrollView
                        style={styles.descriptionContainer}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                      >
                        <Text
                          style={styles.description}
                          adjustsFontSizeToFit={true}
                          numberOfLines={Math.floor(hp(42) * 0.8)}
                          minimumFontScale={0.5}
                        >
                          {removeStars(item.description2) || 'No Description Available'}
                        </Text>
                      </ScrollView>
                    </View>
                    <TouchableOpacity
                      style={styles.readMore}
                      onPress={() => {
                        amplitude.track('Detailed Article Selected', { id: item.id, title: item.title });
                        navigation.push("LongPage", { id: item.id, articleData: item });
                      }}
                    >
                      <Text>Tap to Learn More →</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
            
            {/* Show loading indicator at bottom when loading more */}
            {isLoadingMore && (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#FF6A34" />
                <Text style={{ marginTop: 5 }}>Loading more articles...</Text>
              </View>
            )}
          </ScrollView>
        </View>
        {/* ...existing tags modal code... */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={tagModalVisible}
          onRequestClose={() => setTagModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1} 
            onPress={() => setTagModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tags</Text>
                <TouchableOpacity onPress={() => setTagModalVisible(false)}>
                  <Text style={styles.closeButton}>Close</Text>
                </TouchableOpacity>
              </View>
              <ScrollView>
                <View style={styles.modalTagsContainer}>
                  {selectedTags.map((tag) => (
                    <View key={tag.id} style={styles.tagItem}>
                      <Text style={styles.tagText}>{tag.name.replace(/_/g, ' ').trim()}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default testingswiper;