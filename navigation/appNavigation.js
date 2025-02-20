import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';'@react-navigation/stack';
import Login from '../screens/Login';
import otp from '../screens/otp';
import Homescreen from '../screens/HomeScreen';
import Explore from '../screens/Explore';
import Upload from '../screens/Upload';
import Profile from '../screens/Profile';
import Language from '../screens/language';
import SwipePage from '../screens/Swiper';
import Search from '../screens/Search';
import Quiz from '../screens/Quiz';
import Swiper2 from '../screens/Swiper2';
import LongPage from '../screens/longpage';
import EmailLogin from '../screens/EmailLogin';

const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator  
        screenOptions={{
          headerShown: false,
         
         
      
        }}
      >
   
        

       
        <Stack.Screen name="EmailLogin" component={EmailLogin} />
         
        {/* <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen name="Swiper2" component={Swiper2} />
        <Stack.Screen name="SwipePage" component={SwipePage} />
        
        <Stack.Screen name="otp" component={otp} />
       
        <Stack.Screen name="Homescreen" component={Homescreen} />
        <Stack.Screen name="Explore" component={Explore} />
        <Stack.Screen name="Upload" component={Upload} />
        <Stack.Screen name="Profile" component={Profile} />
        
        <Stack.Screen name="Home" component={Login} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Language" component={Language} />
        <Stack.Screen name="LongPage" component={LongPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}