import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import KamModal from '../modal/KamModal';
import ProfileModal from '../modal/ProfileModal';

export default function KamScreen() {
  const [isKamModalOpen, setKamModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  // Debug logs
  console.log('KamScreen - KamModal Open:', isKamModalOpen);
  console.log('KamScreen - ProfileModal Open:', isProfileModalOpen);

  const handleProfilePress = () => {
    console.log('Profile button pressed');
    setProfileModalOpen(true);
  };

  const handleKamPress = () => {
    console.log('KAM button pressed');
    setKamModalOpen(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Account Manager</Text>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={handleProfilePress}
          >
            <Ionicons name="person-circle" size={32} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoContainer}>
          <Ionicons name="person-circle-outline" size={60} color="#007AFF" />
          <Text style={styles.description}>
            Your dedicated Account Manager is here to assist you with any queries or support you need.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.contactButton}
          onPress={handleKamPress}
        >
          <Ionicons name="call" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Contact Account Manager</Text>
        </TouchableOpacity>

        {/* Features section */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>How can they help?</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="help-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Answer your queries</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="build-outline" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Technical support</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="document-text-outline" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Documentation assistance</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="trending-up-outline" size={24} color="#007AFF" />
            <Text style={styles.featureText}>Business growth support</Text>
          </View>
        </View>
      </View>

      {/* Modals */}
      {isKamModalOpen && <KamModal setKamModalOpen={setKamModalOpen} />}
      {isProfileModalOpen && <ProfileModal setProfileModalOpen={setProfileModalOpen} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  profileButton: {
    padding: 4,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
  },
  contactButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#4a4a4a',
  },
}); 