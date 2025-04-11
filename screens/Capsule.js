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
  Dimensions,
  InteractionManager,
  FlatList
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const SwipePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
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
  const [hasMoreData, setHasMoreData] = useState(true); // This was missing
  
  // Add new state variables for better article loading and scrolling
  const [targetArticleId, setTargetArticleId] = useState(null);
  const [hasScrolledToTarget, setHasScrolledToTarget] = useState(false);
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);
  
  const slideHeight = Dimensions.get('window').height - hp(15);
  const flatListRef = useRef(null);
  const [initialIndexSet, setInitialIndexSet] = useState(false);
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  // Add a safety timeout ref
  const safetyTimeoutRef = useRef(null);

  // New states for single article loading
  const [singleArticle, setSingleArticle] = useState(null);
  const [loadingInitialArticle, setLoadingInitialArticle] = useState(false);

  // Add a state to control initial rendering
  const [initialScrollComplete, setInitialScrollComplete] = useState(false);
  const initialViewRef = useRef(null);
  
  // Add state for category articles
  const [categoryArticles, setCategoryArticles] = useState([]);
  
  // Initialize with target article data from route params
  useEffect(() => {
    // Clear any previous state when component mounts
    setCurrentSlideIndex(0);
    setInitialRenderComplete(false);
    setInitialScrollComplete(false);
    
    // Check if we have category articles
    if (route.params?.categoryArticles && route.params.categoryArticles.length > 0) {
      // Use category articles instead of fetching all articles
      setCategoryArticles(route.params.categoryArticles);
      
      if (route.params?.articleId && route.params?.articleData) {
        // Display the specific article first
        const articleData = route.params.articleData;
        setTargetArticleId(String(articleData.id));
        setSingleArticle(articleData);
        setArticles(route.params.categoryArticles); // Use all category articles
        setCurrentSlideIndex(0);
        setIsDataReady(true);
        setInitialRenderComplete(true);
        setAllArticlesLoaded(true);
      } else {
        // No specific article, just use the category articles
        setArticles(route.params.categoryArticles);
        setIsDataReady(true);
        setInitialRenderComplete(true);
        setAllArticlesLoaded(true);
      }
    } else if (route.params?.articleId) {
      setTargetArticleId(String(route.params.articleId));
      
      // If we have direct article data from params, use it immediately
      if (route.params?.articleData) {
        const articleData = route.params.articleData;
        console.log("Using article data directly from params:", articleData.id);
        
        // Format and use the article directly
        const formattedArticle = {
          id: articleData.id,
          category: articleData.category,
          image: articleData.image,
          title: articleData.title,
          description: articleData.description,
          description2: articleData.description2 || articleData.description,
          tags: articleData.tags || [],
          longarticle: articleData.longarticle || []
        };
        
        // Set as the single article to display immediately - this prevents flickering
        setSingleArticle(formattedArticle);
        // Start with only this article to avoid flickering while scrolling
        setArticles([formattedArticle]); 
        setCurrentSlideIndex(0); // Always start at index 0 for direct navigation
        
        // Mark as initially ready but don't fetch other articles yet
        setIsDataReady(true);
        setInitialRenderComplete(true);
        
        // Fetch the rest of the articles after a delay
        setTimeout(() => {
          fetchArticles(false);
        }, 500);
      } else {
        // No article data provided, fetch all articles
        fetchArticles();
      }
    } else {
      // No specific article requested, fetch all articles normally
      fetchArticles();
    }

    // Safety timeout still in place
    safetyTimeoutRef.current = setTimeout(() => {
      setInitialRenderComplete(true);
    }, 1500);

    return () => {
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, [route.params]);

  // Modified to accept a showLoading parameter and handle the single article case better
  const fetchArticles = async (showLoading = true) => {
    if (showLoading) {
      setIsDataReady(false);
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token available');
      
      const response = await axios.get('https://rail.app.error6o6.tech/api/consumer/v1/article/short', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const capsuleArray = response.data?.knowledge_capsule || [];
      
      const formattedData = capsuleArray.map((item) => ({
        id: item.id,
        category: item.category,
        image: item.Short_image,
        title: item.Short_title,
        description: item.Short_content,
        description2: item.Short_content,
        tags: item.tags,
        longarticle: []
      }));
      
      // Handle the case when we already have a single article displayed
      if (targetArticleId && singleArticle) {
        // We need to make sure we don't disrupt viewing of the current article
        const filteredData = formattedData.filter(item => String(item.id) !== String(targetArticleId));
        
        // Update articles while keeping the target article at the beginning
        setArticles(prevArticles => {
          // Only update if our single article is still there
          if (prevArticles.length > 0 && prevArticles[0].id === singleArticle.id) {
            return [singleArticle, ...filteredData];
          }
          return formattedData;
        });
      } else {
        setArticles(formattedData);
      }
      
      setAllArticlesLoaded(true);
      setHasMoreData(false);
      
      // Mark data as ready and render complete
      if (showLoading) {
        setInitialRenderComplete(true);
      }
      
    } catch (error) {
      console.error('Error fetching articles:', error);
      // If we have a single article, still show content
      if (singleArticle) {
        setArticles([singleArticle]);
      }
      setInitialRenderComplete(true);
    } finally {
      setIsDataReady(true);
    }
  };

  // Add quizData inside the component
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

  // Simplify the buildSlides function - don't add quizzes immediately if we're showing a specific article
  const buildSlides = (articlesData = articles) => {
    // If we only have a single article from a direct navigation, don't add quizzes yet
    if (targetArticleId && articlesData.length === 1 && !initialScrollComplete) {
      return articlesData;
    }
    
    // Normal case: build slides with quizzes
    const result = [];
    let quizIndex = 0;
    
    for (let i = 0; i < articlesData.length; i++) {
      result.push(articlesData[i]);
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

  // NEW: Scroll to particular article slide if articleId is passed via route params
  // Find the target index when articles load
  const findTargetSlideIndex = () => {
    if (!route.params?.articleId || articles.length === 0) return 0;
    
    const targetIndex = slides.findIndex(
      (slide) => !slide.isQuiz && String(slide.id) === String(route.params.articleId)
    );
    return targetIndex !== -1 ? targetIndex : 0;
  };

  // Get the initial index when slides are ready
  useEffect(() => {
    if (slides.length > 0 && route.params?.articleId && !initialIndexSet) {
      setCurrentSlideIndex(findTargetSlideIndex());
      setInitialIndexSet(true);
    }
  }, [slides, route.params, initialIndexSet]);

  // This function provides exact item layout information to help FlatList scroll accurately
  const getItemLayout = (data, index) => ({
    length: slideHeight,
    offset: slideHeight * index,
    index,
  });

  // Handle scroll to target article when all data is ready
  useEffect(() => {
    // Only try scrolling if we have articles, a target ID, and haven't scrolled yet
    if (allArticlesLoaded && targetArticleId && !hasScrolledToTarget && slides.length > 0) {
      const targetIndex = slides.findIndex(
        slide => !slide.isQuiz && String(slide.id) === targetArticleId
      );
      
      if (targetIndex !== -1 && flatListRef.current) {
        // We need to wrap this in a timeout to ensure the FlatList has rendered
        setTimeout(() => {
          try {
            console.log(`Scrolling to article index: ${targetIndex}`);
            flatListRef.current.scrollToIndex({
              index: targetIndex,
              animated: false,
              viewPosition: 0,
              viewOffset: 0
            });
            setCurrentSlideIndex(targetIndex);
            setHasScrolledToTarget(true);
          } catch (error) {
            console.error('Error scrolling to article:', error);
          }
        }, 300);
      }
    }
  }, [allArticlesLoaded, targetArticleId, slides, hasScrolledToTarget]);

  // Improved scroll-to-index failure handler with retry mechanism
  const handleScrollToIndexFailed = (info) => {
    console.log('Scroll to index failed:', info);
    
    // Wait a moment and retry with a different approach
    setTimeout(() => {
      if (flatListRef.current) {
        // Try scrolling to a nearby index first, then to the target
        const nearestIndex = Math.floor(info.index / 2);
        
        flatListRef.current.scrollToIndex({
          index: nearestIndex,
          animated: false
        });
        
        // Then after a short delay, try scrolling to the actual target
        setTimeout(() => {
          flatListRef.current.scrollToIndex({
            index: info.index,
            animated: true
          });
        }, 200);
      }
    }, 300);
  };

  // Render an item in the FlatList
  const renderItem = ({ item, index }) => {
    return (
      <View style={{ height: slideHeight, width: '100%' }}>
        {item.isQuiz ? (
          <QuizSlide quiz={item.quiz} />
        ) : (
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
    );
  };

  // This effect sets up the initial index when slides and target article ID are ready
  useEffect(() => {
    if (slides.length > 0 && targetArticleId) {
      const targetIndex = slides.findIndex(
        slide => !slide.isQuiz && String(slide.id) === String(targetArticleId)
      );
      
      if (targetIndex !== -1) {
        setCurrentSlideIndex(targetIndex);
        setInitialIndexSet(true);
      }
    }
  }, [slides, targetArticleId]);
  
  // Wait for layout to complete before rendering the FlatList
  const onLayoutComplete = () => {
    if (initialIndexSet && flatListRef.current) {
      // Once layout is ready, scroll directly to target position
      requestAnimationFrame(() => {
        try {
          flatListRef.current.scrollToIndex({
            index: currentSlideIndex,
            animated: false,
            viewPosition: 0
          });
          // After a short delay, mark initial render as complete
          setTimeout(() => {
            setInitialRenderComplete(true);
          }, 50);
        } catch (error) {
          console.error('Error in initial scroll:', error);
          setInitialRenderComplete(true); // Show content anyway if error
        }
      });
    }
  };

  // Improved check before rendering content
  const shouldShowLoading = 
    !fontsLoaded || 
    !isDataReady || 
    (targetArticleId && !initialRenderComplete);

  if (shouldShowLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}}>
        <ActivityIndicator size="large" color="#FF6A34" />
        <Text style={{marginTop: 10, fontFamily: 'MonaSans-Medium'}}>
          {isDataReady ? 'Preparing your article...' : 'Loading articles...'}
        </Text>
      </View>
    );
  }

  // Special case for single article view with direct navigation
  if (singleArticle && targetArticleId && !initialScrollComplete && slides.length === 1) {
    const item = slides[0];
    
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <Whiteheader2 />
          <View 
            style={{ height: slideHeight }}
            ref={initialViewRef}
            onLayout={() => {
              // After the first render with single article, mark scroll as complete to allow normal browsing
              setInitialScrollComplete(true);
            }}
          >
            <View style={{ height: slideHeight, width: '100%' }}>
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
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Normal rendering with FlatList (after we've shown the initial single article view)
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Whiteheader2 />
        <View style={{ height: slideHeight }}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.isQuiz ? `quiz-${index}` : `article-${item.id}`}
            pagingEnabled
            initialScrollIndex={singleArticle && targetArticleId ? 0 : currentSlideIndex}
            showsVerticalScrollIndicator={false}
            snapToInterval={slideHeight}
            snapToAlignment="start"
            decelerationRate="fast"
            getItemLayout={getItemLayout}
            onScroll={(event) => {
              const slideIndex = Math.round(
                event.nativeEvent.contentOffset.y / slideHeight
              );
              
              if (slideIndex !== currentSlideIndex) {
                handleSlideChange(slideIndex);
              }
            }}
            scrollEventThrottle={16}
            onScrollToIndexFailed={handleScrollToIndexFailed}
            initialNumToRender={25}
            maxToRenderPerBatch={10}
            windowSize={15}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
          />
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

export default SwipePage;