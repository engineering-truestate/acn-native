import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { listenToAgentChanges, selectBlacklisted, selectVerified, setAgentDataState, setPhonenumber } from '@/store/slices/agentSlice';
import { useDispatch } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/app/config/firebase';
import { getUnixDateTime } from '@/app/helpers/getUnixDateTime';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const router = useRouter();

  const [phoneInput, setPhoneInput] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [confirm, setConfirm] = useState<any>(null);
  const [step, setStep] = useState(1);

  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addingNewAgent, setAddingNewAgent] = useState(false);

  const { loading, phonenumber, isAgentInDb } = useSelector((state: RootState) => state.agent);
  const isVerified = useSelector(selectVerified);
  const isBlacklisted = useSelector(selectBlacklisted);

  const handlePhoneInputChange = (value: string) => {
    const fullPhoneNumber = '+91' + value;
    const regex = /^[0-9\b]+$/;

    if (value === "" || regex.test(value) && !value.startsWith("0")) {
      setPhoneInput(value);
      setPhoneNumber(fullPhoneNumber);
      if (value.length > 0) {
        // `${selectedCountryCode.value}${value}`
        const number = parsePhoneNumberFromString(fullPhoneNumber);

        if (number && number.isValid()) {
          setIsPhoneValid(true);
        } else {
          setIsPhoneValid(false);
        }
      } else {
        setIsPhoneValid(false);
      }
    }
  };

  const handleSupportClick = () => {
    const whatsappUrl = `https://wa.me/+919415006092`;
    Linking.openURL(whatsappUrl);
  };

  const handleCheckUser = async () => {
    if (!isPhoneValid) {
      setErrorMessage("Please enter a valid phone number and country code.");
      return;
    }
  
    try {
      const result = await dispatch(setAgentDataState(phoneNumber)).unwrap();
  
      if (result?.docId) {
        // Set up real-time listener for the agent
        dispatch(listenToAgentChanges(result.docId));
  
        const agentData = result.docData;
  
        if (agentData?.blacklisted) {
          router.push('../loginPages/BlacklistedPage');
          return;
        }
  
        if (!agentData?.verified) {
          router.push('../loginPages/VerificationPage');
          return;
        }
  
        // Sign in only if not blacklisted or unverified
        await signInWithPhoneNumber();
      } else {
        setErrorMessage("No user found.");
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
    } finally {
      dispatch(setPhonenumber(phoneNumber));
    }
  };
  



  const signInWithPhoneNumber = async () => {
    setIsSendingOTP(true);
    setErrorMessage(""); // Reset any previous errors

    try {
        console.log('📱 Attempting to send OTP to:', phoneNumber);

        // Configure reCAPTCHA verifier if needed
        if (!auth().settings.appVerificationDisabledForTesting) {
            console.log('⚠️ Warning: App verification is enabled. Make sure reCAPTCHA is configured.');
        }

        // Send OTP using Firebase
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
        console.log('✅ OTP sent successfully, confirmation received');

        setIsSendingOTP(false);
        setConfirm(confirmation);
        // Show success message to user


    } catch (error: any) {
        console.error("❌ Error during OTP send:", {
            message: error.message,
            code: error.code,
            nativeErrorMessage: error.nativeErrorMessage
        });

        // Handle specific error cases
        if (error.code === 'auth/invalid-phone-number') {
            setErrorMessage("Please enter a valid phone number.");
        } else if (error.code === 'auth/too-many-requests') {
            setErrorMessage("Too many attempts. Please try again later.");
        } else if (error.code === 'auth/operation-not-allowed') {
            setErrorMessage("Phone authentication is not enabled. Please contact support.");
        } else {
            setErrorMessage(error.message || "Failed to send OTP. Please try again.");
        }
    } finally {
        setErrorMessage('');
        setIsSendingOTP(false);
        setStep(2);
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to ACN</Text>
      <Text style={styles.subheading}>Login or register with your Phone number</Text>

      <Text style={styles.label}>Phone Number*</Text>
      <View style={styles.inputRow}>
        <View style={styles.countryCodeBox}>
          <Text style={styles.countryCode}>+91</Text>
        </View>
        <TextInput
          placeholder="0000000000"
          keyboardType="numeric"
          maxLength={10}
          style={styles.input}
          onChangeText={handlePhoneInputChange}
          value={phoneInput}
        />
      </View>
      <View style={{ marginBottom: height * 0.04, minHeight: 24 }}>
        {errorMessage && (
          <Text style={{ color: '#EF4444', fontFamily: 'System', fontSize: 12, lineHeight: 21 }}>
            *{errorMessage}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, isPhoneValid && styles.buttonActive]}
        onPress={handleCheckUser}
        disabled={!isPhoneValid || loading || addingNewAgent}
      >
        <Text style={styles.buttonText}>{loading ? "Wait..." : "Login/Sign Up"}</Text>
      </TouchableOpacity>

      <View style={styles.whatsappRow}>
        <Image
          source={require('../../../assets/icons/Whatsapp.svg')}
          style={styles.whatsappIcon}
        />
        <Text style={styles.whatsappText}>WhatsApp number mandatory!</Text>
      </View>

      <Text style={styles.footerText}>
        Unable to login?{' '}
        <Text style={styles.clickHere} onPress={handleSupportClick}>
          Click here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.08,
    paddingBottom: height * 0.05,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subheading: {
    fontSize: width * 0.045,
    color: '#888',
    marginBottom: height * 0.04,
  },
  label: {
    fontSize: width * 0.045,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: height * 0.01,
    alignItems: 'center',
  },
  countryCodeBox: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.035,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  countryCode: {
    fontSize: width * 0.045,
  },
  input: {
    flex: 1,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    fontSize: width * 0.045,
  },
  button: {
    backgroundColor: '#ccc',
    paddingVertical: height * 0.018,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonActive: {
    backgroundColor: '#153E3B',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  whatsappRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.04,
  },
  whatsappIcon: {
    width: width * 0.05,
    height: width * 0.05,
    marginRight: 8,
  },
  whatsappText: {
    color: '#555',
    fontSize: width * 0.038,
  },
  footerText: {
    textAlign: 'center',
    fontSize: width * 0.04,
  },
  clickHere: {
    color: '#1a0dab',
    textDecorationLine: 'underline',
  },
});
