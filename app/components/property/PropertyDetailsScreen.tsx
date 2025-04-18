import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, Modal, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ImageCarousel from './ImageCarousel';
import { Enquiry, Property } from '@/app/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { handleIdGeneration } from '@/app/helpers/nextId';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/config/firebase';
import deductMonthlyCredit from '@/app/helpers/deductCredit';
import EnquiryCPModal from '@/app/modals/EnquiryCPModal';
import ConfirmModal from '@/app/modals/ConfirmModal';
import ShareModal from '@/app/modals/ShareModal';
import { showErrorToast, showSuccessToast } from '@/utils/toastUtils';
import { useDispatch } from 'react-redux';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

interface AgentData {
  phonenumber: string;
  [key: string]: any;
}

interface PropertyDetailsScreenProps {
  property: Property;
  onClose: () => void;
  parent?: string;
}

interface IdGenerationResult {
  lastId: string;
  nextId: string;
}

// Helper function to format currency similar to web implementation
const formatCost = (value: number) => {
  if (!value) return "N/A";

  if (value >= 100) {
    return `₹${(value / 100).toFixed(2)} Cr`;
  } else {
    return `₹${value} L`;
  }
};

// Helper function to format date
const formatDate = (timestamp?: number) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Use React.memo to fix the static flag issue
const PropertyDetailsScreen = React.memo(({ property, onClose, parent = "" }: PropertyDetailsScreenProps) => {
  const router = useRouter();
  const agentData = useSelector((state: RootState) => state?.agent?.docData) as AgentData;
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCPID, setSelectedCPID] = useState(property.cpCode);
  const [isConfirmModelOpen, setIsConfirmModelOpen] = useState(false);
  const [isEnquiryModelOpen, setIsEnquiryCPModelOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const phoneNumber = useSelector((state: RootState) => state?.agent?.docData?.phonenumber);
  const monthlyCredits = useSelector((state: RootState) => state?.agent?.docData?.monthlyCredits);

  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const generateNextEnqId = async (): Promise<string | null> => {
    try {
      const type = "lastEnqId"; // Replace with "lastCpId" or others as needed
      const result = await handleIdGeneration(type) as IdGenerationResult;
      return result.nextId;
    } catch (error) {
      console.error("Error generating IDs:", error);
      return null;
    }
  };

  // Get the property name with fallbacks
  const getPropertyName = () => {
    return property.nameOfTheProperty;
  };

  useEffect(() => {
    const photos = property.photo || [];
    const videos = property.video || [];
    setLocalImages([...photos, ...videos]);
  }, [property.photo, property.video]);



  // Update useEffect to handle loading state
  useEffect(() => {
    const initializeContent = async () => {

      try {
        // Initialize images array
        const images = [
          ...(property.photo || []),
          ...(property.video || []),
        ];
        setLocalImages(images);

      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    initializeContent();
  }, [property.photo, property.video]);

  // Dummy handler functions
  const handleOpenGoogleMap = () => {
    if (!property.mapLocation) return;
    Linking.openURL(property.mapLocation)
  };

  const handleOpenDriveDetails = () => {
    if (!property.driveLink) {
      showErrorToast("Drive link not available.");
      return;
    }
    // Implementation would open drive link
    Linking.openURL(property.driveLink);
    showSuccessToast("Opening drive details...");
  };

  const handleEnquireNowBtn = (e: any) => {
    setSelectedCPID(property.cpCode || "")
    if (monthlyCredits > 0) {
      setIsConfirmModelOpen(true);
      return;
    }
    showErrorToast("You don't have enough credits. Please contact your account manager.");
    //Alert.alert("Do not have credits");
  };

  const handleCancel = () => {
    setIsConfirmModelOpen(false)
  };

  const submitEnquiry = async (nextEnqId: string) => {
    const enq: Enquiry = {} as Enquiry;

    try {
      const enquiryDocRef = doc(db, "enquiries", nextEnqId);
      await setDoc(enquiryDocRef, enq);
      showSuccessToast("Enquiry submitted successfully!");
    } catch (error) {
      console.error("Error in enquiry submission:", error);
    }
  };

  const onConfirmEnquiry = async () => {
    if (!selectedCPID) {
      //Alert.alert("Error: Seller CPID is missing. Please try again.");
      showErrorToast("Error: Seller CPID is missing. Please try again.");
      setIsConfirmModelOpen(false);
      return;
    }

    if (!(monthlyCredits > 0)) {
      //Alert.alert("You don't have enough credits. Please contact your account manager.");
      showErrorToast("You don't have enough credits. Please contact your account manager.");
      setIsConfirmModelOpen(false);
      return;
    }

    try {
      const nextEnqId = await generateNextEnqId()
      if (!nextEnqId) {
        // Alert.alert(
        //   "Failed to generate the next Enquiry ID. Please try again later."
        // );
        showErrorToast("Failed to generate the next Enquiry ID. Please try again later.");
        setIsConfirmModelOpen(false);
        return;
      }

      // ✅ Deduct credits first
      await deductMonthlyCredit(phoneNumber, monthlyCredits, dispatch);

      if (typeof nextEnqId === "string") {
        await submitEnquiry(nextEnqId);
      }

      // ✅ Close the confirmation modal
      setIsConfirmModelOpen(false);

      // ✅ Open EnquireCPModal AFTER confirming
      setTimeout(() => {
        setIsEnquiryCPModelOpen(true);
      }, 100);

    } catch (error) {
      console.error("Error during enquiry process:", error);
      // Alert.alert(
      //   "An error occurred while processing your enquiry. Please try again."
      // );
      showErrorToast("An error occurred while processing your enquiry. Please try again.");
    }
  };

  // InfoRow component for property details
  const InfoRow = ({ label, value, bottomPadding }: { label: string, value: any, bottomPadding?: number }) => (
    <View style={[styles.infoRow, bottomPadding ? { marginBottom: bottomPadding } : null]}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <View style={styles.infoSeparator} />
      <Text style={styles.infoValue}>{value || "-"}</Text>
    </View>
  );

  const handleShareButtonPress = () => {
    setIsShareModalOpen(true);

  };

  const [forceRender, setForceRender] = useState(false);

  return (
    <Modal
      visible={true}
      onShow={() => setForceRender(prev => !prev)}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerInfo}>
              <View style={styles.propertyIdBadge}>
                <Text style={styles.propertyIdText}>{property.propertyId || "Property ID"}</Text>
              </View>
              <Text style={styles.propertyName}>{getPropertyName()}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <View style={styles.locationInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color="#374151" />
              <Text style={styles.infoText}>{property.micromarket || "N/A"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color="#374151" />
              <Text style={styles.infoText}>{property.handoverDate || "Pending"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="home-outline" size={16} color="#374151" />
              <Text style={styles.infoText}>{property.assetType || "Unknown Type"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="bed-outline" size={16} color="#374151" />
              <Text style={styles.infoText}>{property.unitType || "Not Specified"}</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          style={[styles.content]}
          contentContainerStyle={[
            styles.contentContainer,
            { flexGrow: 1 }  // Add this to ensure content is scrollable
          ]}

        >
          {/* Image carousel */}
          {localImages.length > 0 &&
            <ImageCarousel
              images={localImages}
              onImagePress={() => {
                setCurrentImageIndex(0);
                setIsImageViewerVisible(true);
              }}
            />
          }



          {/* Basic Property Information */}
          <View style={styles.infoSection}>
            <InfoRow label="Plot Size" value={property.plotSize ? `${property.plotSize} sqft` : null} />
            <InfoRow label="Carpet Area" value={property.carpet ? `${property.carpet} sqft` : null} />
            <InfoRow label="SBUA" value={property.sbua ? `${property.sbua} sqft` : null} />
            <InfoRow label="Facing" value={property.facing} />
            <InfoRow label="Total Ask Price" value={property.totalAskPrice ? formatCost(property.totalAskPrice) : null} />
            <InfoRow label="Ask Price/Sqft" value={property.askPricePerSqft ? `₹${property.askPricePerSqft}` : null} />
            <InfoRow label="Floor" value={property.floorNo} />
          </View>

          {/* Location Details Section */}
          <View style={styles.locationSection}>
            <View style={styles.locationDetails}>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Micromarket</Text>
                <Text style={styles.locationValue}>{property.micromarket || "-"}</Text>
              </View>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Area</Text>
                <Text style={styles.locationValue}>{property.area || "-"}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.mapButton} onPress={handleOpenGoogleMap}>
              <Text style={styles.mapButtonText}>Open in Google Maps</Text>
              <Ionicons name="arrow-forward" size={16} color="#10302D" />
            </TouchableOpacity>
          </View>

          {/* Extra Details Section */}
          <View style={styles.extraDetailsSection}>
            <Text style={styles.extraDetailsTitle}>Extra Details</Text>
            <View style={styles.extraDetailsContent}>
              {property?.extraDetails ? (
                property?.extraDetails?.split("\n")?.map((detail, index) => (
                  <View key={index} style={styles.detailItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.detailText}>{detail}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noDetailsText}>No extra details available.</Text>
              )}
            </View>
          </View>

          {/* Additional Property Information */}
          <View style={styles.additionalInfo}>
            <InfoRow label="Building Khata" value={property.buildingKhata} />
            <InfoRow label="Land Khata" value={property.landKhata} />
            <InfoRow label="Building Age" value={property.buildingAge ? `${property.buildingAge}` : null} />
            <InfoRow label="Tenanted" value={property.tenanted ? "Yes" : "No"} />
            <InfoRow label="Inventory Added On" value={formatDate(property.dateOfInventoryAdded)} bottomPadding={20} />
          </View>

        </ScrollView>

        <ShareModal
          property={property}
          agentData={agentData}
          setProfileModalOpen={setIsShareModalOpen}
          visible={isShareModalOpen}
        />
        <EnquiryCPModal
          setIsEnquiryCPModalOpen={setIsEnquiryCPModelOpen}
          generatingEnquiry={false}
          visible={isEnquiryModelOpen}
          selectedCPID={selectedCPID || ""}
        />
        <ConfirmModal
          title="Confirm Enquiry"
          message={`Are you sure you want to enquire? You have ${monthlyCredits} credits remaining for this month.`}
          onConfirm={onConfirmEnquiry}
          onCancel={handleCancel}
          generatingEnquiry={false}
          visible={isConfirmModelOpen}
        />

        {/* Fixed share button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShareButtonPress}>
          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleOpenDriveDetails}>
            <Ionicons name="folder-outline" size={20} color="#153E3B" />
            <Text style={styles.secondaryButtonText}>Open Details</Text>
          </TouchableOpacity>
          {parent === "" &&
            <TouchableOpacity style={styles.primaryButton} onPress={handleEnquireNowBtn}>
              <Ionicons name="call-outline" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Enquire Now</Text>
            </TouchableOpacity>
          }
        </View>

        {/* Image Viewer Modal */}
        <Modal
          visible={isImageViewerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsImageViewerVisible(false)}
        >
          <View style={styles.imageViewerContainer}>
            <TouchableOpacity
              style={styles.closeImageViewer}
              onPress={() => setIsImageViewerVisible(false)}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            {localImages.length > 0 && (
              <Image
                source={{ uri: localImages[currentImageIndex] }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}

            <View style={styles.imageNavigation}>
              <TouchableOpacity
                style={styles.navButton}
                disabled={currentImageIndex === 0}
                onPress={() => setCurrentImageIndex(prev => prev - 1)}
              >
                <Ionicons
                  name="chevron-back"
                  size={28}
                  color={currentImageIndex === 0 ? "#999999" : "white"}
                />
              </TouchableOpacity>

              <Text style={styles.imageCounter}>
                {currentImageIndex + 1}/{localImages.length}
              </Text>

              <TouchableOpacity
                style={styles.navButton}
                disabled={currentImageIndex === localImages.length - 1}
                onPress={() => setCurrentImageIndex(prev => prev + 1)}
              >
                <Ionicons
                  name="chevron-forward"
                  size={28}
                  color={currentImageIndex === localImages.length - 1 ? "#999999" : "white"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
});

// Set display name for debugging
PropertyDetailsScreen.displayName = 'PropertyDetailsScreen';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F7',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCECE',
  },
  noImagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  noImageText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    gap: 12,
  },
  propertyIdBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 24,
    backgroundColor: '#747474',
  },
  propertyIdText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FAFBFC',
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2928',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#2B2928',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#9CA3AF',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#CCCBCB',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5555',
  },
  infoSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: '#E3E3E3',
    marginHorizontal: 16,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B2928',
  },
  locationSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  locationDetails: {
    gap: 8,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5555',
  },
  locationValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B2928',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#153E3B',
    borderRadius: 8,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10302D',
  },
  extraDetailsSection: {
    backgroundColor: '#F5F6F7',
    borderRadius: 10,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  extraDetailsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5A5555',
  },
  extraDetailsContent: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletPoint: {
    marginRight: 8,
    color: '#2B2928',
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B2928',
  },
  noDetailsText: {
    color: '#6B7280',
  },
  additionalInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#CCCBCB',
  },
  shareButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#153E3B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#153E3B',
    borderRadius: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#153E3B',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#153E3B',
    borderRadius: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  closeImageViewer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullImage: {
    width: width,
    height: width,
  },
  imageNavigation: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PropertyDetailsScreen; 