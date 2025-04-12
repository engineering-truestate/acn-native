import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { selectMyKam } from "../redux/agentSlice";
import {
  selectKamName,
  selectKamNumber,
  setKamDataState,
} from "../redux/kamSlice";
import { firebase } from '@react-native-firebase/analytics';
import * as Linking from 'expo-linking';
import { AppDispatch } from '../redux/store';
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
  const loading = useSelector((state: any) => state.kam.loading);

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
    loading,
    isNameValid: isValidName(kam_name),
    isNumberValid: isValidPhoneNumber(kam_number)
  });

  // Fetch Kam data if the Kam ID exists
  useEffect(() => {
    if (myKamId) {
      console.log('KamModal - Fetching Kam data for ID:', myKamId);
      dispatch(setKamDataState(myKamId));
    } else {
      console.log('KamModal - No Kam ID available');
    }
  }, [myKamId, dispatch]);

  // Function to format phone number for display
  const formatDisplayNumber = (phoneNumber: string) => {
    if (!isValidPhoneNumber(phoneNumber)) {
      return 'Invalid phone number';
    }
    return phoneNumber;
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

  return (
    <View style={styles.modalContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {isValidName(kam_name) ? kam_name : 'Invalid Name'}
          </Text>
          
          <TouchableOpacity 
            onPress={handlePhoneNumberClick}
            style={styles.phoneNumberContainer}
            disabled={!kam_number}
          >
            <Ionicons name="call-outline" size={20} color="#007AFF" />
            <Text style={[
              styles.number,
              !kam_number && styles.invalidNumber
            ]}>
              {formatDisplayNumber(kam_number)}
            </Text>
          </TouchableOpacity>

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

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setKamModalOpen(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  number: {
    fontSize: 16,
    marginLeft: 8,
    color: '#007AFF',
  },
  invalidNumber: {
    color: '#FF3B30',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
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
    padding: 10,
  },
  closeButtonText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});

export default KamModal;
