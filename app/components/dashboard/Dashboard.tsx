import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Modal,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MonthFilterDropdown from '../../components/MonthFilterDropdown';
import PropertyDetailsScreen from '../../components/property/PropertyDetailsScreen';
import { styled } from 'nativewind';
import EnquiryCard from '../Enquiries/EnquiryCard';
import TabCarousel from './TabCarousel';
import { Property, Requirement, EnquiryWithProperty, Enquiry } from '@/app/types';
import { formatCost2, toCapitalizedWords } from '@/app/helpers/common';
import DashboardDropdown from './DashboardDropdown';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/app/config/firebase';
import RequirementDetailsModal from '../requirement/RequirementDetailsModal';
import RequirementDetailsScreen from '../requirement/RequirementDetailsScreen';
import ShareModal from '@/app/modals/ShareModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledPressable = styled(Pressable);
const StyledScrollView = styled(ScrollView);

const PropertyCard = React.memo(({ property, onStatusChange, matchingEnquiriesCount}: {
  property: Property,
  onStatusChange: (id: string, status: string) => void,
  matchingEnquiriesCount: number,
}) => {
  // State for share modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // State for property details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);


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
    onStatusChange(property.propertyId, status);
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
  const agentData = useSelector((state: RootState) => state.agent.docData);

  // Prepare share property data
  const shareProperty = {
    ...property,
    propertyId: property.propertyId,
    totalAskPrice: property.totalAskPrice,
    sbua: property.sbua,
    micromarket: property.micromarket
  };

  // Format the property data to match the PropertyDetailsScreen expected format
  const propertyDetailsData = {
    propertyId: property.propertyId,
    nameOfTheProperty: property.nameOfTheProperty,
    micromarket: property.micromarket,
    unitType: property.unitType,
    totalAskPrice: property.totalAskPrice,
    sbua: property.sbua,
    // Add other required properties with default values as needed
    assetType: property.assetType,
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
          property={property}
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
            {property.nameOfTheProperty}
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
                {formatCost2(property.totalAskPrice || null)}
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
            <StyledText className="text-sm font-semibold text-black mt-1">{matchingEnquiriesCount} Enquiry</StyledText>
          </StyledView>

          {/* Status Selector */}
          <StyledView className="relative">
            <StyledTouchableOpacity
              className="flex flex-row items-center justify-center p-2 px-3 rounded min-w-[100px]"
              style={{ backgroundColor: getStatusColor() }}
              onPress={(e) => {
                e.stopPropagation(); // Prevent opening property details
                handleStatusPress();
              }}
            >
              <StyledView className="flex flex-row items-center">
                <StyledText style={{ color: 'black' }} className="text-sm font-medium mr-1">
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
                    <StyledText style={{ color: option.color }} className="font-medium">
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

const RequirementCard = React.memo(({ requirement, onStatusChange }: {
  requirement: Requirement,
  onStatusChange: (id: string, status: string) => void
}) => {

  console.log("requirement", requirement);
  // Add state for details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Status options and their colors
  const statusOptions = [
    { label: 'Open', color: '#153E3B' },
    { label: 'Closed', color: 'red' },
  ];

  // Find current status color
  const currentStatus = statusOptions.find(option => option.label === requirement.status) || statusOptions[0];

  // Handler for card press
  const handleCardPress = () => {
    // Show details modal
    setIsDetailsModalOpen(true);
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
              {`${requirement.requirementId}`}
            </StyledText>
          </StyledView>

          {/* Requirement Title */}
          <StyledText className="text-lg font-bold text-black mb-4">
            {requirement.propertyName}
          </StyledText>

          {/* Budget */}
          <StyledView className="flex flex-row items-center mb-2">
            <StyledView className="mr-2">
              <Ionicons name="cash-outline" size={20} color="#4B5563" />
            </StyledView>
            <StyledText className="text-base text-gray-700">
              {requirement.marketValue === "Market Value"
                ? "Market Price"
                : requirement.budget?.from === 0
                  ? `₹${requirement.budget?.to || 0} Cr`
                  : requirement.budget?.from === requirement.budget?.to
                    ? `₹${requirement.budget?.to || 0}`
                    : `₹${requirement.budget?.from || 0} Cr - ₹${requirement.budget?.to || 0
                    } Cr`}
            </StyledText>
          </StyledView>

          {/* Property Type */}
          <StyledView className="flex flex-row items-center">
            <StyledView className="mr-2">
              <Ionicons name="home-outline" size={20} color="#4B5563" />
            </StyledView>
            <StyledText className="text-base text-gray-700">
              {toCapitalizedWords(requirement.assetType)}
              {requirement.configuration
                ? ` - ${requirement.configuration}`
                : requirement.area
                  ? ` - ${requirement.area} sqft`
                  : ""}
              {requirement.configuration && requirement.area
                ? ` / ${requirement.area} sqft`
                : ""}
            </StyledText>
          </StyledView>

          {/* Requirement details if available */}
          {requirement.requirementDetails && (
            <StyledText className="text-base text-gray-700 mt-2">
              {requirement.requirementDetails}
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

              <DashboardDropdown
                value={requirement.status}
                options={[
                  { label: "Open", value: "Pending" },
                  { label: "Closed", value: "Closed" },
                ]}
                setValue={(val) => onStatusChange(requirement.requirementId, val)}
                type={"requirement"}
              />
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>


      {/* Requirement Details Modal */}
      <RequirementDetailsScreen
        requirement={requirement}
        onClose={() => setIsDetailsModalOpen(false)}
        visible={isDetailsModalOpen}

      />
    </>
  );
});

type DashboardProps = {
  myEnquiries: EnquiryWithProperty[];
  myProperties: Property[];
  myRequirements: Requirement[];
  allEnquiries: Enquiry[];
};

export default function Dashboard({ myEnquiries, myProperties, myRequirements, allEnquiries }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('inventories');
  const [properties, setProperties] = useState<Property[] | []>([]);
  const [requirements, setRequirements] = useState<Requirement[] | []>([]);
  const [enquiries, setEnquiries] = useState<EnquiryWithProperty[] | []>([]);
  const [propertyMonthFilter, setPropertyMonthFilter] = useState("");
  const [requirementMonthFilter, setRequirementMonthFilter] = useState("");
  const [enquiryMonthFilter, setEnquiryMonthFilter] = useState("");

  useEffect(() => {
    if (myProperties) {
      setProperties(myProperties);
    }
    if (myRequirements) {
      setRequirements(myRequirements);
    }
    if (myEnquiries) {
      setEnquiries(myEnquiries);
    }
  }, [myProperties, myRequirements, myEnquiries])

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
        property.propertyId === id ? { ...property, status } : property
      )
    );
  }, []);

  const handleRequirementStatusChange = useCallback(async (id: string, status: string) => {
    const newStatus = status;
    setRequirements((prevRequirements) =>
      prevRequirements.map((requirement) =>
        requirement.requirementId === id
          ? { ...requirement, status: newStatus }
          : requirement
      )
    );

    try {
      const requirementsRef = collection(db, "requirements");
      const q = query(requirementsRef, where("requirementId", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { status: newStatus });
        console.log("Status updated successfully in Firestore");
      } else {
        console.log("No document found with requirementId:", id);
      }
    } catch (error) {
      console.error("Error updating status in Firestore:", error);
    }
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
            properties.map(property => {
              const matchingEnquiriesCount: number = allEnquiries.filter(
                (enquiry) => enquiry.propertyId === property.propertyId
              ).length;

              return (
                <PropertyCard
                  key={property.propertyId}
                  property={property}
                  onStatusChange={handlePropertyStatusChange}
                  matchingEnquiriesCount={matchingEnquiriesCount}
                />
              );
            })
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

          {requirements?.length === 0 ? (
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
              value={enquiryMonthFilter}
              setValue={setEnquiryMonthFilter}
            />
          </StyledView>

          {enquiries.length === 0 ? (
            <StyledView className="flex-1 items-center justify-center">
              <StyledText className="text-gray-500 text-base">No Enquiries found</StyledText>
            </StyledView>
          ) : (
            <View className='mr-4'>
              {enquiries.map((enquiry, index) => (
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
  }, [activeTab, properties, requirements, handlePropertyStatusChange, handleRequirementStatusChange, propertyMonthFilter, requirementMonthFilter, enquiryMonthFilter, monthOptions]);



  const tabData = [
    {
      key: "inventories",
      label: "My Inventories",
      icon: "home",
      count: myProperties.length,
    },
    {
      key: "requirements",
      label: "My Requirements",
      icon: "layers",
      count: myRequirements.length,
    },
    {
      key: "enquiries",
      label: "My Enquiries",
      icon: "email",
      count: myEnquiries.length,
    },
  ];

  return (
    <StyledView className="flex-1 bg-gray-50">
      <StatusBar style="auto" />

      {/* Carousel Tab Header */}
      <TabCarousel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabData={tabData}
      />

      {/* Content Area */}
      <StyledScrollView>
        {renderTabContent && (
          <StyledView >{renderTabContent}</StyledView>
        )}
      </StyledScrollView>
    </StyledView>

  );
} 