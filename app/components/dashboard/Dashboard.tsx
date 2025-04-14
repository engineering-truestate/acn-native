import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Dimensions,
  Pressable,
  Modal,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ShareModal from '../../components/ShareModal';
import MonthFilterDropdown from '../../components/MonthFilterDropdown';
import PropertyDetailsScreen from '../../components/property/PropertyDetailsScreen';
import { doc, getDoc, DocumentData, DocumentReference } from "firebase/firestore";
import { db } from "../../config/firebase"; // adjust the path to your Firebase config
import { styled } from 'nativewind';
import EnquiryCard from '../Enquiries/EnquiryCard';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledPressable = styled(Pressable);
const StyledScrollView = styled(ScrollView);

// Type definitions
interface Property {
  id: string;
  propertyId: string;
  title: string;
  status: string;
  micromarket: string;
  unitType: string;
  totalAskPrice: number;
  sbua: number;
}

interface Requirement {
  id: string;
  title: string;
  status: string;
  budget?: string | number;
  propertyType?: string;
  location?: string;
  bhk?: string;
  area?: string;
}

// Mock data
const MOCK_PROPERTIES = [
  {
    id: '1',
    propertyId: 'PROP001',
    title: 'Luxury Apartment in City Center',
    status: 'Available',
    micromarket: 'Downtown',
    unitType: '3 BHK',
    totalAskPrice: 95,
    sbua: 1200
  },
  {
    id: '2',
    propertyId: 'PROP002',
    title: 'Modern Villa with Garden',
    status: 'Available',
    micromarket: 'Suburbs',
    unitType: '4 BHK',
    totalAskPrice: 185,
    sbua: 2400
  },
  {
    id: '3',
    propertyId: 'PROP003',
    title: 'Office Space in Business District',
    status: 'Sold',
    micromarket: 'Business Park',
    unitType: 'Office',
    totalAskPrice: 150,
    sbua: 1800
  }
];

const MOCK_REQUIREMENTS = [
  {
    id: '346',
    title: 'Check Requirement',
    status: 'Open',
    budget: 'Market Price',
    propertyType: 'Villa',
    location: 'Downtown',
    bhk: '1 BHK',
    area: '999'
  },
  {
    id: '347',
    title: 'Test',
    status: 'Open',
    budget: 'Market Price',
    propertyType: 'Duplex',
    location: 'Suburbs',
    bhk: '',
    area: ''
  }
];

// Property Card Component
const PropertyCard = React.memo(({ property, onStatusChange }: { 
  property: Property, 
  onStatusChange: (id: string, status: string) => void 
}) => {
  // State for share modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // State for property details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Format price display
  const formatPrice = () => {
    if (property.totalAskPrice >= 100) {
      return `₹${(property.totalAskPrice / 100).toFixed(2)} Cr`;
    } else {
      return `₹${property.totalAskPrice} L`;
    }
  };

  // Mock data for demonstration
  const enquiryCount = Math.floor(Math.random() * 5); // Random number between 0-4
  
  // Function to get property status color
  const getStatusColor = () => {
    if (property.status === 'Sold') {
      return '#EC4899'; // pink-500
    } else if (property.status === 'Available') {
      return '#E0F7F4'; // green color
    } else if (property.status === 'Hold') {
      return '#FFEB99'; // light yellow
    } else {
      return '#D1D5DB'; // gray-300
    }
  };

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  
  // Status options for property
  const statusOptions = [
    { label: 'Available', color: '#153E3B' },
    { label: 'Hold', color: '#FFEB99' },
    { label: 'Sold', color: '#EC4899' }
  ];

  const handleStatusSelect = (status: string) => {
    onStatusChange(property.id, status);
    setIsStatusOpen(false);
  };

  const handleStatusPress = () => {
    setIsStatusOpen(!isStatusOpen);
  };

  // Handle share button press
  const handleSharePress = (e: any) => {
    e.stopPropagation(); // Prevent opening property details
    setIsShareModalOpen(true);
  };

  // Mock agent data for share modal
  const agentData = {
    name: "Agent Name",
    phonenumber: "+91 9876543210",
    email: "agent@example.com"
  };

  // Prepare share property data
  const shareProperty = {
    ...property,
    propertyId: property.propertyId,
    title: property.title,
    totalAskPrice: property.totalAskPrice,
    sbua: property.sbua,
    micromarket: property.micromarket
  };

  // Format the property data to match the PropertyDetailsScreen expected format
  const propertyDetailsData = {
    propertyId: property.propertyId,
    title: property.title,
    nameOfTheProperty: property.title,
    micromarket: property.micromarket,
    unitType: property.unitType,
    totalAskPrice: property.totalAskPrice,
    sbua: property.sbua,
    // Add other required properties with default values as needed
    assetType: 'Residential',
    photo: []
  };

  return (
    <StyledView className="mb-4 rounded-lg bg-white border border-gray-200 overflow-hidden">
      {/* Share Modal */}
      <ShareModal 
        visible={isShareModalOpen}
        property={shareProperty}
        agentData={agentData}
        setProfileModalOpen={setIsShareModalOpen}
      />
      
      {/* Property Details Modal */}
      {isDetailsModalOpen && (
        <PropertyDetailsScreen
          property={propertyDetailsData}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
      
      {/* Clickable Card */}
      <StyledTouchableOpacity 
        activeOpacity={0.7}
        onPress={() => setIsDetailsModalOpen(true)}
      >
        {/* Top Content Section */}
        <StyledView className="p-4">
          {/* Header section with Property ID and MicroMarket */}
          <StyledView className="flex flex-row justify-between items-center">
            {/* Property ID */}
            <StyledView>
              <StyledText className="text-xs text-gray-500 font-semibold border-b border-gray-200">
                {property.propertyId}
              </StyledText>
            </StyledView>
            
            {/* Micromarket and Share */}
            <StyledView className="flex flex-row items-center">
              <StyledView className="flex flex-row items-center bg-gray-500 px-3 py-1 rounded-full">
                <MaterialCommunityIcons name="map-marker" size={14} color="#FAFBFC" />
                <StyledText className="text-white text-xs ml-1">
                  {property.micromarket || "-"}
                </StyledText>
              </StyledView>
              
              {/* Share icon */}
              <StyledTouchableOpacity 
                className="ml-2 p-1 bg-[#153E3B] rounded-full h-7 w-7 items-center justify-center" 
                onPress={handleSharePress}
              >
                <MaterialCommunityIcons name="share-variant" size={14} color="#FFFFFF" />
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>

          {/* Property Name */}
          <StyledText className="text-base font-bold text-black mt-2 mb-4">
            {property.title}
          </StyledText>

          {/* Tags section for Asset Type, Unit Type, and Facing */}
          <StyledView className="flex flex-row flex-wrap gap-2 px-0 mb-3">
            {property.unitType && (
              <StyledView className="bg-gray-100 rounded-full px-3 py-1">
                <StyledText className="text-xs text-gray-700">
                  {property.unitType}
                </StyledText>
              </StyledView>
            )}
          </StyledView>

          {/* Price and SBUA (Super Built-Up Area) section */}
          <StyledView className="flex flex-row justify-between items-center border-t border-gray-200 pt-3 px-0 mb-0">
            {/* Total Ask Price */}
            <StyledView className="flex-1">
              <StyledText className="text-xs text-gray-500">Total Ask Price:</StyledText>
              <StyledText className="text-sm font-semibold">
                {formatPrice()}
              </StyledText>
            </StyledView>
            
            {/* SBUA */}
            <StyledView className="flex-1">
              <StyledText className="text-xs text-gray-500">SBUA:</StyledText>
              <StyledText className="text-sm font-semibold">
                {property.sbua ? `${property.sbua} Sq Ft` : "-"}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Bottom Status Section */}
        <StyledView className="flex flex-row justify-between items-center p-4 bg-gray-50">
          {/* Enquiries */}
          <StyledView>
            <StyledText className="text-sm text-black font-semibold">Enquiries Received:</StyledText>
            <StyledText className="text-sm font-semibold text-black mt-1">{enquiryCount} Enquiry</StyledText>
          </StyledView>

          {/* Status Selector */}
          <StyledView className="relative">
            <StyledTouchableOpacity 
              className="flex flex-row items-center justify-center p-2 px-3 rounded min-w-[100px]"
              style={{backgroundColor: getStatusColor()}}
              onPress={(e) => {
                e.stopPropagation(); // Prevent opening property details
                handleStatusPress();
              }}
            >
              <StyledView className="flex flex-row items-center">
                <StyledText style={{color: 'black'}} className="text-sm font-medium mr-1">
                  {property.status}
                </StyledText>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </StyledView>
            </StyledTouchableOpacity>
            
            {isStatusOpen && (
              <StyledView className="absolute right-0 top-[-120px] bg-white rounded-md border border-gray-200 shadow-sm z-10 min-w-[100px]">
                {statusOptions.map((option) => (
                  <StyledPressable 
                    key={option.label}
                    onPress={(e) => {
                      e.stopPropagation(); // Prevent opening property details
                      handleStatusSelect(option.label);
                    }} 
                    className="p-3 border-b border-gray-100"
                  >
                    <StyledText style={{color: option.color}} className="font-medium">
                      {option.label}
                    </StyledText>
                  </StyledPressable>
                ))}
              </StyledView>
            )}
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledView>
  );
});

// Requirement Card Component
const RequirementCard = React.memo(({ requirement, onStatusChange }: { 
  requirement: Requirement, 
  onStatusChange: (id: string, status: string) => void 
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  // Add state for details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Status options and their colors
  const statusOptions = [
    { label: 'Open', color: '#153E3B' },
    { label: 'Closed', color: 'red' },
  ];
  
  // Find current status color
  const currentStatus = statusOptions.find(option => option.label === requirement.status) || statusOptions[0];

  const handleStatusSelect = (status: string) => {
    onStatusChange(requirement.id, status);
    setIsStatusOpen(false);
  };

  const handleStatusPress = (e: any) => {
    e.stopPropagation(); // Prevent opening details modal
    setIsStatusOpen(!isStatusOpen);
  };
  
  // Handler for card press
  const handleCardPress = () => {
    // Show details modal
    setIsDetailsModalOpen(true);
  };

  // Create requirement details object
  const requirementDetailsData = {
    requirementId: `RQA${requirement.id}`,
    propertyName: requirement.title,
    assetType: requirement.propertyType || 'Villa',
    configuration: requirement.bhk || '',
    area: requirement.area ? parseInt(requirement.area) : undefined,
    budget: typeof requirement.budget === 'string' ? 0 : requirement.budget,
    marketValue: typeof requirement.budget === 'string' ? requirement.budget : undefined,
    requirementDetails: requirement.location || 'No additional details provided.',
    status: requirement.status
  };

  return (
    <>
      <StyledTouchableOpacity 
        className="mb-4 rounded-lg bg-white border border-gray-200"
        activeOpacity={0.7}
        onPress={handleCardPress}
      >
        {/* Top section with ID */}
        <StyledView className="p-4 pb-2">
          <StyledView className="border-b border-gray-200 pb-1 mb-3 w-fit">
            <StyledText className="text-sm text-gray-600 font-semibold">
              {`RQA${requirement.id}`}
            </StyledText>
          </StyledView>
          
          {/* Requirement Title */}
          <StyledText className="text-lg font-bold text-black mb-4">
            {requirement.title}
          </StyledText>

          {/* Budget */}
          <StyledView className="flex flex-row items-center mb-2">
            <StyledView className="mr-2">
              <Ionicons name="cash-outline" size={20} color="#4B5563" />
            </StyledView>
            <StyledText className="text-base text-gray-700">
              {typeof requirement.budget === 'string' ? requirement.budget : `₹${requirement.budget} Cr`}
            </StyledText>
          </StyledView>
          
          {/* Property Type */}
          <StyledView className="flex flex-row items-center">
            <StyledView className="mr-2">
              <Ionicons name="home-outline" size={20} color="#4B5563" />
            </StyledView>
            <StyledText className="text-base text-gray-700">
              {requirement.propertyType || 'Villa'} 
              {requirement.bhk && requirement.area ? ` - ${requirement.bhk} / ${requirement.area} sqft` : ''}
            </StyledText>
          </StyledView>

          {/* Requirement details if available */}
          {requirement.location && (
            <StyledText className="text-base text-gray-700 mt-2">
              {requirement.location}
            </StyledText>
          )}
        </StyledView>

        {/* Bottom section with status */}
        <StyledView className="px-4 py-4">
          <StyledView className="flex flex-row justify-between items-center bg-gray-50 p-3 rounded-md">
            <StyledText className="text-base font-medium text-gray-700">
              Requirement Status :
            </StyledText>

            <StyledView className="relative">
              <StyledTouchableOpacity 
                className={`flex flex-row items-center justify-center p-2 px-4 rounded-md ${requirement.status === 'Closed' ? 'bg-red-100' : 'bg-[#E0F7F4]'}`}
                onPress={handleStatusPress}
              >
                <StyledView className="flex flex-row items-center">
                  <StyledText className={`text-base font-medium ${requirement.status === 'Closed' ? 'text-red-600' : 'text-[#153E3B]'} mr-1`}>
                    {requirement.status}
                  </StyledText>
                  <Ionicons name="chevron-down" size={16} color={requirement.status === 'Closed' ? "#FF0000" : "#153E3B"} />
                </StyledView>
              </StyledTouchableOpacity>

              {isStatusOpen && (
                <StyledView className="absolute right-0 top-0 bg-white rounded-md border border-gray-200 shadow-sm z-10 min-w-[100px]">
                  {statusOptions.map((option) => (
                    <StyledPressable 
                      key={option.label}
                      onPress={(e) => {
                        e.stopPropagation(); // Prevent opening details
                        handleStatusSelect(option.label);
                      }} 
                      className="p-3 border-b border-gray-100"
                    >
                      <StyledText style={{color: option.color}} className="font-medium">
                        {option.label}
                      </StyledText>
                    </StyledPressable>
                  ))}
                </StyledView>
              )}
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>

      {/* Requirement Details Modal */}
      {isDetailsModalOpen && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setIsDetailsModalOpen(false)}
        >
          <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header Section */}
            <StyledView className="bg-white px-4 py-3 border-b border-gray-200 flex-row justify-between items-center">
              <StyledView>
                <StyledView className="border-b border-gray-200 pb-1 mb-1 w-fit">
                  <StyledText className="text-sm text-gray-600 font-semibold">
                    {`RQA${requirement.id}`}
                  </StyledText>
                </StyledView>
                <StyledText className="text-lg font-bold text-black">
                  {requirement.title}
                </StyledText>
              </StyledView>
              <StyledTouchableOpacity
                onPress={() => setIsDetailsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              >
                <Ionicons name="close" size={24} color="#374151" />
              </StyledTouchableOpacity>
            </StyledView>

            {/* Details Content */}
            <StyledScrollView className="flex-1 p-4">
              {/* Basic Information */}
              <StyledView className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                <StyledText className="text-lg font-semibold mb-3">Basic Information</StyledText>
                
                <StyledView className="flex-row justify-between py-2 border-b border-gray-100">
                  <StyledText className="text-gray-600">Property Type</StyledText>
                  <StyledText className="text-black font-medium">{requirement.propertyType || 'Villa'}</StyledText>
                </StyledView>
                
                {requirement.bhk && (
                  <StyledView className="flex-row justify-between py-2 border-b border-gray-100">
                    <StyledText className="text-gray-600">Configuration</StyledText>
                    <StyledText className="text-black font-medium">{requirement.bhk}</StyledText>
                  </StyledView>
                )}
                
                {requirement.area && (
                  <StyledView className="flex-row justify-between py-2 border-b border-gray-100">
                    <StyledText className="text-gray-600">Area</StyledText>
                    <StyledText className="text-black font-medium">{requirement.area} sqft</StyledText>
                  </StyledView>
                )}
                
                <StyledView className="flex-row justify-between py-2 border-b border-gray-100">
                  <StyledText className="text-gray-600">Budget</StyledText>
                  <StyledText className="text-black font-medium">
                    {typeof requirement.budget === 'string' ? requirement.budget : `₹${requirement.budget} Cr`}
                  </StyledText>
                </StyledView>
                
                <StyledView className="flex-row justify-between py-2">
                  <StyledText className="text-gray-600">Status</StyledText>
                  <StyledText 
                    className={`font-medium ${requirement.status === 'Closed' ? 'text-red-600' : 'text-[#153E3B]'}`}
                  >
                    {requirement.status}
                  </StyledText>
                </StyledView>
              </StyledView>
              
              {/* Additional Details */}
              {requirement.location && (
                <StyledView className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                  <StyledText className="text-lg font-semibold mb-3">Additional Details</StyledText>
                  <StyledText className="text-black">{requirement.location}</StyledText>
                </StyledView>
              )}
            </StyledScrollView>
            
            {/* Footer */}
            <StyledView className="bg-white p-4 border-t border-gray-200">
              <StyledTouchableOpacity 
                className="bg-[#153E3B] py-3 rounded-lg items-center"
                onPress={() => setIsDetailsModalOpen(false)}
              >
                <StyledText className="text-white font-semibold">Submit Matching inventories</StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
});

interface Enquiry {
  id: string;
  added?: number;
  cpId?: string;
  enquiryId?: string;
  lastModified?: number;
  propertyId?: string;
  status?: string;
  [key: string]: any; // for additional dynamic fields
}

type DashboardProps = {
  myEnquiries: Enquiry[];
};

export default function Dashboard({ myEnquiries }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('inventories');
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [requirements, setRequirements] = useState(MOCK_REQUIREMENTS);
  const [propertyMonthFilter, setPropertyMonthFilter] = useState("");
  const [requirementMonthFilter, setRequirementMonthFilter] = useState("");
  
  // Month filter options
  const monthOptions = [
    { label: "All", value: "" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 60 days", value: "60" },
    { label: "Last 90 days", value: "90" }
  ];
  
  // Use useCallback to prevent recreation of handler functions on each render
  const handlePropertyStatusChange = useCallback((id: string, status: string) => {
    setProperties(prevProperties =>
      prevProperties.map(property => 
        property.id === id ? { ...property, status } : property
      )
    );
  }, []);
  
  const handleRequirementStatusChange = useCallback((id: string, status: string) => {
    setRequirements(prevRequirements =>
      prevRequirements.map(requirement => 
        requirement.id === id ? { ...requirement, status } : requirement
      )
    );
  }, []);

  // Use useCallback for tab change to prevent re-creation on each render
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Memoize the tab rendering to prevent unnecessary re-renders
  const renderTabContent = useMemo(() => {
    if (activeTab === 'inventories') {
      return (
        <StyledView className="flex-1 p-4">
          <StyledView className="mb-4">
            <MonthFilterDropdown 
              options={monthOptions}
              value={propertyMonthFilter}
              setValue={setPropertyMonthFilter}
            />
          </StyledView>
          
          {properties.length === 0 ? (
            <StyledView className="flex-1 items-center justify-center">
              <StyledText className="text-gray-500 text-base">No properties found</StyledText>
            </StyledView>
          ) : (
            properties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onStatusChange={handlePropertyStatusChange}
              />
            ))
          )}
        </StyledView>
      );
    } else if (activeTab === 'requirements') {
      return (
        <StyledView className="flex-1 p-4">
          <StyledView className="mb-4">
            <MonthFilterDropdown 
              options={monthOptions}
              value={requirementMonthFilter}
              setValue={setRequirementMonthFilter}
            />
          </StyledView>
          
          {requirements.length === 0 ? (
            <StyledView className="flex-1 items-center justify-center">
              <StyledTouchableOpacity className="flex-row items-center justify-center bg-[#153E3B] py-3 px-4 rounded-lg mb-4">
                <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
                <StyledText className="text-base font-medium text-white ml-2">Add Requirement</StyledText>
              </StyledTouchableOpacity>
              <StyledText className="text-gray-500 text-base mt-4">No requirements found</StyledText>
            </StyledView>
          ) : (
            requirements.map(requirement => (
              <RequirementCard 
                key={requirement.id} 
                requirement={requirement} 
                onStatusChange={handleRequirementStatusChange}
              />
            ))
          )}
        </StyledView>
      );
    } else {
      return (
        <StyledView className="flex-1 p-4 ">
          <StyledView className="mb-3">
            <MonthFilterDropdown 
              options={monthOptions}
              value={propertyMonthFilter}
              setValue={setPropertyMonthFilter}
            />
          </StyledView>
          
          {myEnquiries.length === 0 ? (
            <StyledView className="flex-1 items-center justify-center">
              <StyledText className="text-gray-500 text-base">No Enquiries found</StyledText>
            </StyledView>
          ) : (
            <View className='mr-4'>
              { myEnquiries.map((enquiry,index) => (
                <EnquiryCard
                  key={enquiry.id}
                  index={index}
                  enquiry={enquiry}
                  // handleGiveReview={()=>{console.log("Review")}}
                />
              ))}
            </View>
          )}
        </StyledView>
      );
    }
  }, [activeTab, properties, requirements, handlePropertyStatusChange, handleRequirementStatusChange, propertyMonthFilter, requirementMonthFilter, monthOptions]);

  

  return (
    <StyledView className="flex-1 bg-gray-50">
      <StatusBar style="auto" />
      
      {/* Tab Header */}
      <StyledView className="flex-row bg-white border-b border-gray-200">
        {/* Inventories Tab */}
        <StyledTouchableOpacity
          className={`flex-1 p-3 ${activeTab === 'inventories' ? 'bg-[#153E3B]' : 'bg-white'}`}
          onPress={() => handleTabChange('inventories')}
        >
          <StyledView className="items-center">
            <MaterialCommunityIcons 
              size={28} 
              name="home" 
              color={activeTab === 'inventories' ? '#FFFFFF' : '#000000'} 
            />
            <StyledView className="items-center">
              <StyledText className={`text-sm font-medium ${activeTab === 'inventories' ? 'text-white' : 'text-gray-800'}`}>
                My Inventories
              </StyledText>
              <StyledText className={`text-xl font-bold ${activeTab === 'inventories' ? 'text-white' : 'text-gray-800'}`}>
                {properties.length}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledTouchableOpacity>

        {/* Requirements Tab */}
        <StyledTouchableOpacity
          className={`flex-1 p-3 ${activeTab === 'requirements' ? 'bg-[#153E3B]' : 'bg-white'}`}
          onPress={() => handleTabChange('requirements')}
        >
          <StyledView className="items-center">
            <MaterialCommunityIcons 
              size={28} 
              name="file-document" 
              color={activeTab === 'requirements' ? '#FFFFFF' : '#000000'} 
            />
            <StyledView className="items-center">
              <StyledText className={`text-sm font-medium ${activeTab === 'requirements' ? 'text-white' : 'text-gray-800'}`}>
                My Requirements
              </StyledText>
              <StyledText className={`text-xl font-bold ${activeTab === 'requirements' ? 'text-white' : 'text-gray-800'}`}>
                {requirements.length}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledTouchableOpacity>

        {/* Enquiries Tab */}
        <StyledTouchableOpacity
          className={`flex-1 p-3 ${activeTab === 'enquiries' ? 'bg-[#153E3B]' : 'bg-white'}`}
          onPress={() => {handleTabChange('enquiries');}}
          
        >
          <StyledView className="items-center">
            <MaterialCommunityIcons 
              size={28} 
              name="email" 
              color={activeTab === 'enquiries' ? '#FFFFFF' : '#000000'} 
            />
            <StyledView className="items-center">
              <StyledText className={`text-sm font-medium ${activeTab === 'enquiries' ? 'text-white' : 'text-gray-800'}`}>
                My Enquiries
              </StyledText>
              <StyledText className={`text-xl font-bold ${activeTab === 'enquiries' ? 'text-white' : 'text-gray-800'}`}>
                {myEnquiries.length}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
      
      {/* Content Area */}
      <StyledScrollView className="flex-1">
        <StyledView className="flex-1">
          {renderTabContent}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
} 