import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Whiteheader from '../components/Whiteheader';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { createEditorJsViewer } from 'editorjs-viewer-native';

// Add this helper function
const removeStars = (text) => {
  if (!text) return '';
  return text.replace(/\*+/g, '').trim();
};

// Baigan Ka Editor Js Clean Ups
const cleanTextContent = (text) => {
  if (!text) return '';
  return text
    .replace(/&nbsp;/g, ' ')                           // Replace &nbsp; with space
    .replace(/&amp;/g, '&')                             // Replace &amp; with &
    .replace(/&lt;/g, '<')                              // Replace &lt; with <
    .replace(/&gt;/g, '>')                              // Replace &gt; with >
    .replace(/&quot;/g, '"')                            // Replace &quot; with "
    .replace(/&#39;/g, "'")                             // Replace &#39; with '
    .replace(/ data-empty="(?:true|false)"/g, '')        // Remove data-empty attributes
    .replace(/<\/?ul>/g, '')                            // Remove <ul> and </ul> tags
    .replace(/<\/?li>/g, '')                            // Remove <li> and </li> tags
    .replace(/<br\s*\/?>/gi, ' ')                        // Remove <br> tags
    .replace(/\*+/g, '')                                // Remove stars
    .trim();
};


const renderHTMLText = (text) => {
  const result = [];
  const regex = /<b>(.*?)<\/b>/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push({ text: text.substring(lastIndex, match.index), bold: false });
    }
    result.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    result.push({ text: text.substring(lastIndex), bold: false });
  }
  return result;
};

// Update the EditorJS viewer configuration
const EditorJsViewerNative = createEditorJsViewer({
  tools: {
    header: {
      Component: ({ data, containerStyle }) => {
        const text = cleanTextContent(data.text);
        const parts = renderHTMLText(text);
        return (
          <Text style={[styles.subtitle, containerStyle]}>
            {parts.map((part, index) => (
              <Text key={index} style={part.bold ? styles.boldText : {}}>
                {part.text}
              </Text>
            ))}
          </Text>
        );
      }
    },
    paragraph: {
      Component: ({ data, containerStyle }) => {
        const text = cleanTextContent(data.text);
        const parts = renderHTMLText(text);
        return (
          <Text style={[styles.paragraph, containerStyle]}>
            {parts.map((part, index) => (
              <Text key={index} style={part.bold ? styles.boldText : {}}>
                {part.text}
              </Text>
            ))}
          </Text>
        );
      }
    },
    list: {
      Component: ({ data, containerStyle }) => (
        <View style={containerStyle}>
          {data.items.map((item, index) => {
            const text = cleanTextContent(item.content);
            const parts = renderHTMLText(text);
            return (
              <View key={index} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={[styles.paragraph, styles.listItemText]}>
                  {parts.map((part, idx) => (
                    <Text key={idx} style={part.bold ? styles.boldText : {}}>
                      {part.text}
                    </Text>
                  ))}
                </Text>
              </View>
            );
          })}
        </View>
      )
    }
  }
});

const LongPage = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params;
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
    'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
    'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.ttf'),
    'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.ttf'),
  });

  useEffect(() => {
    console.log('Fetching article with id:', id);
    const fetchArticle = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('No token available');
          setLoading(false);
          return;
        }
        console.log('Retrieved token:', token);
        const url = `https://app.error6o6.tech/api/consumer/v1/article/long/${id}`;
        console.log('Request URL:', url);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Response received:', response.data);
        setArticleData(response.data.article || response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const parseEditorJsContent = (content) => {
    try {
      if (typeof content === 'string') {
        return JSON.parse(content);
      }
      return content;
    } catch (error) {
      console.error('Error parsing EditorJS content:', error);
      return null;
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF6A34" />
        </View>
      </SafeAreaView>
    );
  }

  if (!articleData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'MonaSans-Regular' }}>No article available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const headerImage = articleData.Long_image || articleData.image;
  const mainHeading = removeStars(articleData.Long_title || articleData.title);
  const editorJsContent = parseEditorJsContent(articleData.Long_content);

  return (
    <SafeAreaView style={styles.container}>
      <Whiteheader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{ uri: headerImage }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.section}>
          <Text style={styles.mainHeading}>{mainHeading}</Text>
        </View>
        {editorJsContent && <EditorJsViewerNative data={editorJsContent} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  mainHeading: {
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'MonaSans-Bold'
  },
  subtitle: {
    fontSize: 20,
    color: '#000',
    marginBottom: 8,
    fontFamily: 'MonaSans-SemiBold'
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 24,
    color: '#000',
    fontFamily: 'MonaSans-Regular'
  },
  boldText: {
    fontFamily: 'MonaSans-SemiBold'
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 16,
  },
  bulletPoint: {
    fontSize: 17,
    marginRight: 8,
    color: '#000',
    fontFamily: 'MonaSans-Regular',
  },
  listItemText: {
    flex: 1,
  }
});

export default LongPage;

