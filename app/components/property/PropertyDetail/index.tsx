import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Property } from '../../../../types';
import PropertyHeader from './PropertyHeader';
import PropertyImage from './PropertyImage';
import PropertyInfo from './PropertyInfo';
import PropertyDetails from './PropertyDetails';
import PropertyFooter from './PropertyFooter';

interface PropertyDetailProps {
  property: Property;
}

const PropertyDetail = ({ property }: PropertyDetailProps) => {
  return (
    <View style={styles.container}>
      <PropertyHeader />
      <ScrollView style={styles.content}>
        <PropertyImage property={property} />
        <PropertyInfo property={property} />
        <PropertyDetails property={property} />
      </ScrollView>
      <PropertyFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});

export default PropertyDetail; 