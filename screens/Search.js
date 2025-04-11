import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFonts } from 'expo-font';
// Import Amplitude Analytics
import * as amplitude from '@amplitude/analytics-react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5EF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF5EF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 10,
    backgroundColor: '#FFF5EF',
    height: hp(8),
    width: wp(100),
    
  },
  inculcate: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'MonaSans-Bold'
  },
  in: {
    color: '#ff6a34',
  },
  culcate: {
    color: '#151445',
  },
  searchInput: {
    height: "50",
    
    borderColor: '#FFD4C4',
    borderWidth: 1,
    borderRadius: 25,
    marginHorizontal: 16,
    marginTop: 1,
    marginBottom: 6, 
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    fontSize: wp(4),
    fontFamily: 'MonaSans-Regular',
    ...Platform.select({
      ios: {
        shadowColor: '#FFEAE2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  itemContainer: {
    flexDirection: 'row', 
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#FFEAE2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: wp(4.2),
    fontWeight: '700',
    color: '#333',
    fontFamily: 'MonaSans-SemiBold'
  },
  itemDescription: {
    fontSize: wp(3.5),
    color: '#555',
    marginTop: 4,
    fontFamily: 'MonaSans-Regular'
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: wp(4),
    color: '#999',
    marginTop: 30,
    fontFamily: 'MonaSans-Regular'
  },
  arrowIcon: {
    position: 'absolute',
    top: hp(3),
    left: wp(5),
  },
  arrowIconf: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5EF',
  },
});

const removeStars = (text) => {
  if (!text) return '';
  return text.replace(/\*+/g, '');
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
    'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
    'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.ttf'),
    'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.ttf'),
  });


  const prevCachedArticles = () => articles;

  const fetchAllArticles = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        'https://rail.app.error6o6.tech/api/consumer/v1/article/short',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const capsuleArray = response.data.knowledge_capsule;
 
      const allArticles = capsuleArray.map((item) => ({
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
      setFilteredArticles(allArticles);

      AsyncStorage.setItem('cachedArticles', JSON.stringify(allArticles.slice(-10)));
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchAllArticles();
      setLoading(false);
    })();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredArticles(articles);
    } else {
      // Track search query when user types
      amplitude.track('Search Query', {
        query: query.trim(),
        resultCount: filteredArticles.length
      });
      
      const filtered = articles.filter(article => {
        const cleanTitle = removeStars(article.title || '').toLowerCase();
        const cleanDescription = removeStars(article.description || '').toLowerCase();
        const searchQuery = query.toLowerCase();
        
        return cleanTitle.includes(searchQuery) || 
               cleanDescription.includes(searchQuery);
      });
      setFilteredArticles(filtered);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF5EF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6a34" />
          <Text style={{ 
            fontSize: wp(4), 
            color: '#000', 
            marginTop: 20,
            fontFamily: 'MonaSans-Regular'
          }}>
            Loading articles...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF5EF" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.arrowIcon} 
            onPress={() => navigation.goBack()} 
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Image 
              source={require('../assets/images/Icons/arrow.png')} 
              style={styles.arrowIconf} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.push('HomeScreen')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#FF6A34', fontSize: 24, fontWeight: '600' }}>in.</Text>
              <Text style={{ color: '#25252D', fontSize: 24, fontWeight: '600' }}>culcate</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search for articles..."
          placeholderTextColor="#666887"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {filteredArticles.length > 0 ? (
          <FlatList
            data={filteredArticles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                  // Track detailed article selection event
                  amplitude.track('Search Result Selected', { id: item.id, title: item.title });
                  navigation.navigate('SwipePage', { 
                    articleId: item.id,
                    articleData: item  // Pass the full article data object
                  });
                }}
              >
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.itemImage} 
                />
                <View style={styles.itemTextContainer}>
                  <Text
                    style={styles.itemTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {removeStars(item.title)}
                  </Text>
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text style={styles.noResultsText}>No articles found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;