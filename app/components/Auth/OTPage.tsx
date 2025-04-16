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
import auth from '@react-native-firebase/auth';
import { listenToAgentChanges, setAgentDataState } from '@/store/slices/agentSlice';
import Spinner from '../SpinnerComponent';
const { width, height } = Dimensions.get('window');

export default function OTPage() {
  const router = useRouter();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  const { width } = useWindowDimensions();

  const { phonenumber } = useSelector((state: RootState) => state.agent);
  const [errorMessage, setErrorMessage] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isValid, setIsValid] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(true);
  const inputRefs = useRef<Array<TextInput | null>>(Array(6).fill(null));

  const [isVerifying, setIsVerifying] = useState(false);

  const { verificationId } = useLocalSearchParams();

  useEffect(() => {
    const isOtpComplete = otp.every((num) => num.trim() !== '');
    setIsValid(isOtpComplete);

    if (isOtpComplete) {
      // Analytics event would go here
      console.log('OTP complete:', otp.join(''));
    }
  }, [otp]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0 && !canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer, canResend]);

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



  const handleVerify = async () => {
    setErrorMessage('');
    setIsVerifying(true);
    const code = otp.join('');
    if (!code || code.length < 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      setIsVerifying(false);
      return;
    }

    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId as string, code);

      console.log('✅ OTP confirmed successfully');

      const userCredential = await auth().signInWithCredential(credential);

      console.log(userCredential, "userCredential")

      if (userCredential?.user?.phoneNumber) {
        console.log('👤 User authenticated:', {
          uid: userCredential.user.uid,
          phonenumber: userCredential.user.phoneNumber
        });

        dispatch(signIn());
        router.dismissAll();
        router.replace('/(tabs)/properties');
        setIsVerifying(false);
      } else {
        console.error('❌ No user or phone number after OTP confirmation');
        setErrorMessage('Failed to sign in. Please try again.');
        setIsVerifying(false);
      }
    } catch (error: any) {
      console.error('❌ OTP confirmation error:', error);
      setErrorMessage('Invalid OTP code.');
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const confirmation = await auth().signInWithPhoneNumber(phonenumber || '', true);
      setResendTimer(30);
      setCanResend(false);
      Alert.alert('Success', `OTP resent to ${phonenumber}`);
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
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
      <TouchableOpacity
        onPress={handleResend}
        style={styles.resendButton}
        disabled={!canResend}
      >
        <Text style={[
          styles.resendText,
          { fontSize: width * 0.04 },
          !canResend && styles.resendTextDisabled
        ]}>
          {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
        </Text>
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
      <View style={{ marginBottom: height * 0.04, minHeight: 24 }}>
        {errorMessage && (
          <Text style={{ color: '#EF4444', fontFamily: 'System', fontSize: 12, lineHeight: 21 }}>
            *{errorMessage}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.verifyButton,
          isValid && styles.verifyButtonActive,
          { padding: width * 0.04 },
        ]}
        onPress={handleVerify}
        disabled={!isValid || isVerifying}
      >
        <Text style={[styles.verifyText, { fontSize: width * 0.045 }]}>
          {isVerifying ?
            <Spinner />
            :
            "Login/Sign Up"
          }
        </Text>
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
  resendTextDisabled: {
    color: '#888',
  },
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
