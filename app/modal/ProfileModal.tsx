import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";
import { firebase } from '@react-native-firebase/analytics';
import { logOut } from '../redux/authSlice';

interface ProfileModalProps {
  setProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ setProfileModalOpen }) => {
  const dispatch = useDispatch();
  // Getting user data from Redux store - the logged in user
  const { phonenumber, docData, name, email } = useSelector((state: any) => state.agent);

  // Debug logs
  console.log('ProfileModal - User Data:', { 
    phonenumber, 
    name: docData?.name || name,
    email: docData?.email || email
  });

  const handleLogout = async () => {
    try {
      await firebase.analytics().logEvent("user_logout_clicked");
      // @ts-ignore - Temporarily ignore the type error for logOut action
      dispatch(logOut());
      setProfileModalOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Function to generate initials from name
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Function to capitalize words
  const toCapitalizedWords = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get the user's name from docData or fallback to name property
  const userName = docData?.name || name || 'User';
  
  // Get the display phone number
  const displayPhone = phonenumber ? 
    (phonenumber.startsWith('+') ? phonenumber.slice(3) : phonenumber) : 
    'No phone number';

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => setProfileModalOpen(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setProfileModalOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalContainer} 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setProfileModalOpen(false)}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Profile</Text>
            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {getInitials(userName)}
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={18} color="#726C6C" />
                <Text style={styles.infoText} numberOfLines={1}>
                  {toCapitalizedWords(userName)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={18} color="#726C6C" />
                <Text style={styles.infoText}>
                  {displayPhone}
                </Text>
              </View>

              {(docData?.email || email) && (
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={18} color="#726C6C" />
                  <Text style={styles.infoText} numberOfLines={1}>
                    {docData?.email || email}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={18} color="#DE1135" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 360,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252626',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#726C6C',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DE1135',
    borderRadius: 4,
  },
  logoutText: {
    color: '#DE1135',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProfileModal; 