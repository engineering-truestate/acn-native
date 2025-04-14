import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useWindowDimensions,
  Dimensions,
  Linking,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
  Clipboard,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { logOut, signIn } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window');

export default function OTPage() {
  const router = useRouter();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  const { width } = useWindowDimensions();

  const { phonenumber } = useSelector((state: RootState) => state.agent);

  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isValid, setIsValid] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>(Array(6).fill(null));

  useEffect(() => {
    const isOtpComplete = otp.every((num) => num.trim() !== '');
    setIsValid(isOtpComplete);

    if (isOtpComplete) {
      // Analytics event would go here
      console.log('OTP complete:', otp.join(''));
    }
  }, [otp]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      handlePaste(text, index);
      return;
    }

    if (isNaN(Number(text))) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Focus previous input on backspace if current input is empty
        inputRefs.current[index - 1]?.focus();
      }
    }
  };


  const handlePaste = async (pastedText: string, index: number) => {
    try {
      const text = pastedText || await Clipboard.getString();
      if (!text || isNaN(Number(text))) return;

      // Only use numeric characters
      const cleanedText = text.replace(/[^0-9]/g, '');

      const newOtp = [...otp];
      for (let i = 0; i < cleanedText.length; i++) {
        if (index + i < 6) {
          newOtp[index + i] = cleanedText[i];
        }
      }
      setOtp(newOtp);

      // Focus the appropriate field after paste
      const lastFilledIndex = Math.min(index + cleanedText.length - 1, 5);
      if (lastFilledIndex < 5 && cleanedText.length > 0) {
        setTimeout(() => {
          inputRefs.current[lastFilledIndex + 1]?.focus();
        }, 0);
      }
    } catch (error) {
      console.error('Failed to paste text:', error);
    }
  };

  const handleVerify = () => {
    if (!isValid) return;
    const fullOtp = otp.join('');
    dispatch(signIn());
    router.push('/(tabs)/properties');
  };

  const handleResend = () => {
    Alert.alert('Resending OTP', `Sending OTP again to ${phonenumber}`);
  };



  const handleBack = () => {
    dispatch(logOut());
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { fontSize: width * 0.08 }]}>Welcome to ACN</Text>
      <Text style={[styles.otpInfo, { fontSize: width * 0.04 }]}>
        OTP sent to <Text style={styles.phone}> {phonenumber}</Text>
      </Text>
      <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
        <Text style={[styles.resendText, { fontSize: width * 0.04 }]}>Resend Code</Text>
      </TouchableOpacity>

      <View style={styles.otpRow}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[styles.otpInput, { width: width * 0.12, fontSize: width * 0.05 }]}
            maxLength={1}
            keyboardType="numeric"
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyDown(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.verifyButton,
          otp.every((val) => val) && styles.verifyButtonActive,
          { padding: width * 0.04 },
        ]}
        onPress={handleVerify}
        disabled={!otp.every((val) => val)}
      >
        <Text style={[styles.verifyText, { fontSize: width * 0.045 }]}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBack}>
        <Text style={[styles.backText, { fontSize: width * 0.04 }]}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  heading: { fontWeight: 'bold', marginBottom: 6, marginTop: 0, textAlign: 'center' },
  otpInfo: { color: '#888', marginBottom: 10, textAlign: 'center', marginTop: 8 },
  phone: { fontWeight: 'bold', color: '#153E3B' },
  resendButton: { marginTop: 8, marginBottom: 24, alignSelf: 'center' },
  resendText: { color: '#023020', fontWeight: 'bold' },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    borderRadius: 10,
  },
  verifyButtonActive: {
    backgroundColor: '#153E3B',
  },
  verifyText: { color: '#fff', fontWeight: 'bold' },
  backText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#023020',
    fontWeight: 'bold',
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  lText: {
    color: '#333',
    marginTop: 2,
  },
  cHere: {
    color: '#1a0dab',
    fontWeight: 'bold',
    marginTop: 2,
  },
  subheading: {
    fontSize: width * 0.045,
    color: '#888',
    marginBottom: height * 0.04,
  },
});
