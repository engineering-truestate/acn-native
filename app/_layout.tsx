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
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { useColorScheme } from '@/hooks/useColorScheme';
import ReduxProvider from '@/providers/ReduxProvider';
import FlashMessage from '../components/Toast';
import { KamModalButton } from "@/components/KamModalButton";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

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
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <HamburgerMenu />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#fff' },
              headerTintColor: '#000',
              headerTitleAlign: 'center',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen name="(tabs)/index" options={{ title: 'Resale Inventories' }} />
            <Stack.Screen name="(tabs)/requirements" options={{ title: 'Requirements' }} />
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
      </SafeAreaProvider>
    </ReduxProvider>
  );
}