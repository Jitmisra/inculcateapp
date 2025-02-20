import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const Whiteheader2 = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        height: hp('8%'),
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.5%'),
        zIndex: 999,
      }}
    >
      <TouchableOpacity 
       onPress={() => navigation.push('Homescreen')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        style={{ padding: wp('2%') }}
      >
        <Image 
          source={require('../assets/images/Icons/arrow.png')}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.push('Homescreen')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#FF6A34', fontSize: 24, fontWeight: '600' }}>in.</Text>
          <Text style={{ color: '#25252D', fontSize: 24, fontWeight: '600' }}>culcate</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.push('Search')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        style={{ padding: wp('2%') }}
      >
        <Image 
          source={require('../assets/images/Icons/search.png')}
          style={{ width: 23, height: 23 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Whiteheader2;