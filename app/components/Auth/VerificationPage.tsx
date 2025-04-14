import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { logOut } from '@/store/slices/authSlice';

export default function VerificationPage() {
  const router = useRouter();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  const handleBack = () => {
    dispatch(logOut());
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Required</Text>
      <View style={styles.card}>
        <Text style={styles.status}>⏰ Verification pending</Text>
        <Text style={styles.message}>
          We have received your contact number. Our support team will contact you within{' '}
          <Text style={styles.bold}>24 Hrs</Text> for verification and smooth onboarding.
        </Text>
      </View>
      <TouchableOpacity onPress={handleBack}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30 },
  card: {
    backgroundColor: '#fff9e5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderColor: '#fcd34d',
    borderWidth: 1,
  },
  status: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  message: { fontSize: 15, color: '#555' },
  bold: { fontWeight: 'bold' },
  back: { textAlign: 'center', color: '#023020', fontWeight: 'bold', fontSize: 16 },
});
