import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../../../../types';

interface PropertyInfoProps {
  property: Property;
}

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.title}>{property.title}</Text>
      <Text style={styles.price}>₹ {property.totalAskPrice} Lacs</Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="bed-outline" size={20} color="#374151" />
          <Text style={styles.detailText}>{property.unitType}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="resize-outline" size={20} color="#374151" />
          <Text style={styles.detailText}>{property.sbua} sqft</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={20} color="#374151" />
          <Text style={styles.detailText}>{property.micromarket}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{property.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 16,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 24,
    color: '#374151',
    marginBottom: 8,
  },
  price: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 20,
    color: '#10B981',
    marginBottom: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#374151',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default PropertyInfo; 