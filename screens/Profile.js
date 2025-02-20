import { 
  View, 
  ImageBackground, 
  Image, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomTab from './CustomTabBar';
import Header from '../components/TransparentHeader';

const { height } = Dimensions.get('window');
const imageSize = height * 0.10;

import { useFonts } from 'expo-font';

const Profile = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Profile');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.ttf'),
    'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }
    const loadUserData = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userName = await AsyncStorage.getItem('userName');
        
        if (userEmail) {
          setEmail(userEmail);
          setAvatarUrl(require('../assets/images/Icons/profile.png'));
        }
        if (userName) setName(userName);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [fontsLoaded]);

  if (!fontsLoaded || isLoading) {
    return <ActivityIndicator size="large" color="#FF6A34" />;
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'userToken',
        'userEmail',
        'userName',
        'userId'
      ]);
      navigation.replace('EmailLogin');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground 
        source={require('../assets/images/backgrounds/Profile.png')} 
        style={styles.imageBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <Header />
          <View style={styles.bottomPanel}>
            <TouchableOpacity>
              {isLoading ? (
                <View style={styles.profileImage}>
                  <ActivityIndicator size="large" color="#FF6A34" />
                </View>
              ) : (
                <Image
                  source={avatarUrl}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.username}>{email}</Text>
            <TouchableOpacity 
              style={styles.logoutButton2}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText2}>Logout</Text>
            </TouchableOpacity>
            <Text style={styles.appVersion}>App Version 0.0.1</Text>
          </View>
          <CustomTab 
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />
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
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    height: '70%',
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingTop: 20,
  },
  profileImage: {
    height: 160,
    width: 160,
    borderRadius: 80,
    marginTop: -90,
    backgroundColor: '#F6F6F6',
    borderWidth: 2,
    borderColor: '#FF6A34',
  },
  profileName: {
    fontSize: 30,
    fontFamily: 'MonaSans-Bold',
    marginTop: 10,
    color: '#000',
  },
  username: {
    fontSize: 20,
    fontFamily: 'MonaSans-Regular',
    color: '#FF6A34',
    marginTop: 5,
  },
  logoutButton2: {
    marginTop: "30%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,243,243,1)',
    borderRadius: 12,
    width: "80%",
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText2: {
    fontSize: 14,
    color: 'rgba(255,34,34,1)',
  },
  appVersion: {
    marginTop: "5%",
    fontSize: 12,
    color: '#999',
  },
});

export default Profile;