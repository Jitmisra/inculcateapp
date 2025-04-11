import React, { useState, useEffect, useRef } from 'react';
import {
    ImageBackground,
    Text,
    View,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Platform,
    RefreshControl,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Animated, // Add Animated import
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTab from '../components/CustomTabBar.js';
import Header from '../components/TransparentHeader.js';
import Swiper from 'react-native-swiper'; // Add/modify this import

import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
// Import Amplitude Analytics
import * as amplitude from '@amplitude/analytics-react-native';

const { width } = Dimensions.get('window');

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const TrendingCard = ({ image, title, description, onPress }) => {
    // Function to clean title text by removing **
    const cleanTitle = (text) => {
        return text.replace(/\*\*/g, '');
    };

    // Function to limit words
    const limitWords = (text, limit) => {
        const words = text.split(' ');
        if (words.length > limit) {
            return words.slice(0, limit).join(' ') + '...';
        }
        return text;
    };

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.trendingCardWrapper}>
            <View style={styles.trendingCardContainer}>
                <Image
                    source={typeof image === 'string' ? { uri: image } : image}
                    style={styles.trendingCardImage}
                    resizeMode="cover"
                />
                <View style={styles.trendingCardContent}>
                    <Text
                        style={styles.trendingCardTitle}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        adjustsFontSizeToFit={true}
                        minimumFontScale={0.8} // Adjust this value if needed
                    >
                        {cleanTitle(title)}
                    </Text>
                    <Text style={styles.trendingCardDescription}>
                        {limitWords(description, 7)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Update the fetchBatchData function to get all articles without pagination
const fetchBatchData = async (token) => {
    const response = await axios.get(
        'https://rail.app.error6o6.tech/api/consumer/v1/home_page/',
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const capsuleArray = response.data.knowledge_capsule;
    return capsuleArray.map(item => ({
        id: item.id,
        category: item.category,
        image: item.Short_image,
        title: item.Short_title,
        description: item.Short_content,
        description2: item.Short_content,
        tags: item.tags,
        longarticle: []
    }));
};

// Function to fetch data for a specific category based on the provided link
const fetchCategory = async (categoryLink) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const url = categoryLink.startsWith('http') ? categoryLink : `https://${categoryLink}`;
        console.log('Fetching category data from URL:', url);
        
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Make sure we're accessing the correct data structure
        const capsuleArray = response.data.category.Knowledge_capsule;
        console.log('Category articles found:', capsuleArray.length);
        
        return capsuleArray.map(item => ({
            id: item.id,
            category: item.category,
            image: item.Short_image,
            title: item.Short_title,
            description: item.Short_content,
            description2: item.Short_content,
            tags: item.tags,
            longarticle: []
        }));
    } catch (error) {
        console.error('Error fetching category:', error);
        return [];
    }
};

// Helper function for skeleton
const Skeleton = ({ width, height, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });
  
  return (
    <View style={[{ width, height, backgroundColor: '#E0E0E0', overflow: 'hidden' }, style]}>
      <Animated.View 
        style={{
          width: '100%',
          height: '100%',
          transform: [{ translateX }],
          backgroundColor: 'rgba(255,255,255,0.3)',
        }}
      />
    </View>
  );
};

// Skeleton component for trending cards
const TrendingCardSkeleton = () => {
  const cardWidth = width - 20;
  return (
    <View style={styles.trendingCardWrapper}>
      <View style={[styles.trendingCardContainer, { backgroundColor: 'transparent' }]}>
        <Skeleton width={cardWidth} height={180} style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
        <View style={{ padding: 12 }}>
          <Skeleton width={cardWidth - 24} height={20} style={{ marginBottom: 8, borderRadius: 4 }} />
          <Skeleton width={(cardWidth - 24) * 0.7} height={14} style={{ borderRadius: 4 }} />
        </View>
      </View>
    </View>
  );
};

// Skeleton component for category cards
const CategoryCardSkeleton = () => {
  return (
    <View style={styles.categoryCard}>
      <Skeleton width={50} height={50} style={{ borderRadius: 25 }} />
      <Skeleton width={80} height={16} style={{ marginTop: 8, borderRadius: 4 }} />
    </View>
  );
};

const HomeScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Homescreen');
    const [trendingData, setTrendingData] = useState([]);
    const [articles, setArticles] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [userName, setUserName] = useState(''); // State to store the user's first name
    const [loadingCategory, setLoadingCategory] = useState(false); // NEW state

    // Load cached trending cards on mount
    useEffect(() => {
        const loadCachedTrending = async () => {
            try {
                const cachedTrending = await AsyncStorage.getItem('cachedTrending');
                if (cachedTrending) {
                    setTrendingData(JSON.parse(cachedTrending));
                }
            } catch (error) {
                console.error('Error loading cached trending data:', error);
            }
        };
        loadCachedTrending();
    }, []);

    // Fetch and set the user name (first word only)
    useEffect(() => {
        const getUserName = async () => {
            try {
                const storedName = await AsyncStorage.getItem('userName');
                if (storedName) {
                    const firstName = storedName.split(' ')[0];
                    setUserName(firstName);
                }
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
        getUserName();
    }, []);

    const fetchAllArticles = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.error('No token found');
                return;
            }
            
            const allArticles = await fetchBatchData(token);
            console.log('Total articles fetched:', allArticles.length);
            
            setArticles(allArticles);
            // Save the top 5 articles to AsyncStorage and update the trending view
            const top5Articles = allArticles.slice(0, 5);
            setTrendingData(top5Articles);
            
            await AsyncStorage.setItem('cachedTrending', JSON.stringify(top5Articles));
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    useEffect(() => {
        fetchAllArticles();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAllArticles();
        setRefreshing(false);
    };

    const categoriesData = [
        {
          image: require('../assets/images/Icons/Catagories/Science.png'),
          title: 'Science',
          id: 4,
          link: "rail.app.error6o6.tech/api/consumer/v1/home_page/category/5"
        },
        {
          image: require('../assets/images/Icons/Catagories/PS.png'),
          title: 'Political Systems',
          id: 6,
          link: "rail.app.error6o6.tech/api/consumer/v1/home_page/category/6"
        },
        {
          image: require('../assets/images/Icons/Catagories/Events.png'),
          title: 'Events',
          id: 7,
          link: "rail.app.error6o6.tech/api/consumer/v1/home_page/category/7"
        },
        {
          image: require('../assets/images/Icons/Catagories/Personalities.png'),
          title: 'Personalities',
          id: 9,
          link: "rail.app.error6o6.tech/api/consumer/v1/home_page/category/9"
        },
        {
          image: require('../assets/images/Icons/Catagories/Philosophy.png'),
          title: 'Philosophy',
          id: 8,
          link: "rail.app.error6o6.tech/api/consumer/v1/home_page/category/8"
        },
        {
          image: require('../assets/images/Icons/Catagories/Entertainment.png'),
          title: 'Entertainment',
          id: 10,
          link: "rail.app.error6o6.tech/api/consumer/v1/home_page/category/10"
        },
      ];

      
    let [fontsLoaded] = useFonts({
        'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
        'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
        'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.ttf'),
        'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.ttf'),
        
     
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={require('../assets/images/backgrounds/Home-background.png')}
                    style={styles.imageBackground}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <Header />
                        <View style={styles.loadingContainer}>
                            {/* Welcome skeleton */}
                            <View style={styles.welcomeContainer}>
                                <Skeleton width={250} height={30} style={{ marginBottom: 8, borderRadius: 4 }} />
                                <Skeleton width={200} height={24} style={{ marginBottom: 16, borderRadius: 4 }} />
                            </View>

                            {/* Trending skeleton */}
                            <View style={styles.trendingSection}>
                                <TrendingCardSkeleton />
                            </View>

                            {/* Explore skeleton */}
                            <View style={styles.exploreContainer}>
                                <Skeleton width={width * 0.9} height={2} style={{ marginVertical: 20 }} />
                            </View>

                            {/* Categories skeleton */}
                            <View style={styles.categoriesSection}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {[1, 2, 3, 4].map((item, index) => (
                                        <CategoryCardSkeleton key={index} />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                        <CustomTab activeTab={activeTab} onTabPress={setActiveTab} />
                    </SafeAreaView>
                </ImageBackground>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <ImageBackground
                source={require('../assets/images/backgrounds/Home-background.png')}
                style={styles.imageBackground}
            >
                <SafeAreaView style={styles.safeArea}>
                    <Header />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#FF6A34"
                                colors={['#FF6A34']}
                            />
                        }
                    >
                        {/* Welcome Section */}
                        <View style={styles.welcomeContainer}>
                            <View style={styles.welcomeTextRow}>
                                <Text style={styles.welcomeText}>Welcome back </Text>
                                <Text style={styles.highlightText}>{userName || 'User'}!</Text>
                            </View>
                            <Text style={styles.subHeaderText}>Ready to in.culcate?</Text>
                            <View style={styles.instructionContainer}>
                                <Image 
                                    source={require('../assets/images/Icons/click.png')}
                                    style={{ width: 15, height: 15, marginRight: 5 }}
                                />
                                <Text style={styles.instructionText}>
                                    Tap on any card or swipe left to start inculcating!
                                </Text>
                            </View>
                        </View>

                        {/* Trending Banners Section */}
                        <View style={styles.trendingSection}>
                            {trendingData.length === 0 ? (
                                // Replace with skeleton UI for trending cards
                                <TrendingCardSkeleton />
                            ) : (
                                <Swiper
                                    autoplay
                                    autoplayTimeout={3}
                                    showsPagination={true}
                                    dot={<View style={styles.dotStyle} />}
                                    activeDot={<View style={styles.activeDotStyle} />}
                                    containerStyle={styles.swiperContainer}
                                    paginationStyle={styles.paginationStyle} // Positions dots below the card
                                >
                                    {trendingData.map((item, index) => (
                                        <View key={index} style={styles.trendingCardWrapper}>
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={() => {
                                                    // Track trending card selection event
                                                    amplitude.track('Article Selected', { id: item.id, title: item.title });
                                                    navigation.navigate('SwipePage', {
                                                        articleId: item.id,
                                                        articleData: item  // Pass the full article data object
                                                    });
                                                }}
                                            >
                                                <View style={styles.trendingCardContainer}>
                                                    <Image
                                                        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                                                        style={styles.trendingCardImage}
                                                        resizeMode="cover"
                                                    />
                                                    <View style={styles.trendingCardContent}>
                                                        <Text
                                                            style={styles.trendingCardTitle}
                                                            numberOfLines={2}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {item.title}
                                                        </Text>
                                                        <Text
                                                            style={styles.trendingCardDescription}
                                                            numberOfLines={1}          // Limit description to one line
                                                            ellipsizeMode="tail"        // Append ... if it overflows
                                                        >
                                                            {item.description}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </Swiper>
                            )}
                        </View>

                        {/* Explore Topics Section */}
                        <View style={styles.exploreContainer}>
                            <View style={styles.leftLine} />
                            <Image source={require('../assets/images/Icons/explore.png')} style={styles.exploreIcon} />
                            <Text style={styles.exploreText}>Explore Topics</Text>
                            <View style={styles.rightLine} />
                        </View>

                        {/* Categories Section */}
                        <View style={styles.categoriesSection}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {categoriesData.length === 0 ? (
                                    // Show skeleton categories if no data
                                    [1, 2, 3, 4].map((item, index) => (
                                        <CategoryCardSkeleton key={index} />
                                    ))
                                ) : (
                                    categoriesData.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={0.8}
                                            style={styles.categoryCard}
                                            onPress={async () => {
                                                setLoadingCategory(true);
                                                try {
                                                    // Track category card selection
                                                    amplitude.track('CategorySelected', { category: item.title });
                                                    console.log("Fetching category:", item.title);
                                                    const categoryArticles = await fetchCategory(item.link);
                                                    if (categoryArticles.length > 0) {
                                                        // Navigate directly to SwipePage with the first article
                                                        const firstArticle = categoryArticles[0];
                                                        navigation.navigate('SwipePage', {
                                                            articleId: firstArticle.id,
                                                            articleData: firstArticle, // Pass the full article data
                                                            categoryArticles: categoryArticles // Pass all articles from this category
                                                        });
                                                    } else {
                                                        console.log('No articles found for category:', item.title);
                                                    }
                                                } catch (error) {
                                                    console.error('Category navigation error:', error);
                                                } finally {
                                                    setLoadingCategory(false);
                                                }
                                            }}
                                        >
                                            <Image source={item.image} style={styles.categoryImage} />
                                            <Text style={styles.categoryTitle}>{item.title}</Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    </ScrollView>
                    <CustomTab activeTab={activeTab} onTabPress={setActiveTab} />
                    {loadingCategory && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#FF6A34" />
                        </View>
                    )}
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFC4AF',
    },
    imageBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContainer: {
        paddingBottom: 100,
        paddingTop: 10,
    },
    welcomeContainer: {
        paddingHorizontal: 16,
        marginTop: 24,
        alignItems: 'center',
    },
    welcomeTextRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    welcomeText: {
        color: '#25252D',
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'MonaSans-Bold'
    },
    highlightText: {
        color: '#FF6A34',
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'MonaSans-Bold'
    },
    subHeaderText: {
        color: '#25252D',
        fontSize: 20,
        marginTop: 1,
        fontFamily: 'MonaSans-SemiBold'
    },
    instructionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    instructionText: {
        color: '#8A819D',
        fontSize: 12,
        fontFamily: 'MonaSans-SemiBold'
    },
    exploreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    leftLine: {
        width: '8%',
        height: 2,
        backgroundColor: '#FF6A34',
        marginRight: -5,
    },
    rightLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#FF6A34',
        marginLeft: 5,
    },
    exploreIcon: {
        width: 24,
        height: 24,
        marginHorizontal: 10,
    },
    exploreText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#25252D',
        fontFamily: 'MonaSans-Bold'
    },
    trendingSection: {
        marginTop: 24,
        // Removed extra marginRight to use full width
    },
    trendingTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#25252D',
        paddingHorizontal: 16,
        marginBottom: 16,
        fontFamily: 'MonaSans-Bold'
    },
    trendingCardWrapper: {
        width: width - 20,          // Uses nearly full width (with horizontal gap)
        marginHorizontal: 10,         // Gap on both the left and right sides
    },
    trendingCardContainer: {
        width: '100%',
        height: 273,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        // iOS shadow
        shadowColor: '#FFEAE2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        // Android shadow
        elevation: 4,
    },
    trendingCardImage: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    trendingCardContent: {
        padding: 12,
        
    },
    trendingCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#25252D',
        fontFamily: 'MonaSans-Bold'
    },
    trendingCardDescription: {
        fontSize: 12,
        color: '#8A819D',
        marginTop: 3,
        fontFamily: 'MonaSans-SemiBold'
    },
    categoriesSection: {
        marginTop: 0,
        marginLeft: 10,
    },
    categoryCard: {
        width: 150,
        height: 100,
        backgroundColor: 'white',
        borderRadius: 15,
        marginRight: 10,

        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#FFEAE2",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
    },
    categoryImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#25252D',
        marginTop: 8,
        fontFamily: 'MonaSans-Regular'
    },
    swiperContainer: {
        height: 300,
    },
    dotStyle: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 3,
    },
    activeDotStyle: {
        backgroundColor: '#FF6A34',
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 3,
    },
    paginationStyle: {
        position: 'absolute',
        bottom: -1, // Places the dots below the card
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
});

export default HomeScreen;
