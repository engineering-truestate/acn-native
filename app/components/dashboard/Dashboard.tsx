import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Linking
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
    <StyledView className={`mb-4 rounded-lg bg-white border border-gray-200 overflow-visible`} style={{ zIndex: 99999 - index }}>
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
                <StyledView className="bg-gray-100 rounded-full px-3 py-1">
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
  propertyStatusUpdate: Function
};

export default function Dashboard({ myEnquiries, myProperties, myRequirements, propertyStatusUpdate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('inventories');
  const [properties, setProperties] = useState<Property[] | []>([]);
  const [requirements, setRequirements] = useState<Requirement[] | []>([]);
  const [enquiries, setEnquiries] = useState<EnquiryWithProperty[] | []>([]);
  const [propertyMonthFilter, setPropertyMonthFilter] = useState("");
  const [requirementMonthFilter, setRequirementMonthFilter] = useState("");
  const [enquiryMonthFilter, setEnquiryMonthFilter] = useState("");
  const [batchSize, setBatchSize] = useState(15);
  // const [renderingNewBatch, setRenderingNewBatch] = useState(false);
  const isBatchSizePendingLock = useRef(false);

  const scrollViewRef = useRef<ScrollView>(null);

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


  const [selectedPropertyMonth, setSelectedPropertyMonth] = useState("");
  const propertyMonthOptions = generatePropertyMonths(myProperties);

  const [selectedRequirementMonth, setSelectedRequirementMonth] = useState("");
  const requirementMonthOptions = generateRequirementMonths(myRequirements);

  const [selectedEnquiryMonth, setSelectedEnquiryMonth] = useState("");
  const enquiryMonthOptions = generateEnquiryMonths(myEnquiries);

  const renderMore = () => {
    if (isBatchSizePendingLock.current) return;

    if (Math.min(batchSize + 15, tabData?.filter((item) => item.key === activeTab)?.[0]?.count) > batchSize) {
      isBatchSizePendingLock.current = true;
      // setRenderingNewBatch(true);
      setBatchSize((prev) => (Math.min(prev + 15, tabData?.filter((item) => item.key === activeTab)?.[0]?.count)));
    }
  }

  useEffect(() => {
    if (activeTab === 'inventories') {
      if (selectedPropertyMonth === "") {
        setProperties(myProperties);
      }
      else {
        const filteredProps = filterPropertiesByMonth(myProperties, selectedPropertyMonth);
        setProperties(filteredProps);
      }
    } else if (activeTab === 'requirements') {
      if (selectedRequirementMonth === "") {
        setRequirements(myRequirements);
      }
      else {
        const filteredReqs = filterRequirementsByMonth(myRequirements, selectedRequirementMonth);
        setRequirements(filteredReqs);
      }
    } else if (activeTab === 'enquiries') {
      if (selectedEnquiryMonth === "") {
        setEnquiries(myEnquiries);
      }
      else {
        const filteredEnqs = filterEnquiriesByMonth(myEnquiries, selectedEnquiryMonth);
        setEnquiries(filteredEnqs);
      }
    }

  }, [activeTab, selectedPropertyMonth, selectedEnquiryMonth, selectedRequirementMonth])

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
    propertyStatusUpdate(newStatus, id);
    try {
      const propertyRef = collection(db, "ACN123");
      const q = query(propertyRef, where("propertyId", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { status: newStatus });
        console.log("Status updated successfully in Firestore");
      } else {
        console.log("No document found with propertyId:", id);
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
        console.log("Status updated successfully in Firestore");
      } else {
        console.log("No document found with requirementId:", id);
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
        <StyledView className="flex-1 p-4">
          <StyledView className="mb-4">
            <MonthFilterDropdown
              options={propertyMonthOptions}
              value={selectedPropertyMonth}
              setValue={setSelectedPropertyMonth}
            />
          </StyledView>

          {properties.length === 0 ? (
            <EmptyTabContent
              text="No inventory added yet."
              sub_text="Contact your KAM on Whatsapp to add an inventory."
              icon={<FontAwesome name="whatsapp" size={20} color="white" />}
              buttonText="Add Inventory"
              handleOnPress={handleWhatsAppEnquiry}
            />
          ) : (
            properties.slice(0, batchSize).map((property, index) => {
              if (index === batchSize - 1) renderMore();
              return (
                <PropertyCard
                  key={property.propertyId}
                  property={property}
                  onStatusChange={handlePropertyStatusChange}
                  index={index}
                  totalCount={batchSize}
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
              options={requirementMonthOptions}
              value={selectedRequirementMonth}
              setValue={setSelectedRequirementMonth}
            />
          </StyledView>

          {requirements?.length === 0 ? (
            <EmptyTabContent
              text="You haven't added any requirements"
              sub_text="Upload details of property type you need"
              icon={<Ionicons name="document-text-outline" size={20} color="white" />}
              buttonText="Add Requirement"
              handleOnPress={() => router.navigate('/(tabs)/UserRequirementForm')}
            />
          ) : (
            requirements.slice(0, batchSize).map((requirement, index) => {
              if (index === batchSize - 1) renderMore();
              return (
                <RequirementCard
                  key={requirement.id}
                  requirement={requirement}
                  onStatusChange={handleRequirementStatusChange}
                  index={index}
                  totalCount={batchSize}
                />
              )
            })
          )}
        </StyledView>
      );
    } else {
      return (
        <StyledView className="flex-1 p-4 ">
          <StyledView className="mb-3">
            <MonthFilterDropdown
              options={enquiryMonthOptions}
              value={selectedEnquiryMonth}
              setValue={setSelectedEnquiryMonth}
            />
          </StyledView>

          {enquiries.length === 0 ? (
            <EmptyTabContent
              text="No enquiries made yet."
              sub_text="Browse and enquire about available properties."
              icon={<FontAwesome6 name="house" size={20} color="white" />}
              buttonText="Explore Inventories"
              handleOnPress={() => router.push('/(tabs)/properties')}
            />
          ) : (
            <View className='mr-4'>
              {enquiries.slice(0, batchSize).map((enquiry, index) => {
                if (index === batchSize - 1) renderMore();
                return (
                  <EnquiryCard
                    key={enquiry.id}
                    index={index}
                    enquiry={enquiry}
                  // handleGiveReview={()=>{console.log("Review")}}
                  />
                )
              })}
            </View>
          )}
        </StyledView>
      );
    }
  }, [activeTab, properties, requirements, handlePropertyStatusChange, handleRequirementStatusChange, propertyMonthFilter, requirementMonthFilter, enquiryMonthFilter, propertyMonthOptions, requirementMonthOptions, enquiryMonthOptions]);



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

  const handleOnScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isBatchSizePendingLock.current)
      return;
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;

    // Conditions to trigger load more:
    // 1. User has scrolled to the bottom
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - 10000;

    // if (isCloseToBottom) {
    isBatchSizePendingLock.current = true;
    // setRenderingNewBatch(true);
    setBatchSize((prev) => (Math.min(prev + 15, tabData?.filter((item) => item.key === activeTab)?.[0]?.count)));
    // }
  }

  useEffect(() => {
    if (isBatchSizePendingLock.current) {
      // setRenderingNewBatch(false);
      isBatchSizePendingLock.current = false;
      renderMore();
    }
  }, [batchSize])

  useEffect(() => {
    console.log("Changed");
    setSelectedPropertyMonth("");
    setSelectedRequirementMonth("");
    setSelectedEnquiryMonth("");
    setBatchSize(15);
    // setRenderingNewBatch(false);
    isBatchSizePendingLock.current = false;
  }, [activeTab]);

  return (
    <StyledView className="flex bg-gray-50 h-full">
      <StatusBar style="auto" />

      {/* Carousel Tab Header */}
      <TabCarousel
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabData={tabData}
      />

      {/* Content Area */}
      <StyledScrollView
        onScrollBeginDrag={handleOnScroll}
        ref={scrollViewRef}
      >
        {renderTabContent && (
          <StyledView >{renderTabContent}</StyledView>
        )}
      </StyledScrollView>
      {/* {renderingNewBatch && (<View className="absolute bottom-0 flex items-center justify-center w-full">
        <Text style={{
          fontFamily: 'Montserrat_400Regular',
          color: '#6B7280',
          fontSize: 16,
        }}>Loading...</Text>
      </View>)} */}
    </StyledView >

  );
} 