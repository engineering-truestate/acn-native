import { Stack } from "expo-router";
import { useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import ReduxProvider from '@/providers/ReduxProvider';
import FlashMessage from '../components/Toast';
import ReduxProvider from '@/providers/ReduxProvider';
import FlashMessage from '../components/Toast';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

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
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#000' },
              headerTintColor: '#fff',
              headerTitleAlign: 'center',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen name="(tabs)/index" options={{ title: 'ACN' }} />
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

          <FlashMessage position="top" />
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    </ReduxProvider>
    <ReduxProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#000' },
              headerTintColor: '#fff',
              headerTitleAlign: 'center',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen name="(tabs)/index" options={{ title: 'ACN' }} />
            <Stack.Screen name="not-found" options={{ headerShown: false }} />
          </Stack>

          <FlashMessage position="top" />
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}
