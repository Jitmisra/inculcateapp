import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTab from './CustomTabBar.js';
import Header from '../components/TransparentHeader.js';

import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

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
        'https://app.error6o6.tech/api/consumer/v1/home_page/',
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

const Homescreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Homescreen');
    const [trendingData, setTrendingData] = useState([]);
    const [articles, setArticles] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [userName, setUserName] = useState(''); // State to store the user's first name

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
            setTrendingData(allArticles); // Show all articles in trending
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
            link: "app.error6o6.tech/api/consumer/v1/home_page/category/5"
            
        },
        {
            image: require('../assets/images/Icons/Catagories/PS.png'),
            title: 'Political Systems',
            id: 6,
            link: "app.error6o6.tech/api/consumer/v1/home_page/category/6"
        },
        {
            image: require('../assets/images/Icons/Catagories/Events.png'),
            title: 'Events',
            id: 7,
            link: "app.error6o6.tech/api/consumer/v1/home_page/category/7"
        },
        {
            image: require('../assets/images/Icons/Catagories/Personalities.png'),
            title: 'Personalities',
            id: 9,
            link: "app.error6o6.tech/api/consumer/v1/home_page/category/9"
        },
        {
            image: require('../assets/images/Icons/Catagories/Philosophy.png'),
            title: 'Philosophy',
            id: 8,
            link: "app.error6o6.tech/api/consumer/v1/home_page/category/8"
        },
        {
            image: require('../assets/images/Icons/Catagories/Entertainment.png'),
            title: 'Entertainment',
            id: 10,
            link: "app.error6o6.tech/api/consumer/v1/home_page/category/10"
        },
        ];

    let [fontsLoaded] = useFonts({
        'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
        'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
        'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.ttf'),
        'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.ttf'),
        // Keep Outfit fonts for components that still need them
        'Outfit_500Medium': require('@expo-google-fonts/outfit/Outfit_500Medium.ttf'),
        'Outfit_600SemiBold': require('@expo-google-fonts/outfit/Outfit_600SemiBold.ttf'),
        'Outfit_400Regular': require('@expo-google-fonts/outfit/Outfit_400Regular.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
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

                        {/* Trending Section */}
                        <View style={styles.trendingSection}>
                            {/* <Text style={styles.trendingTitle}>Trending Now</Text> */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {trendingData.map((item, index) => (
                                    <TrendingCard
                                        key={index}
                                        image={item.image}
                                        title={item.title}
                                        description={item.description}
                                        onPress={() =>
                                            navigation.navigate('SwipePage', {
                                                articleId: item.id
                                            })
                                        }
                                    />
                                ))}
                            </ScrollView>
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
                                {categoriesData.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        activeOpacity={0.8}
                                        style={styles.categoryCard}
                                        onPress={async () => {
                                            try {
                                                console.log("Fetching category:", item.title);
                                                const categoryArticles = await fetchCategory(item.link);
                                                if (categoryArticles.length > 0) {
                                                    navigation.navigate('SwipePage', {
                                                        category: item.title,
                                                        articles: categoryArticles,
                                                        articleId: categoryArticles[0].id // Start with first article
                                                    });
                                                } else {
                                                    console.log('No articles found for category:', item.title);
                                                }
                                            } catch (error) {
                                                console.error('Category navigation error:', error);
                                            }
                                        }}
                                    >
                                        <Image source={item.image} style={styles.categoryImage} />
                                        <Text style={styles.categoryTitle}>{item.title}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </ScrollView>
                    <CustomTab activeTab={activeTab} onTabPress={setActiveTab} />
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
        marginRight: width * 0.03,
        
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
        width: width * 0.94,
        marginLeft: width * 0.03,
    },
    trendingCardContainer: {
        width: '100%',
        height: 273,
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#FFEAE2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
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
});

export default Homescreen;
