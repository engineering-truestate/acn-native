// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';

// export default function SignUp() {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const router = useRouter();

//   const handleLogin = () => {
//     // Navigate to OTPage and pass phone number
//     router.push({
//       pathname: '/OTPage',
//       params: { phoneNumber },
//     });
//   };

//   const handleSupportClick = () => {
//     alert('Redirecting to help section...');
//   };

//   const isPhoneValid = phoneNumber.length === 10;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Welcome to ACN</Text>
//       <Text style={styles.subheading}>Login or register with your Phone number</Text>

//       <Text style={styles.label}>Phone Number*</Text>
//       <View style={styles.inputRow}>
//         <View style={styles.countryCodeBox}>
//           <Text style={styles.countryCode}>+91</Text>
//         </View>
//         <TextInput
//           placeholder="0000000000"
//           keyboardType="numeric"
//           maxLength={10}
//           style={styles.input}
//           onChangeText={setPhoneNumber}
//           value={phoneNumber}
//         />
//       </View>

//       <TouchableOpacity
//         style={[styles.button, isPhoneValid && styles.buttonActive]}
//         onPress={handleLogin}
//         disabled={!isPhoneValid}
//       >
//         <Text style={styles.buttonText}>→ Login/Sign Up</Text>
//       </TouchableOpacity>

//       <View style={styles.whatsappRow}>
//         <Image
//           source={require('../assets/images/whatsapp.svg')} // Replace with valid image
//           style={styles.whatsappIcon}
//         />
//         <Text style={styles.whatsappText}>WhatsApp number mandatory!</Text>
//       </View>

//       <Text style={styles.footerText}>
//         Unable to login?{' '}
//         <Text style={styles.clickHere} onPress={handleSupportClick}>
//           Click here
//         </Text>
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 24,
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   heading: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     marginBottom: 6,
//     textAlign: 'left',
//   },
//   subheading: {
//     fontSize: 16,
//     color: '#888',
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     marginBottom: 24,
//     alignItems: 'center',
//   },
//   countryCodeBox: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderTopLeftRadius: 6,
//     borderBottomLeftRadius: 6,
//     backgroundColor: '#f5f5f5',
//   },
//   countryCode: {
//     fontSize: 16,
//   },
//   input: {
//     flex: 1,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderTopRightRadius: 6,
//     borderBottomRightRadius: 6,
//   },
//   button: {
//     backgroundColor: '#ccc',
//     padding: 14,
//     alignItems: 'center',
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   buttonActive: {
//     backgroundColor: '#34A853',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   whatsappRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   whatsappIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 8,
//   },
//   whatsappText: {
//     color: '#555',
//   },
//   footerText: {
//     textAlign: 'center',
//     fontSize: 14,
//   },
//   clickHere: {
//     color: '#1a0dab',
//     textDecorationLine: 'underline',
//   },
// });
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    router.push({
      pathname: '/components/Auth/OTPage',
      params: { phoneNumber },
    });
  };

  const handleSupportClick = () => {
    alert('Redirecting to help section...');
  };

  const isPhoneValid = phoneNumber.length === 10;

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
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isPhoneValid && styles.buttonActive]}
        onPress={handleLogin}
        disabled={!isPhoneValid}
      >
        <Text style={styles.buttonText}>→ Login/Sign Up</Text>
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
    marginBottom: height * 0.04,
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
