import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import PropertyDetailsScreen from './PropertyDetailsScreen';
// Import the ShareModal component
import ShareModal from '../ShareModal';

interface PropertyCardProps {
  property: {
    propertyId: string;
    title?: string;
    nameOfTheProperty?: string;
    micromarket?: string;
    assetType?: string;
    unitType?: string;
    facing?: string;
    totalAskPrice?: number;
    sbua?: number;
    driveLink?: string;
    cpId?: string;
    cpCode?: string;
  };
  onCardClick: (property: any) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onCardClick }) => {
  // Add state for details modal visibility
  const [showDetails, setShowDetails] = useState(false);
  // Add state for share modal
  const [showShareModal, setShowShareModal] = useState(false);

  // Debug the property data
  console.log("PropertyCard received:", property);

  // Format price display
  const formatPrice = () => {
    if (!property.totalAskPrice) return "N/A";
    
    if (property.totalAskPrice >= 100) {
      return `₹${(property.totalAskPrice / 100).toFixed(2)} Cr`;
    } else {
      return `₹${property.totalAskPrice} L`;
    }
  };

  // Get property name with first letter capitalized
  const getPropertyName = () => {
    const name = property.title || property.nameOfTheProperty || '';
    console.log("Property name before formatting:", name);
    if (!name) return "Unnamed Property";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Handle opening drive details
  const handleOpenDriveDetails = (e: any) => {
    e.stopPropagation();
    // Drive link functionality would be implemented later
  };

  // Handle enquire button click
  const handleEnquireNowBtn = (e: any) => {
    e.stopPropagation();
    // Enquire functionality would be implemented later
  };

  // Function to open property details screen
  const openPropertyDetails = () => {
    //console.log("Opening property details for:", property.propertyId);
    setShowDetails(true);
    //onCardClick(property);
  };

  // Handle share button click
  const handleShare = (e: any) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.cardContainer}
        onPress={openPropertyDetails}
      >
        <View style={styles.headerSection}>
          {/* Header section with Property ID and MicroMarket */}
          <View style={styles.headerRow}>
            {/* Property ID */}
            <View style={styles.idContainer}>
              <Text style={styles.propertyId}>
                {property.propertyId}
              </Text>
            </View>
            
            {/* Micromarket and Share Icon */}
            <View style={styles.locationContainer}>
              <View style={styles.locationBadge}>
                <Ionicons name="location-outline" size={14} color="#FAFBFC" />
                <Text style={styles.locationText}>
                  {property.micromarket || "-"}
                </Text>
              </View>
              
              {/* Share icon */}
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={handleShare}
              >
                <MaterialCommunityIcons name="share-variant" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Property Name */}
          <Text style={styles.propertyName}>
            {getPropertyName()}
          </Text>
        </View>

        {/* Tags section for Asset Type, Unit Type, and Facing */}
        <View style={styles.tagsContainer}>
          {[
            property.assetType,
            property.unitType,
            property.facing
          ]
            .filter(Boolean) // Filter out any falsy values
            .map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>
                  {tag}
                </Text>
              </View>
            ))}
        </View>

        {/* Price and SBUA (Super Built-Up Area) section */}
        <View style={styles.infoSection}>
          {/* Total Ask Price */}
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Total Ask Price:</Text>
            <Text style={styles.infoValue}>
              {formatPrice()}
            </Text>
          </View>
          
          {/* SBUA */}
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>SBUA:</Text>
            <Text style={styles.infoValue}>
              {property.sbua ? `${property.sbua} Sq Ft` : "-"}
            </Text>
          </View>
        </View>

        {/* Buttons for Drive Details and Enquire Now */}
        <View style={styles.buttonContainer}>
          {/* Drive Details Button */}
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={handleOpenDriveDetails}
          >
            <MaterialCommunityIcons name="google-drive" size={16} color="#153E3B" />
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
          
          {/* Enquire Now Button */}
          <TouchableOpacity 
            style={styles.enquireButton}
            onPress={handleEnquireNowBtn}
          >
            <Ionicons name="call-outline" size={16} color="white" />
            <Text style={styles.enquireButtonText}>Enquire Now</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Property Details Screen */}
      {showDetails && (
        <PropertyDetailsScreen 
          property={property} 
          onClose={() => setShowDetails(false)} 
        />
      )}
      
      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        property={property}
        agentData={{phonenumber: "1234567890"}} // Mock agent data
        setProfileModalOpen={setShowShareModal}
      />
    </>
  );
};

// Define styles to replace className
const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: '#CCCBCB',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 16,
    flexDirection: 'column',
  },
  headerSection: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idContainer: {
    flexDirection: 'row',
  },
  propertyId: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#747474',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  locationText: {
    color: '#FAFBFC',
    fontSize: 12,
    marginLeft: 4,
  },
  shareButton: {
    marginLeft: 8,
    padding: 4,
    backgroundColor: '#747474',
    borderRadius: 16,
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    color: '#4B5563',
    fontSize: 12,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#E3E3E3',
    paddingTop: 8,
    marginBottom: 4,
  },
  infoColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  infoLabel: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  detailsButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#153E3B',
    borderRadius: 6,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#153E3B',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 4,
  },
  enquireButton: {
    flex: 1,
    backgroundColor: '#153E3B',
    borderRadius: 6,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enquireButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default PropertyCard; 