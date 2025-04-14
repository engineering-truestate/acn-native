import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Clipboard,
  StyleSheet,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Helper functions 
const createPropertyMessage = async (property: any, agentPhone?: string) => {
  // Implement the actual message creation logic
  const propertyName = property.title || property.nameOfTheProperty || 'Unnamed Property';
  const price = property.totalAskPrice ? 
    (property.totalAskPrice >= 100 ? 
      `₹${(property.totalAskPrice / 100).toFixed(2)} Cr` : 
      `₹${property.totalAskPrice} L`) 
    : 'Price on request';
  const sbua = property.sbua ? `${property.sbua} Sq Ft` : 'N/A';
  const location = property.micromarket || 'N/A';
  const agentContact = agentPhone ? `\nContact: ${agentPhone}` : '';
  
  return `*${propertyName}*\nPrice: ${price}\nSBUA: ${sbua}\nLocation: ${location}\nProperty ID: ${property.propertyId}${agentContact}`;
};

const shareProperty = async (property: any, agentPhone?: string) => {
  try {
    const message = await createPropertyMessage(property, agentPhone);
    const encodedMessage = encodeURIComponent(message);
    const url = `whatsapp://send?text=${encodedMessage}`;
    
    // Check if WhatsApp is installed
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "WhatsApp Not Installed",
        "WhatsApp is not installed on your device",
        [{ text: "OK" }]
      );
    }
  } catch (error) {
    console.error('Error sharing via WhatsApp:', error);
    Alert.alert(
      "Error",
      "Could not share via WhatsApp",
      [{ text: "OK" }]
    );
  }
};

interface ShareModalProps {
  visible: boolean;
  property: any;
  agentData: any;
  setProfileModalOpen: (open: boolean) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ visible, property, agentData, setProfileModalOpen }) => {
  const handleCopy = async () => {
    try {
      console.log("Property: ", property);
      let details = await createPropertyMessage(property, agentData?.phonenumber);
      console.log("Details Fetched: ", details);
      console.log("Agent's Phone Number: ", agentData);
      details = decodeURIComponent(details);
      Clipboard.setString(details);
      
      // Show confirmation to user
      Alert.alert(
        "Copied",
        "Property details copied to clipboard",
        [{ text: "OK" }]
      );
    } catch (err) {
      console.error('Failed to copy:', err);
      Alert.alert(
        "Error",
        "Could not copy property details",
        [{ text: "OK" }]
      );
    }
  };

  const handleShare = () => {
    shareProperty(property, agentData?.phonenumber);
  };

  const handleClose = () => {
    setProfileModalOpen(false);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>Share</Text>
                <Text style={styles.description}>
                  Copy or share details on WhatsApp with your contact information included.
                </Text>
              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                  <View style={styles.iconWrapper}>
                    <MaterialCommunityIcons name="whatsapp" size={28} color="#25D366" />
                  </View>
                  <Text style={styles.buttonText}>Share on WhatsApp</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                  <View style={styles.iconWrapper}>
                    <Ionicons name="copy-outline" size={24} color="#555" />
                  </View>
                  <Text style={styles.buttonText}>Copy Details</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FAFAFA',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    position: 'relative',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#153E3B',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#313131',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 58,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  iconWrapper: {
    width: 40,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginLeft: -10,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { ShareModal, shareProperty, createPropertyMessage };
export default ShareModal; 