import React from 'react';
import { View, TouchableOpacity, Image, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const CustomTab = ({ activeTab = 'HomeScreen', onTabPress }) => {
  const navigation = useNavigation();

  const tabs = [
    { 
      name: 'HomeScreen', 
      icon: require('../assets/images/Icons/bottombar/Homeicon.png'), 
      activeIcon: require('../assets/images/Icons/bottombar/Homeiconactive.png'),
      size: { width: 24, height: 25 }
    },
    { 
      name: 'Explore', 
      icon: require('../assets/images/Icons/bottombar/Exploreicon.png'), 
      activeIcon: require('../assets/images/Icons/bottombar/Exploreiconactive.png'),
      size: { width: 60, height: 60 }
    },
    { 
      name: 'Upload', 
      icon: require('../assets/images/Icons/bottombar/Uploadicon.png'), 
      activeIcon: require('../assets/images/Icons/bottombar/Uploadiconactive.png'),
      size: { width: 32, height: 32 }
    },
    { 
      name: 'Profile', 
      icon: require('../assets/images/Icons/bottombar/Profileicon.png'), 
      activeIcon: require('../assets/images/Icons/bottombar/Profileiconactive.png'),
      size: { width: 24, height: 24 }
    },
  ];

  // Create an array of animated values for each tab
  const animatedScales = React.useRef(tabs.map(() => new Animated.Value(1))).current;

  const handlePress = (tabName) => {
    onTabPress?.(tabName);
    if (navigation) {
      navigation.navigate(tabName);
    }
  };

  const animateTab = (animatedValue, tabName, index) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: 10,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => handlePress(tabName));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0)', '#ffffff']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0.0641, 0.441]}
      >
        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => {
            const animatedValue = animatedScales[index];
            return (
              <TouchableOpacity
                key={index}
                style={styles.tab}
                onPress={() => animateTab(animatedValue, tab.name, index)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Animated.Image
                  source={activeTab === tab.name ? tab.activeIcon : tab.icon}
                  style={[
                    { transform: [{ scale: animatedValue }] },
                    activeTab === tab.name
                      ? styles[`${tab.name.toLowerCase()}ActiveIcon`]
                      : styles[`${tab.name.toLowerCase()}Icon`],
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    width: '100%',
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  tabContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 20,
  },
  tab: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homescreenIcon: {
    width: 24,
    height: 25,
    resizeMode: 'contain',
  },
  homescreenActiveIcon: {
    width: 24,
    height: 25,
    resizeMode: 'contain',
  },
  exploreIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  exploreActiveIcon: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
    top: 5,
  },
  uploadIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  uploadActiveIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  profileIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  profileActiveIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    top: -1,
  },
});

export default CustomTab;