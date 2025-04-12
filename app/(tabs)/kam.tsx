import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import KamModal from '../modal/KamModal';

export default function KamScreen() {
  const [isKamModalOpen, setKamModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Account Manager</Text>
        
        <View style={styles.infoContainer}>
          <Ionicons name="person-circle-outline" size={60} color="#007AFF" />
          <Text style={styles.description}>
            Your dedicated Account Manager is here to assist you with any queries or support you need.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => setKamModalOpen(true)}
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

      {/* KamModal */}
      {isKamModalOpen && (
        <KamModal setKamModalOpen={setKamModalOpen} />
      )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
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