import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { showMessage } from 'react-native-flash-message';
import { showToast } from '../helpers/toastUtils';

// Define the AgentData interface separately
interface AgentData {
  phonenumber: string;
  [key: string]: any;
}

// Props type for your EnquiryCPModal component
type EnquiryCPModalProps = {
  setIsEnquiryCPModalOpen: (isOpen: boolean) => void;
  generatingEnquiry?: boolean;
  visible: boolean;
  agentData?: AgentData;
  selectedCPID: string
};

const EnquiryCPModal: React.FC<EnquiryCPModalProps> = ({
  setIsEnquiryCPModalOpen,
  generatingEnquiry,
  visible,
  selectedCPID
}) => {

  const [agentData, setAgentData] = useState<AgentData | null>(null);

  useEffect(() => {
    const fetchAgentData = async () => {
      if (!selectedCPID) return;

      try {
        const docRef = doc(db, "agents", selectedCPID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as AgentData;
          setAgentData(data);
          console.log("Agent Data:", data);
        } else {
          console.warn("No agent data found");
          setAgentData(null);
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };

    fetchAgentData();
  }, [selectedCPID]);

  const handleWhatsAppEnquiry = (): void => {
    if (agentData?.phonenumber) return;


    // Open WhatsApp chat in a new tab
    window.open(`https://wa.me/${agentData.phonenumber}`, "_blank");
  };

  const handleCopy = (): void => {
    if (!agentData?.phonenumber) return;

    navigator.clipboard
      .writeText(agentData.phonenumber)
      .then(() => showToast('Phone number copied!', '', 'success'))
      // .then(() => toast.success("Phone number copied!"))
      .catch((err: unknown) => {
        console.error("Failed to copy phone number:", err);
      });
    console.log(agentData?.phonenumber)
  };

  const handleCall = (): void => {
    if (!agentData?.phonenumber) return;

    // Redirect to dialer with the phone number
    window.location.href = `tel:${agentData.phonenumber}`;
  };

  const onClose = () => {
    setIsEnquiryCPModalOpen(false)
  }

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Contact Agent</Text>
          <Text style={styles.message}>
            You can reach the agent via WhatsApp, Call, or simply copy the number.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
              <Text style={styles.buttonText}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCall} style={styles.actionButton}>
              <Text style={styles.buttonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleWhatsAppEnquiry} style={styles.actionButton}>
              <Text style={styles.buttonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
export default EnquiryCPModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#153E3B",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: "#153E3B",
    fontWeight: "600",
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  closeText: {
    color: "#FF5A5F",
    fontSize: 14,
  },
});