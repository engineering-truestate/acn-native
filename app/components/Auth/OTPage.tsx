// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';

// export default function OTPage() {
//   const { phoneNumber } = useLocalSearchParams();
//   const router = useRouter();

//   const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
//   const inputs: { [key: string]: any } = {};

//   const handleOtpChange = (text: string, index: number) => {
//     if (text.length > 1) return;

//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     // Auto-focus to next input
//     if (text && index < 5) {
//       const nextInput = `otp-${index + 1}`;
//       (inputs[nextInput] as any)?.focus();
//     }
//   };

//   const handleVerify = () => {
//     const fullOtp = otp.join('');
//     Alert.alert('Verifying OTP', `OTP: ${fullOtp} for +91 ${phoneNumber}`);
//     // Proceed to next screen or verify with backend
//   };

//   const handleResend = () => {
//     Alert.alert('Resending OTP', `Sending OTP again to +91 ${phoneNumber}`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Welcome to ACN</Text>
//       <Text style={styles.otpInfo}>
//         OTP sent to <Text style={styles.phone}>+91 {phoneNumber}</Text>
//       </Text>

//       <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
//         <Text style={styles.resendText}>Resend Code</Text>
//       </TouchableOpacity>

//       <View style={styles.otpRow}>
//         {otp.map((value, index) => (
//           <TextInput
//             key={index}
//             ref={(ref) => (inputs[`otp-${index}`] = ref)}
//             style={styles.otpInput}
//             maxLength={1}
//             keyboardType="numeric"
//             value={value}
//             onChangeText={(text) => handleOtpChange(text, index)}
//           />
//         ))}
//       </View>

//       <TouchableOpacity
//         style={[styles.verifyButton, otp.every((val) => val) && styles.verifyButtonActive]}
//         onPress={handleVerify}
//         disabled={!otp.every((val) => val)}
//       >
//         <Text style={styles.verifyText}>Verify OTP</Text>
//       </TouchableOpacity>

//       <View style={styles.inlineRow}>
//         <TouchableOpacity onPress={() => router.push('/VerificationPage')}>
//           <Text style={styles.lText}>Didn't get verified? </Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => router.push('/BlacklistedPage')}>
//           <Text style={styles.cHere}>Click here</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity onPress={() => router.back()}>
//         <Text style={styles.backText}>← Back</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
//   heading: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
//   otpInfo: { fontSize: 16, color: '#888' },
//   phone: { fontWeight: 'bold', color: '#0c3' },
//   resendButton: { marginTop: 12, marginBottom: 24 },
//   resendText: { color: '#023020', fontWeight: 'bold' },
//   otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
//   otpInput: {
//     borderBottomWidth: 2,
//     borderColor: '#ccc',
//     width: 40,
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   verifyButton: {
//     backgroundColor: '#ccc',
//     padding: 16,
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   verifyButtonActive: {
//     backgroundColor: '#34A853',
//   },
//   verifyText: { color: '#fff', fontWeight: 'bold' },
//   linkText: {
//     marginTop: 20,
//     fontSize: 15,
//     textAlign: 'center',
//     color: '#444',
//   },
//   clickHere: {
//     color: '#1a73e8',
//     fontWeight: 'bold',
//   },
//   backText: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: '#023020',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   inlineRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   lText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   cHere: {
//     fontSize: 14,
//     color: '#1a0dab',
//     fontWeight: 'bold',
//   },
  
// });
import React from 'react';
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
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
const { width, height } = Dimensions.get('window');
export default function OTPage() {

  // const { phoneNumber } = redux
  const { phoneNumber } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const inputs: { [key: string]: any } = {};

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      const nextInput = `otp-${index + 1}`;
      (inputs[nextInput] as any)?.focus();
    }
  };

  const handleVerify = () => {
    const fullOtp = otp.join('');
    Alert.alert('Verifying OTP', `OTP: ${fullOtp} for +91 ${phoneNumber}`);
    router.push('/(tabs)/properties');
  };

  const handleResend = () => {
    Alert.alert('Resending OTP', `Sending OTP again to +91 ${phoneNumber}`);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { fontSize: width * 0.08 }]}>Welcome to ACN</Text>
      <Text style={[styles.otpInfo, { fontSize: width * 0.04 }]}>
        OTP sent to <Text style={styles.phone}>+91 {phoneNumber}</Text>
      </Text>
      {/* <Text style={styles.heading}>Welcome to ACN</Text>
<Text style={styles.subheading}>
  Login or register with your Phone number
  <Text style={styles.phone}> +91 {phoneNumber}</Text>
</Text> */}


      <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
        <Text style={[styles.resendText, { fontSize: width * 0.04 }]}>Resend Code</Text>
      </TouchableOpacity>

      <View style={styles.otpRow}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs[`otp-${index}`] = ref)}
            style={[styles.otpInput, { width: width * 0.12, fontSize: width * 0.05 }]}
            maxLength={1}
            keyboardType="numeric"
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
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

      <View style={styles.inlineRow}>
        <TouchableOpacity onPress={() => router.push('/components/Auth/VerificationPage')}>
          <Text style={[styles.lText, { fontSize: width * 0.035 }]}>
            Didn't get verified?{' '}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/components/Auth/BlacklistedPage')}>
          <Text style={[styles.cHere, { fontSize: width * 0.035 }]}>Click here</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.backText, { fontSize: width * 0.04 }]}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  heading: { fontWeight: 'bold', marginBottom: 6,marginTop:0,textAlign: 'center'},
  otpInfo: { color: '#888', marginBottom: 10,textAlign: 'center',marginTop:8 },
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
    marginTop:2,
  },
  cHere: {
    color: '#1a0dab',
    fontWeight: 'bold',
    marginTop:2,
  },
  subheading: {
    fontSize: width * 0.045,
    color: '#888',
    marginBottom: height * 0.04,
  },
});
