import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PropertyFooter = () => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactButtonText}>Contact Agent</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  contactButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default PropertyFooter; 