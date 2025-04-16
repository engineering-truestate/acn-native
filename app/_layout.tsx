import { Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Dimensions, Platform, SafeAreaView, StyleSheet, Text } from "react-native";
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
import { HamburgerMenuButton } from '@/components/HamburgerMenuButton';
import { HamburgerMenu } from '@/components/HamburgerMenu';
import { useColorScheme } from '@/hooks/useColorScheme';
import ReduxProvider from '@/providers/ReduxProvider';
import Toast from 'react-native-toast-message';
import { KamModalButton } from "@/components/KamModalButton";
import ProfileModal from '@/app/modals/ProfileModal';

SplashScreen.preventAutoHideAsync();

// Custom header component to apply the desired styling
const CustomHeader = ({ title, onMenuPress, isMenuOpen }: { title: string; onMenuPress: () => void; isMenuOpen: boolean }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.headerContainer,
      { paddingTop: insets.top }
    ]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <HamburgerMenuButton onPress={onMenuPress} isOpen={isMenuOpen} />
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          <KamModalButton />
        </View>
      </View>
    </View>
  );
};

export default function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const [topMargin, setTopMargin] = useState(10);
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  // Function to calculate dynamic top margin based on screen dimensions and orientation
  // const calculateTopMargin = () => {
  //   const { height, width } = Dimensions.get('window');
  //   const isLandscape = width > height;

  //   // Different margins based on device type and orientation
  //   if (Platform.OS === 'ios') {
  //     // iOS specific margins
  //     return isLandscape ? 0.01*height : 0.06*height;
  //   } else {
  //     // Android specific margins
  //     return isLandscape ? 0.01*height : 0.04*height;
  //   }
  // };

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
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: '#fff' },
                headerTintColor: '#000',
                headerTitleAlign: 'center',
                headerBackVisible: false,
                header: ({ route, options }) => {
                  const title = options.title || route.name;
                  return <CustomHeader title={title} onMenuPress={() => setIsMenuOpen(true)} isMenuOpen={isMenuOpen} />;
                },
              }}
            >
              <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)/properties" options={{ title: 'Resale Inventories' }} />
              <Stack.Screen name="(tabs)/requirements" options={{ title: 'Requirements' }} />
              <Stack.Screen name="(tabs)/UserRequirementForm" options={{ title: 'Add Requirement' }} />
              <Stack.Screen name="(tabs)/billings" options={{ title: 'Billing' }} />
              <Stack.Screen name="(tabs)/help" options={{ title: 'Help' }} />
              <Stack.Screen name="(tabs)/dashboardTab" options={{ title: 'Dashboard' }} />

              <Stack.Screen name="components/Auth" options={{ headerShown: false }} />
              <Stack.Screen name="components/Auth/Signin" options={{ headerShown: false }} />
              <Stack.Screen name="components/Auth/OTPage" options={{ headerShown: false }} />
              <Stack.Screen name="components/Auth/VerificationPage" options={{ headerShown: false }} />
              <Stack.Screen name="components/Auth/BlacklistedPage" options={{ headerShown: false }} />
              <Stack.Screen name="not-found" options={{ headerShown: false }} />
            </Stack>
            <HamburgerMenu 
              visible={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onOpenProfile={() => setProfileModalVisible(true)}
            />
            <ProfileModal
              visible={profileModalVisible}
              setVisible={setProfileModalVisible}
            />
            <Toast />
            <StatusBar style="auto" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    width: '100%',
  },
  headerContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerLeft: {
    width: 40, // Fixed width for the hamburger menu button
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 16, // Add margin from hamburger icon
  },
  headerTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 40, // Fixed width for the right button
    alignItems: 'flex-end',
  },
});