import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Linking,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import MonthFilterDropdown from '../../components/MonthFilterDropdown';
import PropertyDetailsScreen from '../../components/property/PropertyDetailsScreen';
import { styled } from 'nativewind';
import EnquiryCard from '../Enquiries/EnquiryCard';
import TabCarousel from './TabCarousel';
import { Property, Requirement, EnquiryWithProperty, Enquiry } from '@/app/types';
import { formatCost2, toCapitalizedWords } from '@/app/helpers/common';
import DashboardDropdown from './DashboardDropdown';
import { collection, getCountFromServer, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/app/config/firebase';
import RequirementDetailsModal from '../requirement/RequirementDetailsModal';
import RequirementDetailsScreen from '../requirement/RequirementDetailsScreen';
import ShareModal from '@/app/modals/ShareModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { generatePropertyMonths, filterPropertiesByMonth, generateRequirementMonths, filterRequirementsByMonth, generateEnquiryMonths, filterEnquiriesByMonth } from '../../helpers/dashboardMonthFiltersHelper';
import { router } from 'expo-router';
import EmptyTabContent from './EmptyTabContent';
import { selectKamNumber } from '@/store/slices/kamSlice';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledPressable = styled(Pressable);
const StyledScrollView = styled(ScrollView);

const PropertyCard = React.memo(({ property, onStatusChange, index, totalCount }: {
  property: Property,
  onStatusChange: (id: string, status: string) => void,
  index: number,
  totalCount: number
}) => {
  // State for share modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  // State for property details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [matchingEnquiriesCount, setMatchingEnquiriesCount] = useState("-");


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

  const fetchMatchingEnquiryCount = async () => {
    const count = await getCountFromServer(query(collection(db, 'enquiries'), where("propertyId", "==", property.propertyId)));
    setMatchingEnquiriesCount(count.data().count.toString());
  }

  useEffect(() => {
    fetchMatchingEnquiryCount();
  }, [])
  return (
    <StyledView key={property.propertyId} className={`mb-4 rounded-lg bg-white border border-gray-200 overflow-visible`} style={{ zIndex: 99999 - index }}>
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
            {[property.assetType, property.unitType, property.facing]
              .filter(Boolean)
              .map((tag, index) => (
                <StyledView className="bg-gray-100 rounded-full px-3 py-1" key={index}>
                  <StyledText className="text-xs text-gray-700">
                    {tag}
                  </StyledText>
                </StyledView>
              ))}
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
            <StyledText className="text-sm font-semibold text-black mt-1">{matchingEnquiriesCount ?? "-"} Enquiry</StyledText>
          </StyledView>

          {/* Status Selector */}
          <StyledView className={`relative overflow-visible`}>
            <DashboardDropdown
              value={property.status || "Available"}
              setValue={(val) => onStatusChange(property.propertyId, val)}
              options={[
                { label: "Available", value: "Available" },
                { label: "Hold", value: "Hold" },
                { label: "Sold", value: "Sold" }
              ]}
              type={"inventory"}
              openDropdownUp={index === totalCount - 1 && totalCount > 1}
            />
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledView>
  );
});

const RequirementCard = React.memo(({ requirement, onStatusChange, index, totalCount }: {
  requirement: Requirement,
  onStatusChange: (id: string, status: string) => void
  index: number,
  totalCount: number
}) => {

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
        className="mb-4 rounded-lg bg-white border border-gray-200 overflow-visible"
        activeOpacity={0.7}
        onPress={handleCardPress}
        style={{ zIndex: 99999 - index }}
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
                setValue={(val) => onStatusChange(requirement.requirementId || "", val)}
                type={"requirement"}
                openDropdownUp={index === (totalCount - 1) && totalCount > 1}
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
  propertyStatusUpdate: Function;
  hanldeRequirementsStatusChange: Function;
  loading: { enquiriesLoading: boolean, propertiesLoading: boolean, requirementsLoading: boolean }
};

export default function Dashboard({ myEnquiries, myProperties, myRequirements, propertyStatusUpdate, loading, hanldeRequirementsStatusChange }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('inventories');
  const [properties, setProperties] = useState<Property[] | []>([]);
  const [requirements, setRequirements] = useState<Requirement[] | []>([]);
  const [enquiries, setEnquiries] = useState<EnquiryWithProperty[] | []>([]);
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [monthFilterOptions, setMonthFilterOptions] = useState<Array<{ label: string, value: any }>>([]);
  const [batchSize, setBatchSize] = useState(10);
  const [bufferring, setBuffering] = useState(false);
  const [renderingNewBatch, setRenderingNewBatch] = useState(false);

  const isBatchSizePendingLock = useRef(false);
  const propertyMonthOptions = useRef(generatePropertyMonths(myProperties));
  const requirementMonthOptions = useRef(generateRequirementMonths(myRequirements));
  const enquiryMonthOptions = useRef(generateEnquiryMonths(myEnquiries));
  const initalLoad = useRef(true);

  const renderMore = () => {
    if (isBatchSizePendingLock.current) return;
    let totalCount = 0;
    switch (activeTab) {
      case "inventories":
        totalCount = properties.length;
        break;
      case "requirements":
        totalCount = requirements.length;
        break;
      case "enquiries":
        totalCount = enquiries.length;
        break;
      default:
        break;
    }
    if (Math.min(batchSize + 10, totalCount) > batchSize) {
      isBatchSizePendingLock.current = true;
      setRenderingNewBatch(true);
      setBatchSize((prev) => (Math.min(prev + 10, totalCount)));
    }
  }

  // Use useCallback to prevent recreation of handler functions on each render
  const handlePropertyStatusChange = useCallback(async (id: string, status: string) => {
    const newStatus = status;
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.propertyId === id
          ? { ...property, status: newStatus }
          : property
      )
    );
    try {
      const propertyRef = collection(db, "ACN123");
      const q = query(propertyRef, where("propertyId", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { status: newStatus });
        propertyStatusUpdate(newStatus, id);
      }
    } catch (error) {
      console.error("Error updating status in Firestore:", error);
    }
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
        hanldeRequirementsStatusChange(newStatus, id);
      }
    } catch (error) {
      console.error("Error updating status in Firestore:", error);
    }
  }, []);

  const kam_number = useSelector(selectKamNumber);

  const handleWhatsAppEnquiry = (): void => {
    if (!kam_number) return;
    Linking.openURL(`whatsapp://send?phone=${kam_number}`)
  };

  // Memoize the tab rendering to prevent unnecessary re-renders
  const renderTabContent = useMemo(() => {
    if (activeTab === 'inventories') {
      return (
        <>
          {properties.length === 0 || bufferring ? (
            <EmptyTabContent
              text="No inventory added yet."
              sub_text="Contact your KAM on Whatsapp to add an inventory."
              icon={<FontAwesome name="whatsapp" size={20} color="white" />}
              buttonText="Add Inventory"
              handleOnPress={handleWhatsAppEnquiry}
              loading={loading?.propertiesLoading || bufferring}
            />
          ) : (
            <View className='mx-3 mb-3'>
              {properties.slice(0, batchSize).map((property, index) => {
                return (
                  <PropertyCard
                    key={property.propertyId}
                    property={property}
                    onStatusChange={handlePropertyStatusChange}
                    index={index}
                    totalCount={Math.min(batchSize, properties.length)}
                  />
                );
              })}
            </View>
          )}
        </>
      );
    } else if (activeTab === 'requirements') {
      return (
        <>
          {requirements?.length === 0 || bufferring ? (
            <EmptyTabContent
              text="You haven't added any requirements"
              sub_text="Upload details of property type you need"
              icon={<Ionicons name="document-text-outline" size={20} color="white" />}
              buttonText="Add Requirement"
              handleOnPress={() => router.navigate('/(tabs)/UserRequirementForm')}
              loading={loading.requirementsLoading || bufferring}
            />
          ) : (
            <View className='mx-3 mb-3'>
              {requirements.slice(0, batchSize).map((requirement, index) => {
                return (
                  <RequirementCard
                    key={requirement.id}
                    requirement={requirement}
                    onStatusChange={handleRequirementStatusChange}
                    index={index}
                    totalCount={Math.min(batchSize, requirements.length)}
                  />
                )
              })}
            </View>
          )}
        </>
      );
    } else {
      return (
        <>
          {enquiries.length === 0 || bufferring ? (
            <EmptyTabContent
              text="No enquiries made yet."
              sub_text="Browse and enquire about available properties."
              icon={<FontAwesome6 name="house" size={20} color="white" />}
              buttonText="Explore Inventories"
              handleOnPress={() => router.push('/(tabs)/properties')}
              loading={loading.enquiriesLoading || bufferring}
            />
          ) : (
            <View className='mx-3 mb-3'>
              {enquiries.slice(0, batchSize).map((enquiry, index) => {
                return (
                  <EnquiryCard
                    key={enquiry.id}
                    index={index}
                    enquiry={enquiry}
                  />
                )
              })}
            </View>
          )}
        </>
      );
    }
  }, [activeTab, properties, requirements, enquiries, bufferring, loading, batchSize, handlePropertyStatusChange, handleRequirementStatusChange]);

  const tabData = [
    {
      key: "inventories",
      label: "My Inventories",
      icon: <MaterialCommunityIcons size={21.33} name={"home"} color={activeTab === "inventories" ? "#FFFFFF" : "#153E3B"} />,
      count: myProperties.length,
      loading: loading.propertiesLoading
    },
    {
      key: "requirements",
      label: "My Requirements",
      icon: <MaterialCommunityIcons size={21.33} name={"layers"} color={activeTab === "requirements" ? "#FFFFFF" : "#153E3B"} />,
      count: myRequirements.length,
      loading: loading.requirementsLoading
    },
    {
      key: "enquiries",
      label: "My Enquiries",
      icon: <MaterialIcons name="checklist" size={21.33} color={activeTab === "enquiries" ? "#FFFFFF" : "#153E3B"} />,
      count: myEnquiries.length,
      loading: loading.enquiriesLoading
    },
  ];

  useEffect(() => {
    if (isBatchSizePendingLock.current) {
      setRenderingNewBatch(false);
      isBatchSizePendingLock.current = false;
    }
  }, [batchSize])

  useEffect(() => {
    setMonthFilter("");
    setBatchSize(10);
    setBuffering(false);
    setRenderingNewBatch(false);
    isBatchSizePendingLock.current = false;
    switch (activeTab) {
      case "inventories":
        setProperties(myProperties);
        propertyMonthOptions.current = generatePropertyMonths(myProperties);
        setMonthFilterOptions(propertyMonthOptions.current);
        break;
      case "requirements":
        setRequirements(myRequirements);
        requirementMonthOptions.current = generateRequirementMonths(myRequirements);
        setMonthFilterOptions(requirementMonthOptions.current);
        break;
      case "enquiries":
        setEnquiries(myEnquiries);
        enquiryMonthOptions.current = generateEnquiryMonths(myEnquiries);
        setMonthFilterOptions(enquiryMonthOptions.current);
        break;
      default:
        break;
    }
    initalLoad.current = false;
  }, [activeTab]);

  useEffect(() => {
    if (myProperties) {
      setProperties(myProperties);
      propertyMonthOptions.current = generatePropertyMonths(myProperties);
      if (activeTab === "inventories")
        setMonthFilterOptions(propertyMonthOptions.current);
    }
  }, [myProperties])

  useEffect(() => {
    if (myRequirements) {
      setRequirements(myRequirements);
      requirementMonthOptions.current = generateRequirementMonths(myRequirements);
      if (activeTab === "requirements")
        setMonthFilterOptions(propertyMonthOptions.current);
    }
  }, [myRequirements])

  useEffect(() => {
    if (myEnquiries) {
      setEnquiries(myEnquiries);
      enquiryMonthOptions.current = generateEnquiryMonths(myEnquiries);
      if (activeTab === "enquiries")
        setMonthFilterOptions(propertyMonthOptions.current);
    }
  }, [myEnquiries])

  useEffect(() => {
    if (initalLoad.current)
      return;
    switch (activeTab) {
      case "inventories":
        setProperties(filterPropertiesByMonth(myProperties, monthFilter));
        break;
      case "requirements":
        setRequirements(filterRequirementsByMonth(myRequirements, monthFilter));
        break;
      case "enquiries":
        setEnquiries(filterEnquiriesByMonth(myEnquiries, monthFilter));
        break;
      default:
        break;
    }
    setBuffering(false);
  }, [monthFilter])

  return (
    <StyledView className="flex bg-gray-50 h-full">
      <StatusBar style="auto" />

      {/* Carousel Tab Header */}
      <TabCarousel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setBuffering={setBuffering}
        initialLoad={initalLoad}
        tabData={tabData}
      />

      <MonthFilterDropdown
        options={monthFilterOptions}
        value={monthFilter}
        setValue={setMonthFilter}
        setBuffering={setBuffering}
        setBatchSize={setBatchSize}
      />

      {/* Content Area */}
      <StyledScrollView>
        {renderTabContent && (
          <StyledView onLayout={renderMore}>{renderTabContent}</StyledView>
        )}
        {renderingNewBatch && (<ActivityIndicator className="absolute bottom-0 w-full" />)}
      </StyledScrollView>
    </StyledView >

  );
} 