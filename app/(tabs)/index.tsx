import { View, Text } from 'react-native';
import { useEffect } from 'react';
import PropertiesScreen from './properties';
import LandmarkDropdownFilters from '../components/LandmarkDropdownFilters';
import LandingPage from '../components/Auth/LandingPage';
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';


export default function TabOneScreen() {

  // useEffect(() => {
  //   // Function to request permission and get the token
  //   const getPushNotificationPermission = async () => {
  //     // Request notification permissions
  //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //     if (status === 'granted') {
  //       const token = await Notifications.getExpoPushTokenAsync();
  //       console.log('Expo Push Token:', token);
  //       // Optionally send the token to your server to store for sending notifications
  //     } else {
  //       console.log('Notification permissions not granted');
  //     }
  //   };

  //   getPushNotificationPermission();
  // }, []);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LandingPage />
    </View>
  );
}



