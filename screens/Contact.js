import { 
    View, 
    ImageBackground, 
    Image, 
    Text, 
    SafeAreaView, 
    StatusBar,
    Platform,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Linking,
    TouchableOpacity
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import CustomTab from '../components/CustomTabBar';
  import Header from '../components/TransparentHeader';
  
  const { height } = Dimensions.get('window');
  const imageSize = height * 0.10;
  
  const Contact = () => {
    const [activeTab, setActiveTab] = useState('Upload');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const loadUserData = async () => {
        try {
          const userEmail = await AsyncStorage.getItem('userEmail');
          const userName = await AsyncStorage.getItem('userName');
          
          if (userEmail) setEmail(userEmail);
          if (userName) setName(userName);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      loadUserData();
    }, []);
  
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
              <View>
                {isLoading ? (
                  <View style={styles.profileImage}>
                    <ActivityIndicator size="large" color="#FF6A34" />
                  </View>
                ) : (
                  <Image
                    source={require('../assets/images/Icons/Contacticon.png')}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                )}
              </View>
              <Text style={styles.profileName}>Have Questions?</Text>
  <Text style={styles.username}>Contact Us</Text>
  <TouchableOpacity onPress={() => Linking.openURL('https://www.inculcate.in')}>
    <Text style={[styles.appVersion, styles.linkText]}>www.inculcate.in</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => Linking.openURL('mailto:In@inculcate.in')}>
    <Text style={[styles.appVersion, styles.linkText]}>In@inculcate.in</Text>
  </TouchableOpacity>
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
      fontWeight: 'bold',
      marginTop: 10,
      color: '#000',
    },
    username: {
      fontSize: 20,
      color: '#FF6A34',
      marginTop: 5,
    },
    appVersion: {
      marginTop: "5%",
      fontSize: 22,
      color: '#999',
    },
  });
  
  export default Contact;