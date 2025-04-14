import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { logOut } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';

export default function BlacklistedPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 350;

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  const handleBack = () => {
    dispatch(logOut());
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.heading, isSmallScreen && { fontSize: 24 }]}>
          OOPS! You've been blacklisted
        </Text>

        <View style={[styles.alertBox, { width: width * 0.9 }]}>
          <MaterialIcons name="error-outline" size={28} color="#D8000C" />
          <Text style={styles.alertTitle}>You have been blacklisted</Text>
          <Text style={styles.alertMessage}>
            Your account has been blacklisted due to misuse or non-compliance with our agent
            guidelines. Contact <Text style={styles.link}>support</Text> for assistance.
          </Text>
        </View>

        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={20} color="#0F1F1F" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 32,
  },
  alertBox: {
    backgroundColor: '#F8D7DA',
    borderRadius: 16,
    padding: 20,
    borderColor: '#F5C2C7',
    borderWidth: 1,
    marginBottom: 32,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D8000C',
    marginTop: 12,
    marginBottom: 8,
  },
  alertMessage: {
    color: '#D8000C',
    fontSize: 14,
  },
  link: {
    textDecorationLine: 'underline',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 6,
    color: '#0F1F1F',
    fontWeight: '600',
  },
});
