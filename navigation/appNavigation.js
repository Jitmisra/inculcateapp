import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';'@react-navigation/stack';


import HomeScreen from '../screens/Home';
import Explore from '../screens/Explore';

import Profile from '../screens/Profile';

import SwipePage from '../screens/Capsule';
import Search from '../screens/Search';
import Upload from '../screens/Contact';

import Swiper2 from '../screens/PreCapsule';
import LongPage from '../screens/CapsuleLong';
import EmailLogin from '../screens/EmailLogin';
import Swipercatagories from '../screens/Categories';
import testingswiper from '../screens/testingswiper';

const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      
      <Stack.Navigator  
        screenOptions={{
          headerShown: false,}}>  
        {/* <Stack.Screen name="testingswiper" component={testingswiper} />     */}
        <Stack.Screen name="EmailLogin" component={EmailLogin} />
        <Stack.Screen name="Swiper2" component={Swiper2} />
        <Stack.Screen name="Upload" component={Upload} />
        <Stack.Screen name="SwipePage" component={SwipePage} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Explore" component={Explore} />
        <Stack.Screen name="Profile" component={Profile} />
        {/* <Stack.Screen name="Home" component={Login} /> */}
        <Stack.Screen name="Search" component={Search} />
       <Stack.Screen name="LongPage" component={LongPage} />
        <Stack.Screen name="Swipercatagories" component={Swipercatagories} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}