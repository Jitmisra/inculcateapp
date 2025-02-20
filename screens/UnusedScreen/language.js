// import React, { useState } from 'react';
// import { View, ImageBackground, Image, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
// import CustomTab from './CustomTabBar';
// import Header from '../components/TransparentHeader';
// import { useNavigation } from '@react-navigation/native';

// const categoriesData = [
//   {
//     image: require('../assets/images/Icons/language/English.png'),
//     title: "English"
//   },
//   {
//     image: require('../assets/images/Icons/language/Hindi.png'),
//     title: "हिन्दी(Hindi)"
//   },
//   {
//     image: require('../assets/images/Icons/language/Sanskrit.png'),
//     title: "संस्कृत (Sanskrit)"
//   },
//   {
//     image: require('../assets/images/Icons/language/Tamil.png'),
//     title: "தமிழ் (Tamil)"
//   },
//   {
//     image: require('../assets/images/Icons/language/Kannada.png'),
//     title: "ಕನ್ನಡ (Kannada)"
//   },
//   {
//     image: require('../assets/images/Icons/language/Telugu.png'),
//     title: "తెలుగు (Telugu)"
//   }
// ];

// const Language = () => {
//   const [activeTab, setActiveTab] = useState('Explore');
//   const navigation = useNavigation();

//   const handleLanguageSelect = (title) => {
//     if (title === "English") {
//       navigation.push('Homescreen');
//     }
//   };

//   return (
//     <View className="flex-1 bg-[#FFC4AF]">
//       <ImageBackground 
//         source={require('../assets/images/backgrounds/Language-background.png')} 
//         className="flex-1 w-full h-full"
//       >
//         <SafeAreaView className="flex-1">
          
//           <ScrollView 
//             contentContainerStyle={{ flexGrow: 1 }} 
//             showsVerticalScrollIndicator={false}
//           >
//             <View className="relative">
//               <Text className="text-[24px] font-bold text-center mt-11">
//                 <Text className="text-[#FF6A34]">in.</Text>
//                 <Text className="text-[#25252D]">culcate</Text>
//               </Text>

//               <View className="bg-white w-full mt-[103px] items-center rounded-t-[45px] pb-24">
//                 <Image 
//                   source={require('../assets/images/Icons/language/topicon.png')}
//                   className="w-[120px] mt-7 mb-4"
//                 />
//                 <Text className="text-[23px] font-bold text-[#151445] text-center">
//                   Select your Language
//                 </Text>
//                 <Text className="text-[23px] font-bold text-[#151445] text-center">
//                   Preference to Continue
//                 </Text>
//                 <Text className="text-[16px] text-[#666887] text-center mt-2">
//                   You can change the option later in settings
//                 </Text>
                
//                 <View className="flex-row flex-wrap justify-center mt-4">
//                   {categoriesData.map((item, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       activeOpacity={0.8}
//                       onPress={() => handleLanguageSelect(item.title)}
//                       style={{
//                         width: 150,
//                         height: 100,
//                         backgroundColor: 'white',
//                         borderRadius: 20,
//                         margin: 8,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         shadowColor: "#FFEAE2",
//                         shadowOffset: { width: 0, height: 0 },
//                         shadowOpacity: 1,
//                         shadowRadius: 4,
//                         elevation: 4,
//                       }}
//                     >
//                       <Image 
//                         source={item.image}
//                         style={{
//                           width: 30,
//                           height: 30,
//                           resizeMode: 'contain'
//                         }}
//                       />
//                       <Text style={{ 
//                         fontSize: 14, 
//                         fontWeight: 'bold', 
//                         color: '#25252D', 
//                         marginTop: 5 
//                       }}>
//                         {item.title}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </View>
//           </ScrollView>

          
//         </SafeAreaView>
//       </ImageBackground>
//     </View>
//   );
// };

// export default Language;