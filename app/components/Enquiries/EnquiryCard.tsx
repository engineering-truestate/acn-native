import { doc, getDoc, DocumentData, DocumentReference } from "firebase/firestore";
import { db } from "../../config/firebase";
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import PropertyDetailsScreen from "../property/PropertyDetailsScreen";
import ReviewModal from "./ReviewModal";

interface Property {
  propertyId: string;
  title?: string;
  nameOfTheProperty?: string;
  micromarket?: string;
  assetType?: string;
  unitType?: string;
  facing?: string;
  totalAskPrice?: number;
  askPricePerSqft?: number;
  sbua?: number;
  plotSize?: number;
  carpet?: number;
  floorNo?: string;
  handoverDate?: string;
  buildingKhata?: string;
  landKhata?: string;
  buildingAge?: string;
  tenanted?: boolean;
  area?: string;
  dateOfInventoryAdded?: number;
  extraDetails?: string;
  driveLink?: string;
  photo?: string[];
  video?: string[];
  mapLocation?: string;
  cpId?: string;
  cpCode?: string;
  id?: string;
}

interface CardProps {
  // key:string,
  index: number;
  enquiry: {
    id: string;
    added?: number;
    cpId?: string;
    enquiryId?: string;
    lastModified?: number;
    propertyId?: string;
    status?: string;
    [key: string]: any;
  };
  // handleGiveReview: (enquiryId: string) => void;
}

const fetchPropertyById = async (id: string): Promise<Property> => {
  const docRef: DocumentReference<DocumentData> = doc(db, "ACN123", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Property;
  } else {
    throw new Error("Document not found");
  }
};

const EnquiryCard: React.FC<CardProps> = ({
  // key,
  index,
  enquiry,
  // handleGiveReview,
}) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!enquiry.propertyId) return;

    fetchPropertyById(enquiry.propertyId)
      .then(setProperty)
      .catch((err) => console.error("Error fetching property:", err))
      .finally(() => setLoading(false));
  }, [enquiry.propertyId]);

  const giveReviewClick = (e: any, enqId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReviewModalOpen(true);
  };

  if (loading) {
    return (
      <View className="border border-gray-300 rounded-lg p-4 bg-white w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  return (
    <>
    {isDetailsModalOpen && (
      <PropertyDetailsScreen
        property={property!}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    )}
    {isReviewModalOpen && (
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        enqId={enquiry['enquiryId']!}
      />
    )}

    <Pressable
      className="border border-gray-300 rounded-lg p-4 pr-8 pb-8 bg-white w-full flex flex-col gap-4 m-2"
      onPress={() => property && setIsDetailsModalOpen(true)}
    >
      {/* Header Section */}
      <View className="flex flex-row justify-between items-center">
        <Text className="text-gray-600 underline" style={{fontFamily: "Montserrat_600SemiBold" }}>Sr. No. {index + 1}</Text>
        <View className="flex flex-row items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome5
              key={star}
              name="star"
              size={16}
              color={
                enquiry?.reviews &&
                enquiry?.reviews.length > 0 &&
                enquiry?.reviews[0]?.stars >= star
                  ? '#FFC107'
                  : '#D3D3D3'
              }
            />
          ))}
        </View>
      </View>

      {/* Property Name */}
      <Text className=" text-black text-base" style={{fontFamily:"Montserrat_700Bold"}}>
        {property?.nameOfTheProperty || 'N/A'}
      </Text>

      {/* Property Details */}
      <View className="flex flex-row justify-between items-start space-x-4">
        <View className="flex flex-col gap-y-2">
          {/* Asset Type */}
          <View className="flex flex-row items-center gap-2">
            <MaterialIcons name="home" size={20} color="#6B7280" />
            <Text className="text-gray-600">{property?.assetType || 'N/A'}</Text>
          </View>

          {/* Unit Type and Area */}
          <View className="flex flex-row items-center gap-2">
            <FontAwesome5 name="bed" size={20} color="#6B7280" />
            <Text className="text-gray-600">
              {property?.unitType || 'N/A'}{' '}
              {property?.sbua ? `| ${property.sbua} sq.ft` : ''}
            </Text>
          </View>
        </View>

        {/* Give Review Button */}
        <Pressable
          className="flex flex-row items-center mt-2 p-3 bg-gray-200 border border-gray-300 rounded-lg"
          onPress={(e) => giveReviewClick(e, enquiry['enquiryId']!)}
        >
          <MaterialIcons name="edit" size={20} color="#153E3B" />
          <Text className="text-[#153E3B] font-medium text-sm">Give review</Text>
        </Pressable>
      </View>
    </Pressable>
    </>
  );
};

export default EnquiryCard;
