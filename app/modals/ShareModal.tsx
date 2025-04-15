import React, { useEffect, useRef } from 'react';
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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logEvent } from 'firebase/analytics';

import { shareProperty, createPropertyMessage } from '../helpers/shareModal';

import whatsappIcon from '../../assets/icons/whatsAppgreen.svg 14-54-26-826.svg';
import copyIcon from '../../assets/icons/copyenq.svg';
import closeIcon from '../../assets/icons/close.svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


interface ShareModalProps {
  visible: boolean;
  property: any;
  agentData: any;
  setProfileModalOpen: (open: boolean) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ visible, property, agentData, setProfileModalOpen }) => {
  const dispatch = useDispatch();
  const phoneNumber = useSelector((state: any) => state.agent.phonenumber);


  const handleCopy = async () => {
    try {
      console.log("Property: ", property)
      let details = await createPropertyMessage(property, agentData?.phonenumber);
      console.log("Details Fetched: ", details)
      console.log("Agent's Phone Number: ", agentData);
      details = decodeURIComponent(details);
      Clipboard.setString(details);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    shareProperty(property, agentData?.phonenumber, phoneNumber);
  };

  const handleClose = () => {
    setProfileModalOpen(false);
  }

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


export default ShareModal; 

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
