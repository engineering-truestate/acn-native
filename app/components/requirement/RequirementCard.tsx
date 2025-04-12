import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RequirementDetailsScreen from './RequirementDetailsScreen';
import { useRouter } from 'expo-router';

interface RequirementCardProps {
  requirement: {
    requirementId: string;
    title: string;
    propertyName?: string;
    location: string;
    assetType: string;
    configuration: string;
    area?: number;
    budget: number | { from?: number; to?: number };
    marketValue?: string;
    status: string;
    createdAt: string;
    requirementDetails?: string;
    added?: number; // timestamp for when requirement was added
  };
  onCardClick: (requirement: any) => void;
}

// Helper function to capitalize the first letter of each word
const capitalize = (text: string): string => {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Use React.memo to optimize rendering and fix the static flag issue
const RequirementCard = React.memo(({ requirement, onCardClick }: RequirementCardProps) => {
  // State to control the display of the details modal
  const [showDetails, setShowDetails] = useState(false);
  
  // Format budget display
  const formatBudget = () => {
    if (requirement.marketValue === "Market Value") {
      return "Market Price";
    }
    
    if (typeof requirement.budget === 'number') {
      return `₹${requirement.budget.toLocaleString()} Cr`;
    }
    
    if (requirement.budget && typeof requirement.budget === 'object') {
      const from = requirement.budget.from || 0;
      const to = requirement.budget.to || 0;
      
      if (from === 0) {
        return `₹${to} Cr`;
      }
      
      if (from === to) {
        return `₹${to} Cr`;
      }
      
      return `₹${from} Cr - ₹${to} Cr`;
    }
    
    return `₹${(typeof requirement.budget === 'number' ? requirement.budget : 0).toLocaleString()} Cr`;
  };

  // Format property type and configuration
  const formatPropertyInfo = () => {
    const assetType = capitalize(requirement.assetType);
    const config = capitalize(requirement.configuration);
    const area = requirement.area ? `${requirement.area} sqft` : '';
    
    if (config && area) {
      return `${assetType} - ${config} / ${area}`;
    }
    
    if (config) {
      return `${assetType} - ${config}`;
    }
    
    if (area) {
      return `${assetType} - ${area}`;
    }
    
    return assetType;
  };

  // Handle card click to show details
  const handleCardPress = () => {
    console.log("Card pressed, showing details for:", requirement.requirementId);
    
    // Call the original onCardClick for analytics or other purposes
    //onCardClick(requirement);
    
    // Show the details modal
    setShowDetails(true);
  };

  // Handle closing the details
  const handleCloseDetails = () => {
    console.log("Closing details for:", requirement.requirementId);
    setShowDetails(false);
  };

  return (
    <>
      <TouchableOpacity 
        className="border border-[#CCCBCB] rounded-lg p-4 bg-white mb-4 flex-col"
        onPress={handleCardPress}
        activeOpacity={0.7}
      >
        {/* ID and name */}
        <View className="flex-col gap-2 mb-2">
          {/* Requirement ID */}
          <View className="flex-row">
            <Text className="text-gray-600 text-xs font-semibold border-b border-[#E3E3E3]">
              {requirement.requirementId}
            </Text>
          </View>

          {/* Project Name */}
          <Text className="text-black font-bold text-base">
            {capitalize(requirement.propertyName || requirement.title || '')}
          </Text>
        </View>

        {/* Budget and type */}
        <View className="flex-col gap-1 mb-0">
          {/* Budget Section */}
          <View className="flex-row items-center gap-2">
            <Ionicons name="cash-outline" size={20} color="#4B5563" />
            <Text className="text-neutral-600 text-sm font-medium">
              {formatBudget()}
            </Text>
          </View>

          {/* Configuration and Area Section */}
          <View className="flex-row items-center gap-2">
            <Ionicons name="home-outline" size={20} color="#4B5563" />
            <Text className="text-neutral-600 text-sm font-medium">
              {formatPropertyInfo()}
            </Text>
          </View>
        </View>

        {/* Requirement Details */}
        {requirement.requirementDetails && (
          <Text 
            className="text-neutral-600 text-sm font-medium mt-4 mb-0"
            numberOfLines={2}
          >
            {capitalize(requirement.requirementDetails)}
          </Text>
        )}
      </TouchableOpacity>

      {/* Requirement Details Modal */}
      <RequirementDetailsScreen
        requirement={requirement}
        onClose={handleCloseDetails}
        visible={showDetails}
      />
    </>
  );
});

// Set display name for debugging
RequirementCard.displayName = 'RequirementCard';

export default RequirementCard; 