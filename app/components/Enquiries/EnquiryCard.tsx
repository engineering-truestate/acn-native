import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import PropertyDetailsScreen from "../property/PropertyDetailsScreen";
import ReviewModal from "./ReviewModal";
import { EnquiryWithProperty } from "@/app/types";

interface CardProps {
  // key:string,
  index: number;
  enquiry: EnquiryWithProperty;
  // handleGiveReview: (enquiryId: string) => void;
}

const EnquiryCard: React.FC<CardProps> = ({
  // key,
  index,
  enquiry,
  // handleGiveReview,
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  // const [loading,setLoading] = useState(true);
  const giveReviewClick = (e: any, enqId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReviewModalOpen(true);
  };

  // useEffect(()=>{
  //   setLoading(false);
  // },[])

  // if (loading) {
  //   return (
  //     <View className="border border-gray-300 rounded-lg p-4 bg-white w-full">
  //     </View>
  //   );
  // }

  return (
    <>
      {isDetailsModalOpen && (
        <PropertyDetailsScreen
          property={enquiry?.property!}
          onClose={() => setIsDetailsModalOpen(false)}
          parent = "dashboardEnquiry"
          enqId={enquiry['enquiryId']!}
        />
      )}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          enqId={enquiry['enquiryId']!}
        />
      )}
      {/* {isDetailsModalOpen && (
        <PropertyDetailsScreen
          property={enquiry?.property!}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )} */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          enqId={enquiry['enquiryId']!}
        />
      )}

      <Pressable
        className="border border-gray-300 rounded-lg p-4 bg-white w-full flex flex-col mb-4 "
        style={{ gap: 16 }}
        onPress={() => enquiry?.property && setIsDetailsModalOpen(true)}
      >
        {/* Header Section */}
        <View className='flex flex-col' style={{ gap: 10 }}>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-gray-600" style={{ fontFamily: "Montserrat_600SemiBold", fontSize: 14, lineHeight: 16, borderBottomWidth: 1, borderBottomColor: "#E3E3E3", letterSpacing: 0 }}>Sr. No. {index + 1}</Text>
            <View className="flex flex-row items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={'star'}
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
          <Text className=" text-black text-base" style={{ fontFamily: "Montserrat_700Bold" }}>
            {enquiry?.property?.nameOfTheProperty || 'N/A'}
          </Text>
        </View>

        {/* Property Details */}
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-col" style={{ gap: 8 }}>
            {/* Asset Type */}
            <View className="flex flex-row items-center" style={{ gap: 8 }}>
              <MaterialIcons name="home" size={20} color="#6B7280" />
              <Text className="text-gray-600">{enquiry?.property?.assetType || 'N/A'}</Text>
            </View>

            {/* Unit Type and Area */}
            <View className="flex flex-row items-center" style={{ gap: 8 }}>
              <FontAwesome5 name="bed" size={18} color="#6B7280" />
              <Text className="text-gray-600">
                {enquiry?.property?.unitType || 'N/A'}{' '}
                {enquiry?.property?.sbua ? `| ${enquiry?.property.sbua} sq.ft` : ''}
              </Text>
            </View>
          </View>

          {/* Give Review Button */}
          <Pressable
            className="bg-gray-200 border border-gray-300 rounded-lg"
            onPress={(e) => giveReviewClick(e, enquiry['enquiryId']!)}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 4, gap: 8 }}
          >
            <MaterialIcons name="edit" size={20} color="#153E3B" />
            <Text className="text-[#153E3B] font-medium text-sm">Give review</Text>
          </Pressable>
        </View>
      </Pressable>
    </>
  );
};

export default React.memo(EnquiryCard);
