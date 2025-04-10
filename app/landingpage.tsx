import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/landingPageBg.webp')} // change if you use PNG
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.logo}>ACN</Text>
          <View style={styles.taglineRow}>
            <Text style={styles.tagline}>Connect</Text>
            <Text style={[styles.tagline, styles.separator]}>Collaborate</Text>
            <Text style={styles.tagline}>Succeed</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Agent Cooperation Network is a trusted platform that helps real estate agents share and find property listings for resale.
          </Text>

          <View style={styles.infoRow}>
            <Image source={require('../assets/icons/user-tick.svg')} style={styles.icon} />
            <Text style={styles.bulletText}>Only for verified agents</Text>
          </View>

          <View style={styles.infoRow}>
            <Image source={require('../assets/icons/arrow-2.svg')} style={styles.icon} />
            <Text style={styles.bulletText}>All transactions on a side-by-side basis.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/signin')}>
          <Image source={require('../assets/icons/login.svg')} style={styles.icon} />
          <Text style={styles.loginText}>Login/Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#153E3B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 84,
    paddingBottom: 140,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBlock: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 48,
    color: '#fff',
    fontFamily: 'serif',
    lineHeight: 58,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagline: {
    color: '#BFE9E6',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#DFF4F3',
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 10,
    padding: 24,
    maxWidth: 338,
    width: '100%',
    gap: 16,
    backdropFilter: 'blur(15px)', // not supported on all RN devices
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  bulletText: {
    color: '#E3E3E3',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: 338,
    width: '100%',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10302D',
  },
});
