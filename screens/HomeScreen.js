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
  RefreshControl
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CustomTab from './CustomTabBar.js';
import Header from '../components/TransparentHeader.js';

const TrendingCard = ({ image, title, description, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <View 
      className="w-[348px] h-[273px] bg-white rounded-xl mx-4"
      style={{
        shadowColor: "#FFEAE2",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Image 
        source={typeof image === 'string' ? { uri: image } : image}
        className="w-full h-[180px] rounded-t-xl"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-[18px] font-bold text-[#25252D]">{title}</Text>
        <Text className="text-[12px] text-[#8A819D] mt-2">{description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const Homescreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Homescreen');
  const [trendingData, setTrendingData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('https://run.mocky.io/v3/2756fccd-da51-4203-b977-85b095f46a26');
      const formattedData = response.data.map(item => ({
        id: item.id,
        category: item.category,
        image: item.imageUrl,
        title: item.title,
        description: item.description,
        description2: item.description2,
        longarticle: item.longarticle || [] // include longarticle for LongPage
      }));
      setAllData(formattedData);
      setTrendingData(formattedData.slice(0, 7));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const categoriesData = [
    {
      image: require('../assets/images/Icons/Catagories/Indian.png'),
      title: "Indian"
    },
    {
      image: require('../assets/images/Icons/Catagories/International.png'),
      title: "International"
    },
    {
      image: require('../assets/images/Icons/Catagories/Astronomy.png'),
      title: "Astronomy"
    },
    {
      image: require('../assets/images/Icons/Catagories/Metallurgy.png'),
      title: "Metallurgy"
    },
    {
      image: require('../assets/images/Icons/Catagories/Science.png'),
      title: "Science"
    },
    {
      image: require('../assets/images/Icons/Catagories/Technology.png'),
      title: "Technology"
    }
  ];

  return (
    <View className="flex-1 bg-[#FFC4AF]">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground 
        source={require('../assets/images/backgrounds/Home-background.png')} 
        className="flex-1 w-full h-full"
      >
        <SafeAreaView 
          style={{
            flex: 1,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
          }}
        >
          <Header />
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FF6A34"      // iOS refresh indicator color
                colors={['#FF6A34']}     // Android refresh indicator color
              />
            }
          >
            {/* Welcome Section */}
            <View className="px-4 mt-6 items-center">
              <View className="flex-row justify-center">
                <Text className="text-[#25252D] text-[25px] font-bold">Welcome back </Text>
                <Text className="text-[#FF6A34] text-[25px] font-bold">Agnik!</Text>
              </View>
              <Text className="text-[#25252D] text-[20px] mt-1 font-semibold">
                Ready to in.culcate?
              </Text>
            </View>

            {/* Trending Section */}
            <View className="mt-6">
              <Text className="text-[20px] font-bold text-[#25252D] px-4 mb-4">
                Trending Now
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trendingData.map((item, index) => (
                  <TrendingCard
                    key={index}
                    image={item.image}
                    title={item.title}
                    description={item.description}
                    onPress={() => navigation.navigate('SwipePage', { articleId: item.id, data: allData })}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Categories Section */}
            <View className="mt-6">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categoriesData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    style={{
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
                    }}
                    onPress={() => {
                      const filteredData = allData.filter(article =>
                        article.category.toLowerCase().includes(item.title.toLowerCase())
                      );
                      navigation.navigate('SwipePage', { 
                        category: item.title, 
                        data: filteredData 
                      });
                    }}
                  >
                    <Image 
                      source={item.image}
                      style={{width: 50, height: 50, resizeMode: 'contain'}}
                    />
                    <Text className="text-[14px] font-bold text-[#25252D] mt-2">
                      {item.title}
                    </Text>
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

export default Homescreen;




// import { 
//   ImageBackground, 
//   Text, 
//   View, 
//   SafeAreaView, 
//   Image, 
//   ScrollView, 
//   TouchableOpacity,
//   StatusBar,
//   Platform
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import CustomTab from './CustomTabBar';
// import Header from '../components/TransparentHeader';

// const TrendingCard = ({ image, title, description, onPress }) => (
//   <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
//     <View 
//       className="w-[348px] h-[273px] bg-white rounded-xl mx-4"
//       style={{
//         shadowColor: "#FFEAE2",
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 1,
//         shadowRadius: 4,
//         elevation: 4,
//       }}
//     >
//       <Image 
//         source={typeof image === 'string' ? { uri: image } : image}
//         className="w-full h-[180px] rounded-t-xl"
//         resizeMode="cover"
//       />
//       <View className="p-4">
//         <Text className="text-[18px] font-bold text-[#25252D]">{title}</Text>
//         <Text className="text-[12px] text-[#8A819D] mt-2">{description}</Text>
//       </View>
//     </View>
//   </TouchableOpacity>
// );

// const Homescreen = () => {
//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState('Homescreen');
//   const [trendingData, setTrendingData] = useState([]);
//   const [allData, setAllData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://10.12.0.17:3000/admin/api/articles');
//         const formattedData = response.data.map(item => ({
//           id: item._id,
//           category: item.category,
//           image: item.imageUrl,
//           title: item.title,
//           description: item.description,
//           description2: item.description2
//         }));
//         setAllData(formattedData);
//         setTrendingData(formattedData.slice(0, 7));
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   const categoriesData = [
//     {
//       image: require('../assets/images/Icons/Catagories/Indian.png'),
//       title: "Indian"
//     },
//     {
//       image: require('../assets/images/Icons/Catagories/International.png'),
//       title: "International"
//     },
//     {
//       image: require('../assets/images/Icons/Catagories/Astronomy.png'),
//       title: "Astronomy"
//     },
//     {
//       image: require('../assets/images/Icons/Catagories/Metallurgy.png'),
//       title: "Metallurgy"
//     },
//     {
//       image: require('../assets/images/Icons/Catagories/Science.png'),
//       title: "Science"
//     },
//     {
//       image: require('../assets/images/Icons/Catagories/Technology.png'),
//       title: "Technology"
//     }
//   ];

//   return (
//     <View className="flex-1 bg-[#FFC4AF]">
//       <StatusBar
//         translucent
//         backgroundColor="transparent"
//         barStyle="dark-content"
//       />
//       <ImageBackground 
//         source={require('../assets/images/backgrounds/Home-background.png')} 
//         className="flex-1 w-full h-full"
//       >
//         <SafeAreaView 
//           style={{
//             flex: 1,
//             paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
//           }}
//         >
//           <Header />
//           <ScrollView 
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
//           >
//             {/* Welcome Section */}
//             <View className="px-4 mt-6 items-center">
//               <View className="flex-row justify-center">
//                 <Text className="text-[#25252D] text-[25px] font-bold">Welcome back </Text>
//                 <Text className="text-[#FF6A34] text-[25px] font-bold">Agnik!</Text>
//               </View>
//               <Text className="text-[#25252D] text-[20px] mt-1 font-semibold">
//                 Ready to in.culcate?
//               </Text>
//             </View>

//             {/* Trending Section */}
//             <View className="mt-6">
//               <Text className="text-[20px] font-bold text-[#25252D] px-4 mb-4">
//                 Trending Now
//               </Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {trendingData.map((item, index) => (
//                   <TrendingCard
//                     key={index}
//                     image={item.image}
//                     title={item.title}
//                     description={item.description}
//                     onPress={() => navigation.navigate('SwipePage', { articleId: item.id, data: allData })}
//                   />
//                 ))}
//               </ScrollView>
//             </View>

//             {/* Categories Section */}
//             <View className="mt-6">
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {categoriesData.map((item, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     activeOpacity={0.8}
//                     style={{
//                       width: 150,
//                       height: 100,
//                       backgroundColor: 'white',
//                       borderRadius: 15,
//                       marginRight: 10,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       shadowColor: "#FFEAE2",
//                       shadowOffset: { width: 0, height: 0 },
//                       shadowOpacity: 1,
//                       shadowRadius: 4,
//                       elevation: 4,
//                     }}
//                     onPress={() => {
//                       const filteredData = allData.filter(article =>
//                         article.category.toLowerCase().includes(item.title.toLowerCase())
//                       );
//                       navigation.navigate('SwipePage', { 
//                         category: item.title, 
//                         data: filteredData 
//                       });
//                     }}
//                   >
//                     <Image 
//                       source={item.image}
//                       style={{width: 50, height: 50, resizeMode: 'contain'}}
//                     />
//                     <Text className="text-[14px] font-bold text-[#25252D] mt-2">
//                       {item.title}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           </ScrollView>
//           <CustomTab activeTab={activeTab} onTabPress={setActiveTab} />
//         </SafeAreaView>
//       </ImageBackground>
//     </View>
//   );
// };

// export default Homescreen;