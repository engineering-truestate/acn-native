import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropertyDetailsScreen from './PropertyDetailsScreen';
import EnquiryCPModal from '@/app/modals/EnquiryCPModal';
import ConfirmModal from '@/app/modals/ConfirmModal';
import ShareModal from '@/app/modals/ShareModal';

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

// Define the AgentData interface separately
interface AgentData {
  phonenumber: string;
  [key: string]: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onCardClick }) => {
  // Add state for details modal visibility
  
  const [selectedCPID, setSelectedCPID] = useState("");
  const [isConfirmModelOpen, setIsConfirmModelOpen] = useState(false);
  const [isEnquiryModelOpen, setIsEnquiryCPModelOpen] = useState(false);
  const [ isShareModalOpen, setIsShareModalOpen ] = useState(false);
  const [ agentData, setAgentData ] = useState<AgentData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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
    setSelectedCPID(property.cpCode || "")
    setIsConfirmModelOpen(true)
  };

  const handleCancel = () => {
    setIsConfirmModelOpen(false)
  };

  const handleConfirm = () => {
    console.log("Confirmed")
    setIsEnquiryCPModelOpen(true)
    setIsConfirmModelOpen(false)
  };

  const handleShareButton = () => {
    setIsShareModalOpen(true)
  };

  // Function to open property details screen
  const openPropertyDetails = () => {
    //console.log("Opening property details for:", property.propertyId);
    setShowDetails(true);
    //onCardClick(property);
  };

  return (
    <>
      <TouchableOpacity 
        className="border border-[#CCCBCB] rounded-lg p-4 bg-white mb-4 flex-col"
        onPress={openPropertyDetails}
      >
        <View className="flex-col mb-3">
          {/* Header section with Property ID and MicroMarket */}
          <View className="flex-row justify-between items-center">
            {/* Property ID */}
            <View className="flex-row">
              <Text className="text-gray-600 text-xs font-semibold border-b border-[#E3E3E3]">
                {property.propertyId}
              </Text>
            </View>
            
            {/* Micromarket */}
            <View className="flex-row items-center bg-[#747474] px-2 py-1 rounded-full">
              <Ionicons name="location-outline" size={14} color="#FAFBFC" />
              <Text className="text-[#FAFBFC] text-xs ml-1">
                {property.micromarket || "-"}
              </Text>
            </View>
            <Ionicons name="share-outline" size={14} color="#000" style={{ marginLeft: 5 }} onPress={handleShareButton} />
          </View>

          {/* Property Name */}
          <Text className="text-black font-bold text-base mt-2">
            {getPropertyName()}
          </Text>
        </View>

        {/* Tags section for Asset Type, Unit Type, and Facing */}
        <View className="flex-row flex-wrap gap-2 mb-3">
          {[
            property.assetType,
            property.unitType,
            property.facing
          ]
            .filter(Boolean) // Filter out any falsy values
            .map((tag, index) => (
              <View key={index} className="border border-[#E3E3E3] bg-white px-3 py-1 rounded-full">
                <Text className="text-neutral-600 text-xs">
                  {tag}
                </Text>
              </View>
            ))}
        </View>

        {/* Price and SBUA (Super Built-Up Area) section */}
        <View className="flex-row justify-between items-start border-t border-[#E3E3E3] pt-2 mb-3">
          {/* Total Ask Price */}
          <View className="flex-col items-start">
            <Text className="text-gray-600 text-xs font-semibold">Total Ask Price:</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {formatPrice()}
            </Text>
          </View>
          
          {/* SBUA */}
          <View className="flex-col items-start">
            <Text className="text-gray-600 text-xs font-semibold">SBUA:</Text>
            <Text className="text-sm font-semibold text-gray-900">
              {property.sbua ? `${property.sbua} Sq Ft` : "-"}
            </Text>
          </View>
        </View>

        {/* Buttons for Drive Details and Enquire Now */}
        <View className="flex-row gap-3 mt-1">
          {/* Drive Details Button */}
          <TouchableOpacity 
            className="flex-1 border border-[#153E3B] rounded-md py-2 flex-row justify-center items-center"
            onPress={handleOpenDriveDetails}
          >
            <Ionicons name="folder-outline" size={16} color="#153E3B" />
            <Text className="text-[#153E3B] font-medium text-xs ml-1">Details</Text>
          </TouchableOpacity>
          
          {/* Enquire Now Button */}
          <TouchableOpacity 
            className="flex-1 bg-[#153E3B] rounded-md py-2 flex-row justify-center items-center"
            onPress={handleEnquireNowBtn}
          >
            <Ionicons name="call-outline" size={16} color="white" />
            <Text className="text-white font-medium text-xs ml-1">Enquire Now</Text>
          </TouchableOpacity>
        </View>
        <EnquiryCPModal
            setIsEnquiryCPModalOpen={setIsEnquiryCPModelOpen}
            generatingEnquiry={false}
            visible={isEnquiryModelOpen}
            selectedCPID={selectedCPID}
          />
          <ConfirmModal
            title="Confirm Enquiry"
            message="Are you sure you want to enquire? You have 3 credits remaining for this month."
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            generatingEnquiry={false}
            visible={isConfirmModelOpen}
          />
          <ShareModal
          property={property}
          agentData={agentData}
          setProfileModalOpen={setIsShareModalOpen}
          visible = {isShareModalOpen}
        />
      </TouchableOpacity>

      {/* Property Details Screen */}
      {showDetails && (
        <PropertyDetailsScreen 
          property={property} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
};

export default PropertyCard; 