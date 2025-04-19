import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from 'expo-router';
import LandingPage from '../components/Auth/LandingPage';
import { RootState } from '@/store/store';

// Keep splash screen visible until explicitly hidden
SplashScreen.preventAutoHideAsync();

export default function TabOneScreen() {
  const router = useRouter();
  // Add state to track if Redux store is ready
  const [isStoreReady, setIsStoreReady] = useState(false);

  // Get authentication status from Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Handle navigation based on auth state once store is ready
  useEffect(() => {
    if (isStoreReady) {
      // Hide splash screen
      SplashScreen.hideAsync();

      // Navigate based on auth status
      if (isAuthenticated) {
        router.replace('/(tabs)/properties');
      }
    }
  }, [isStoreReady, isAuthenticated, router]);

  // Set store ready after first render
  useEffect(() => {
    setIsStoreReady(true);
  }, []);

  // Return null while store is loading to keep splash screen visible
  if (!isStoreReady) {
    return null;
  }

  // For unauthenticated users, show landing page
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LandingPage />
    </View>
  );
}