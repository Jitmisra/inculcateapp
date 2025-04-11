import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import * as amplitude from '@amplitude/analytics-react-native';

const Header = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      {/* Left empty view for spacing */}
      <View style={styles.spacer} />
      
      <TouchableOpacity 
              onPress={() => {
                amplitude.track('HomeScreenSelected');
                navigation.push('HomeScreen');
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#FF6A34', fontSize: 24, fontWeight: '600' }}>in.</Text>
                <Text style={{ color: '#25252D', fontSize: 24, fontWeight: '600' }}>culcate</Text>
              </View>
            </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => {
          amplitude.track('SearchSelected');
          navigation.push('Search');
        }}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Image 
          source={require('../assets/images/Icons/search.png')}
          style={styles.searchIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 0,
    height: '8%',
  },
  spacer: {
    width: 23, // Same width as searchIcon to maintain balance
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstTitle: {
    color: '#FF6A34',
    fontSize: 24,
    fontWeight: '600',
  },
  secondTitle: {
    color: '#25252D',
    fontSize: 24,
    fontWeight: '600',
  },
  searchIcon: {
    width: 23,
    height: 23,
  },
});

export default Header;