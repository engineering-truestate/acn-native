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
import { OtpInput } from "react-native-otp-entry";
const { width, height } = Dimensions.get('window');

export default function OTPage() {
  const router = useRouter();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  const { width } = useWindowDimensions();

  const { phonenumber } = useSelector((state: RootState) => state.agent);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [otp, setOtp] = useState<String>('');
  const [isValid, setIsValid] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(true);
  const inputRefs = useRef<Array<TextInput | null>>(Array(6).fill(null));

  const { verificationId } = useLocalSearchParams();

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

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      console.log('🔑 Confirming OTP code');

      console.log(verificationId, "hello")
      const credential = auth.PhoneAuthProvider.credential(verificationId as string, otp.toString());
      //const credential = await confirmation?.confirm(code);
      console.log('✅ OTP confirmed successfully');

      const userCredential = await auth().signInWithCredential(credential);

      console.log(userCredential, "userCredential")

      console.log(userCredential?.user?.phoneNumber, "userCredential?.user?.phoneNumber")

      if (userCredential?.user?.phoneNumber) {
        console.log('👤 User authenticated:', {
          uid: userCredential.user.uid,
          phonenumber: userCredential.user.phoneNumber
        });

        // First update auth state
        dispatch(signIn());

        // Then fetch agent data
        const result = await dispatch(setAgentDataState(userCredential.user.phoneNumber)).unwrap();
        console.log('📊 Agent data after OTP:', {
          hasDocId: !!result?.docId,
          docData: result?.docData,
          verified: result?.docData?.verified
        });

        if (result?.docId) {
          dispatch(listenToAgentChanges(result.docId));
          setErrorMessage('');
          router.dismissAll();
          router.replace('/(tabs)/properties');
        } else {
          console.error('❌ No agent document found after OTP confirmation');
          setErrorMessage('Failed to load user data. Please try again.');
          handleSignOut();
        }
      } else {
        console.error('❌ No user or phone number after OTP confirmation');
        setErrorMessage('Failed to sign in. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ OTP confirmation error:', error);
      setErrorMessage('Invalid OTP code.');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const confirmation = await auth().signInWithPhoneNumber(phonenumber || '', true);
      setConfirm(confirmation);
      setResendTimer(30);
      setCanResend(false);
      Alert.alert('Success', `OTP resent to ${phonenumber}`);
    } catch (error: any) {
      console.error('Failed to resend OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      dispatch(logOut());
    } catch (error) {
      console.error('Error signing out:', error);
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
        <OtpInput
          numberOfDigits={6}
          autoFocus={true}
          onTextChange={(text) => setOtp(text)}
          theme={{
            // containerStyle: styles.container,
            pinCodeContainerStyle: styles.pinCodeContainer,
            // pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            // placeholderTextStyle: styles.placeholderText,
            // filledPinCodeContainerStyle: styles.filledPinCodeContainer,
            // disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
          }}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.verifyButton,
          otp.length === 6 && styles.verifyButtonActive,
          { padding: width * 0.04 },
        ]}
        onPress={handleVerify}
        disabled={otp.length !== 6}
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
  activePinCodeContainer: {
    borderColor: "#000000",
  },
  pinCodeContainer: {
    borderWidth: 2,
    width: 50,
    height: 50,
    borderRadius: 10
  },
  focusStick: {
    width: 1,
    backgroundColor: "#000000"
  }
});
