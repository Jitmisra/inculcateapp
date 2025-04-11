import { 
  View, 
  ImageBackground, 
  Image, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Platform,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTab from '../components/CustomTabBar';
import Header from '../components/TransparentHeader';
import { useFonts } from 'expo-font';
import * as amplitude from '@amplitude/analytics-react-native';

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

const fetchCategory = async (categoryLink) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const url = categoryLink.startsWith('http') ? categoryLink : `https://${categoryLink}`;
    console.log('Fetching category data from URL:', url);
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Use the capsule array from response.data.category.Knowledge_capsule
    const capsuleArray = response.data.category.Knowledge_capsule;
    const batch = capsuleArray.map(item => ({
      id: item.id,
      category: item.category,
      image: item.Short_image,
      title: item.Short_title,
      description: item.Short_content,
      description2: item.Short_content,
      tags: item.tags,
      longarticle: []
    }));
    return batch;
  } catch (error) {
    console.error('Error fetching category batch:', error);
    return [];
  }
};

const Explore = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Explore');

  // NEW: loader state for category
  const [loadingCategory, setLoadingCategory] = useState(false);

  const [fontsLoaded] = useFonts({
    'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
    'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
    'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.ttf'),
    'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#FF6A34" />;
  }


  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground 
        source={require('../assets/images/backgrounds/Home-background.png')} 
        style={styles.imageBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <Header />
          <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.relative}>
              <View style={styles.absoluteImageContainer}>
                <Image 
                  source={require('../assets/images/Icons/Catagories/catagories-screen-icon.png')}
                  style={styles.catagoriesIcon}
                />
              </View>
              <View style={styles.contentContainer}>
                <Image 
                  source={require('../assets/images/Icons/bottombar/Exploreiconactive.png')}
                  style={styles.exploreIcon}
                />
                <Text style={styles.title}>Explore Content</Text>
                <Text style={styles.subtitle}>
                  Discover content related to your interest.
                </Text>
                <View style={styles.categoriesWrapper}>
                  {categoriesData.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.8}
                      style={styles.categoryCard}
                      onPress={async () => {
                        try {
                          setLoadingCategory(true);
                          console.log("Fetching category:", item.title);
                          // Add amplitude tracking here
                          amplitude.track('CategorySelected', { category: item.title });
                          const categoryArticles = await fetchCategory(item.link);
                          setLoadingCategory(false);
                          if (categoryArticles.length > 0) {
                            // Navigate directly to SwipePage instead of Swipercatagories
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
                          setLoadingCategory(false);
                        }
                      }}
                    >
                      <Image 
                        source={item.image}
                        style={styles.categoryImage}
                      />
                      <Text style={styles.categoryText}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
          <CustomTab 
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
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
    overflow: 'hidden',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 64,
  },
  relative: {
    position: 'relative',
  },
  absoluteImageContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  catagoriesIcon: {
    height: 167,
    width: 167,
    resizeMode: 'contain',
  },
  contentContainer: {
    backgroundColor: 'white',
    height: '90%',
    width: '100%',
    marginTop: 103,
    alignItems: 'center',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    paddingTop: '20%',
    paddingBottom: '10%',
  },
  exploreIcon: {
    height: 64,
    width: 64,
    marginBottom: 0,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 23,
    color: '#25252D',
    textAlign: 'center',
    fontFamily: 'MonaSans-Bold'
  },
  subtitle: {
    fontSize: 16,
    color: '#666887',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'MonaSans-Regular'
  },
  categoriesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  categoryCard: {
    width: 150,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 8,
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
  categoryText: {
    fontSize: 14,
    color: '#25252D',
    marginTop: 5,
    fontFamily: 'MonaSans-Medium'
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
});

export default Explore;