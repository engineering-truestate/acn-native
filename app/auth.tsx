import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../config/firebase';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Format phone number to include country code
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      // Create recaptcha verifier
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      });
      setRecaptchaVerifier(verifier);

      // Send OTP
      const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, verifier);
      setConfirmationResult(confirmation);
      Alert.alert('Success', 'OTP has been sent to your phone number');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !confirmationResult) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      if (result.user) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-white dark:bg-black">
      <Text className="text-2xl font-bold mb-6 text-black dark:text-white">Phone Sign In</Text>
      
      {!confirmationResult ? (
        <>
          <TextInput
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-gray-700 dark:text-white"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            editable={!isLoading}
          />
          
          <TouchableOpacity
            className="w-full bg-blue-500 p-4 rounded-lg items-center justify-center"
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold">Send OTP</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-gray-700 dark:text-white"
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            editable={!isLoading}
          />
          
          <TouchableOpacity
            className="w-full bg-blue-500 p-4 rounded-lg items-center justify-center"
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold">Verify OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <View id="recaptcha-container" className="hidden" />
    </View>
  );
} 