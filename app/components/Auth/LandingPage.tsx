// app/LandingPage.tsx or app/landing.tsx (depending on your folder structure)
// import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
// import { useRouter } from 'expo-router';

// export default function LandingPage() {
//   const router = useRouter();

//   const handleNavigate = () => {
//     router.push('/Signin'); // or '/signin' depending on your folder/file name
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/images/landingPageBg.webp')}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <View style={styles.titleBlock}>
//           <Text style={styles.title}>ACN</Text>
//           <View style={styles.subtitleRow}>
//             <Text style={styles.subtitle}>Connect</Text>
//             <Text style={[styles.subtitle, styles.subtitleDivider]}>Collaborate</Text>
//             <Text style={styles.subtitle}>Succeed</Text>
//           </View>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardText}>
//             Agent Cooperation Network is a trusted platform that helps real estate agents share and find property listings for resale.
//           </Text>

//           <View style={styles.infoItem}>
//             <Image source={require('../assets/images/user-tick.svg')} style={styles.icon} />
//             <Text style={styles.infoText}>Only for verified agents</Text>
//           </View>

//           <View style={styles.infoItem}>
//             <Image source={require('../assets/images/arrow-2.svg')} style={styles.icon} />
//             <Text style={styles.infoText}>All transactions on a side-by-side basis.</Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.loginBtn} onPress={handleNavigate}>
//           <Image source={require('../assets/images/login.svg')} style={styles.loginIcon} />
//           <Text style={styles.loginText}>Login / Sign Up</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 84,
//     paddingBottom: 140,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   titleBlock: {
//     alignItems: 'center',
//     maxWidth: 288,
//   },
//   title: {
//     fontSize: 48,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontFamily: 'serif',
//     lineHeight: 57,
//   },
//   subtitleRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginTop: 8,
//   },
//   subtitle: {
//     color: '#AAAAAA',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   subtitleDivider: {
//     paddingHorizontal: 8,
//     borderLeftWidth: 1,
//     borderRightWidth: 1,
//     borderColor: '#444',
//   },
//   card: {
//     width: '100%',
//     maxWidth: 338,
//     padding: 24,
//     borderRadius: 10,
//     backgroundColor: 'rgba(255,255,255,0.05)',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.05)',
//     gap: 24,
//   },
//   cardText: {
//     color: '#CCCCCC',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginTop: 12,
//   },
//   icon: {
//     width: 20,
//     height: 20,
//     tintColor: '#DDDDDD',
//   },
//   infoText: {
//     color: '#AAAAAA',
//     fontSize: 14,
//   },
//   loginBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1F1F1F',
//     paddingVertical: 14,
//     borderRadius: 8,
//     width: '100%',
//     maxWidth: 338,
//     gap: 10,
//   },
//   loginIcon: {
//     width: 20,
//     height: 20,
//     tintColor: '#FFFFFF',
//   },
//   loginText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });
// import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
// import { useRouter } from 'expo-router';

// const { width, height } = Dimensions.get('window');

// export default function LandingPage() {
//   const router = useRouter();

//   const handleNavigate = () => {
//     router.push('/Signin');
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/images/landingPageBg.webp')}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <View style={styles.titleBlock}>
//           <Text style={styles.title}>ACN</Text>
//           <View style={styles.subtitleRow}>
//             <Text style={styles.subtitle}>Connect</Text>
//             <Text style={[styles.subtitle, styles.subtitleDivider]}>Collaborate</Text>
//             <Text style={styles.subtitle}>Succeed</Text>
//           </View>
//         </View>

//         <View style={styles.card}>
//           <Text style={styles.cardText}>
//             Agent Cooperation Network is a trusted platform that helps real estate agents share and find property listings for resale.
//           </Text>

//           <View style={styles.infoItem}>
//             <Image source={require('../assets/images/user-tick.svg')} style={styles.icon} />
//             <Text style={styles.infoText}>Only for verified agents</Text>
//           </View>

//           <View style={styles.infoItem}>
//             <Image source={require('../assets/images/arrow-2.svg')} style={styles.icon} />
//             <Text style={styles.infoText}>All transactions on a side-by-side basis.</Text>
//           </View>
//         </View>

//         <TouchableOpacity style={styles.loginBtn} onPress={handleNavigate}>
//           <Image source={require('../assets/images/login.svg')} style={styles.loginIcon} />
//           <Text style={styles.loginText}>Login / Sign Up</Text>
//         </TouchableOpacity>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: width * 0.05,
//     paddingTop: height * 0.1,
//     paddingBottom: height * 0.08,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   titleBlock: {
//     alignItems: 'center',
//     maxWidth: width * 0.8,
//   },
//   title: {
//     fontSize: width * 0.1,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     fontFamily: 'serif',
//     lineHeight: width * 0.12,
//   },
//   subtitleRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginTop: 8,
//   },
//   subtitle: {
//     color: '#AAAAAA',
//     fontSize: width * 0.04,
//     textAlign: 'center',
//   },
//   subtitleDivider: {
//     paddingHorizontal: 8,
//     borderLeftWidth: 1,
//     borderRightWidth: 1,
//     borderColor: '#444',
//   },
//   card: {
//     width: '100%',
//     maxWidth: 338,
//     padding: width * 0.06,
//     borderRadius: 10,
//     backgroundColor: 'rgba(255,255,255,0.05)',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.05)',
//     gap: 24,
//   },
//   cardText: {
//     color: '#CCCCCC',
//     fontSize: width * 0.04,
//     fontWeight: '500',
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginTop: 12,
//   },
//   icon: {
//     width: width * 0.05,
//     height: width * 0.05,
//     tintColor: '#DDDDDD',
//     resizeMode: 'contain',
//   },
//   infoText: {
//     color: '#AAAAAA',
//     fontSize: width * 0.035,
//   },
//   loginBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#1F1F1F',
//     paddingVertical: height * 0.018,
//     borderRadius: 8,
//     width: '100%',
//     maxWidth: 338,
//     gap: 10,
//   },
//   loginIcon: {
//     width: width * 0.05,
//     height: width * 0.05,
//     tintColor: '#FFFFFF',
//     resizeMode: 'contain',
//   },
//   loginText: {
//     color: '#FFFFFF',
//     fontSize: width * 0.045,
//     fontWeight: '600',
//   },
// });
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Linking } from 'react-native';
import { useRouter } from 'expo-router';
// import landing from '../../../assets/images/landingPageBg.webp';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();

  const handleNavigate = () => {
    console.log("Yayyyyyyyyyyyyyyyyyyyyyyyyyyyy")
    router.push('/components/Auth/Signin'); 
  };

  return (
    <ImageBackground
      // source={(landing)}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>ACN</Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>Connect</Text>
            <Text style={[styles.subtitle, styles.subtitleDivider]}>Collaborate</Text>
            <Text style={styles.subtitle}>Succeed</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>
            Agent Cooperation Network is a trusted platform that helps real estate agents share and find property listings for resale.
          </Text>

          <View style={styles.infoItem}>
            <Image source={require('../../../assets/icons/user-tick.svg')} style={styles.icon} />
            <Text style={styles.infoText}>Only for verified agents</Text>
          </View>

          <View style={styles.infoItem}>
            <Image source={require('../../../assets/icons/arrow-2.svg')} style={styles.icon} />
            <Text style={styles.infoText}>All transactions on a side-by-side basis.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleNavigate}>
          <Image source={require('../../../assets/icons/login.svg')} style={styles.loginIcon} />
          <Text style={styles.loginText}>Login / Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.08,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBlock: {
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  title: {
    fontSize: width * 0.1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'serif',
    lineHeight: width * 0.12,
  },
  subtitleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  subtitleDivider: {
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#444',
  },
  card: {
    width: '100%',
    maxWidth: 338,
    padding: width * 0.06,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 24,
  },
  cardText: {
    color: '#CCCCCC',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  icon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: '#DDDDDD',
    resizeMode: 'contain',
  },
  infoText: {
    color: '#AAAAAA',
    fontSize: width * 0.035,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1F1F',
    paddingVertical: height * 0.018,
    borderRadius: 8,
    width: '100%',
    maxWidth: 338,
    gap: 10,
    marginBottom: height * 0.2, // Added margin to shift the button slightly up
  },
  loginIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});
