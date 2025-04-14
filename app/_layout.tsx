import { Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Dimensions, Platform, SafeAreaView } from "react-native";
import { StatusBar } from 'expo-status-bar';
import DeviceInfo from 'react-native-device-info';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import 'react-native-reanimated';
import '../global.css';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { useColorScheme } from '@/hooks/useColorScheme';
import ReduxProvider from '@/providers/ReduxProvider';
import FlashMessage from '../components/Toast';
import { KamModalButton } from "@/components/KamModalButton";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [topMargin, setTopMargin] = useState(10);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  // Function to calculate dynamic top margin based on screen dimensions and orientation
  const calculateTopMargin = () => {
    const { height, width } = Dimensions.get('window');
    const isLandscape = width > height;
    
    // Different margins based on device type and orientation
    if (Platform.OS === 'ios') {
      // iOS specific margins
      return isLandscape ? 0.01*height : 0.06*height;
    } else {
      // Android specific margins
      return isLandscape ? 0.01*height : 0.04*height;
    }
  };

  // Update top margin when dimensions change (e.g., rotation)
  useEffect(() => {
    const updateMargin = () => {
      // setTopMargin(calculateTopMargin());
    };
    
    // Set initial margin
    updateMargin();
    
    // Add event listener for dimension changes
    const dimensionsSubscription = Dimensions.addEventListener('change', updateMargin);
    
    // Clean up
    return () => {
      dimensionsSubscription.remove();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ReduxProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <HamburgerMenu />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#fff' },
              headerTintColor: '#000',
              headerTitleAlign: 'center',
              headerTitleStyle: { fontWeight: 'bold' },
              headerBackVisible: false,
            }}
          >
            <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)/properties" options={{ title: 'Resale Inventories' }} />
            <Stack.Screen name="(tabs)/requirements" options={{ title: 'Requirements' }} />
            <Stack.Screen name="(tabs)/UserRequirementForm" options={{ title: 'Add Requirement' }}/>
            <Stack.Screen name="(tabs)/billings" options={{ title: 'Billing' }}/>
            <Stack.Screen name="(tabs)/help" options={{ title: 'Help' }}/>

            {/* <Stack.Screen name="LandingPage" /> */}
            <Stack.Screen name="components/Auth" options={{ headerShown: false }}/>
            <Stack.Screen name="components/Auth/Signin" options={{ headerShown: false }}/>
            <Stack.Screen name="components/Auth/OTPage" options={{ headerShown: false }}/>
            <Stack.Screen name="components/Auth/VerificationPage" options={{ headerShown: false }}/>
            <Stack.Screen name="components/Auth/BlacklistedPage" options={{ headerShown: false }}/>
            <Stack.Screen name="not-found" options={{ headerShown: false }} />
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="property/[id]"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <KamModalButton />
          <FlashMessage position="top" />
          <StatusBar style="auto" />
        </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}