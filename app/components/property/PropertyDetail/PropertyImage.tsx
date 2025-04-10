import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Property } from '../../../../types';

interface PropertyImageProps {
  property: Property;
}

const PropertyImage = ({ property }: PropertyImageProps) => {
  return (
    <Image
      source={{ uri: property.image || 'https://via.placeholder.com/300x200' }}
      style={styles.propertyImage}
    />
  );
};

const styles = StyleSheet.create({
  propertyImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
});

export default PropertyImage; 