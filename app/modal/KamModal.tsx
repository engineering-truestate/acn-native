import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal } from "react-native";
import { selectMyKam } from "../redux/agentSlice";
import {
  selectKamName,
  selectKamNumber,
  setKamDataState,
  selectKamState,
} from "../redux/kamSlice";
import { firebase } from '@react-native-firebase/analytics';
import * as Linking from 'expo-linking';
import { AppDispatch, RootState } from '../redux/store';
import { Ionicons } from "@expo/vector-icons";

interface KamModalProps {
  setKamModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const KamModal: React.FC<KamModalProps> = ({ setKamModalOpen }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Getting Kam data from Redux store
  const myKamId = useSelector(selectMyKam);
  const kam_name = useSelector(selectKamName);
  const kam_number = useSelector(selectKamNumber);
  const kamState = useSelector(selectKamState);
  
  // Get agent data for debugging
  const agentData = useSelector((state: RootState) => state.agent.docData);

  // Debug logging for agent and KAM state
  useEffect(() => {
    console.log('KamModal - Debug Info:', {
      agentData: {
        kam: agentData?.kam,
        verified: agentData?.verified,
        // Add other relevant agent fields
      },
      kamState: {
        myKamId,
        kam_name,
        kam_number,
        loading: kamState.loading,
        error: kamState.error,
        kamDocData: kamState.kamDocData
      }
    });
  }, [agentData, myKamId, kam_name, kam_number, kamState]);

  // Fetch Kam data if the Kam ID exists
  useEffect(() => {
    if (myKamId) {
      console.log('KamModal - Fetching Kam data for ID:', myKamId);
      dispatch(setKamDataState(myKamId))
        .unwrap()
        .then((result) => {
          console.log('KamModal - Fetch success:', result);
        })
        .catch((error) => {
          console.error('KamModal - Fetch error:', error);
          Alert.alert('Error', 'Failed to load account manager details. Please try again.');
        });
    } else {
      console.log('KamModal - No Kam ID available');
    }
  }, [myKamId, dispatch]);

  // Function to log analytics event safely
  const logAnalyticsEvent = async (eventName: string, params: any) => {
    try {
      await firebase.analytics().logEvent(eventName, params);
    } catch (error) {
      console.warn('Analytics error:', error);
      // Continue execution even if analytics fails
    }
  };

  // Validation functions
  const isValidName = (name: string | null | undefined): boolean => {
    return typeof name === 'string' && name.trim().length > 0;
  };

  const isValidPhoneNumber = (number: string | null | undefined): boolean => {
    if (!number) return false;
    // Remove all non-digit characters except +
    const cleanedNumber = number.replace(/[^\d+]/g, '');
    // Check if it starts with + and has at least 10 digits after +
    return /^\+\d{10,}$/.test(cleanedNumber);
  };

  // Log initial data
  console.log('KamModal - Initial Data:', {
    myKamId,
    kam_name,
    kam_number,
    loading: kamState.loading,
    error: kamState.error,
    kamDocData: kamState.kamDocData,
    isNameValid: isValidName(kam_name),
    isNumberValid: isValidPhoneNumber(kam_number)
  });

  // Function to format phone number for display
  const formatDisplayNumber = (phoneNumber: string) => {
    if (!isValidPhoneNumber(phoneNumber)) {
      return 'Invalid phone number';
    }
    return phoneNumber;
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

  // Function to handle opening WhatsApp
  const openWhatsapp = async () => {
    if (!kam_number) {
      Alert.alert('Error', 'No phone number available');
      return;
    }

    try {
      await logAnalyticsEvent("kam_whatsapp_click", {
        kam_number: kam_number,
      });
      
      const url = `https://wa.me/${kam_number}`;
      console.log('Opening WhatsApp URL:', url);
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Alert.alert('Error', 'Could not open WhatsApp. Please make sure WhatsApp is installed.');
    }
  };

  // Function to handle phone call
  const handlePhoneNumberClick = async () => {
    if (!kam_number) {
      Alert.alert('Error', 'No phone number available');
      return;
    }

    try {
      await logAnalyticsEvent("kam_call_click", {
        kam_number: kam_number,
      });
      
      const url = `tel:${kam_number}`;
      console.log('Opening phone URL:', url);
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error making phone call:', error);
      Alert.alert('Error', 'Could not make phone call. Please make sure you have a phone app installed.');
    }
  };

  const renderContent = () => {
    if (kamState.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading account manager details...</Text>
        </View>
      );
    }

    if (!myKamId) {
      return (
        <View style={styles.noKamContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF9500" />
          <Text style={styles.noKamTitle}>No Account Manager Assigned</Text>
          <Text style={styles.noKamDescription}>
            You currently don't have an account manager assigned. Our team will assign one to you shortly.
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {getInitials(kam_name || 'Account Manager')}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color="#726C6C" />
              <Text style={styles.infoText} numberOfLines={1}>
                {isValidName(kam_name) ? kam_name : 'No name available'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color="#726C6C" />
              <Text style={styles.infoText}>
                {formatDisplayNumber(kam_number)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.description}>
          Your account manager is here to assist you with any questions or support you may need.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.callButton,
              !kam_number && styles.disabledButton
            ]}
            onPress={handlePhoneNumberClick}
            disabled={!kam_number}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.button, 
              styles.whatsappButton,
              !kam_number && styles.disabledButton
            ]}
            onPress={openWhatsapp}
            disabled={!kam_number}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => setKamModalOpen(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setKamModalOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalContainer} 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setKamModalOpen(false)}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Account Manager</Text>
            <Ionicons name="business-outline" size={24} color="#007AFF" />
          </View>

          {renderContent()}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 360,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252626',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
    alignSelf: 'stretch',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#25D366',
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
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: '#007AFF',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 1,
  },
  number: {
    fontSize: 16,
    marginLeft: 8,
    color: '#007AFF',
  },
  invalidNumber: {
    color: '#FF3B30',
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginBottom: 16,
  },
  noKamContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noKamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252626',
    marginTop: 16,
    marginBottom: 8,
  },
  noKamDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default KamModal;
