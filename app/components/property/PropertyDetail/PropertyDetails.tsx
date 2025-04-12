import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Define Property interface locally to fix the import error
interface Property {
  assetType: string;
  facing: string;
  floorNo: string | number;
  plotSize: string | number;
  carpet: string | number;
  askPricePerSqft: string | number;
  [key: string]: any;
}

interface PropertyDetailsProps {
  property: Property;
}

// Use React.memo to optimize rendering and fix the static flag issue
const PropertyDetails = React.memo(({ property }: PropertyDetailsProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Property Details</Text>
      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Asset Type</Text>
          <Text style={styles.detailValue}>{property.assetType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Facing</Text>
          <Text style={styles.detailValue}>{property.facing}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Floor</Text>
          <Text style={styles.detailValue}>{property.floorNo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Plot Size</Text>
          <Text style={styles.detailValue}>{property.plotSize} sqft</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Carpet Area</Text>
          <Text style={styles.detailValue}>{property.carpet} sqft</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price/Sqft</Text>
          <Text style={styles.detailValue}>₹ {property.askPricePerSqft}</Text>
        </View>
      </View>
    </View>
  );
});

// Set display name for debugging
PropertyDetails.displayName = 'PropertyDetails';

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#374151',
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailRow: {
    width: '48%',
  },
  detailLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#374151',
  },
});

export default PropertyDetails; 