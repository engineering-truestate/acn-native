import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button, Alert, Modal, Dimensions } from "react-native";
import algoliasearch from "algoliasearch";
import { InstantSearch, Configure } from "react-instantsearch";
import { useHits, useSearchBox } from "react-instantsearch";
import PropertyFilters from "../components/PropertyFilters";
import CustomPagination from "../components/CustomPagination";
import { Property } from "../types";
import MoreFilters from "../components/MoreFilters";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import EnquiryCPModal from "../modals/EnquiryCPModal";
import ConfirmModal from "../modals/ConfirmModal";
import ShareModal from "../modals/ShareModal";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import * as Clipboard from 'expo-clipboard';
import PropertyCard from "../components/property/PropertyCard";

// Initialize Algolia search client
const searchClient = algoliasearch(
  "IX7SWC1B42",
  "72106b08028d186542a82eafa570fc88"
);

// Define the AgentData interface separately
export interface AgentData {
  phonenumber: string;
  [key: string]: any;
}

const indexName = "propertyId";

export interface Landmark {
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

// PropertyDetailsModal component
interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

// Use React.memo to fix the static flag issue
// const PropertyDetailsModal = React.memo(({ isOpen, onClose, property }: PropertyDetailsModalProps) => {
//   if (!property) return null;
  
//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={isOpen}
//       onRequestClose={onClose}
//     >
//       <View className="flex-1 bg-black bg-opacity-50 justify-end">
//         <View className="bg-white rounded-t-lg max-h-[80%]">
//           <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
//             <Text className="text-lg font-bold">Property Details</Text>
//             <TouchableOpacity onPress={onClose} className="p-2">
//               <Ionicons name="close" size={24} color="#374151" />
//             </TouchableOpacity>
//           </View>
          
//           <ScrollView className="p-4">
//             <Text className="text-lg font-bold mb-2">
//               {property.title || property.nameOfTheProperty || "Unnamed Property"}
//             </Text>
//             {property.propertyId && (
//               <Text className="text-gray-500">ID: {property.propertyId}</Text>
//             )}
            
//             <View className="mt-4">
//               <Text className="text-gray-700 font-bold">Available Properties:</Text>
//               {Object.entries(property).map(([key, value]) => (
//                 value && typeof value !== 'object' && key !== 'objectID' ? (
//                   <Text key={key} className="text-gray-600 mt-1">
//                     {key}: {value.toString()}
//                   </Text>
//                 ) : null
//               ))}
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// });

// Set display name for debugging
// PropertyDetailsModal.displayName = 'PropertyDetailsModal';

// Removed duplicate implementation of PropertiesScreen
// PropertyDetailsModal.displayName = 'PropertyDetailsModal';

// Mobile Hits Component
function MobileHits() {
  const { hits } = useHits<Property>();
  const { query } = useSearchBox();
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const handleCardClick = (property: any) => {
    setSelectedProperty(property);
  };

  if (hits?.length === 0 && query?.length !== 0) {
    return (
      <View className="flex items-center justify-center h-64">
        <Text style={styles.text}>No results found for "{query}"</Text>
      </View>
    );
  } else if (hits.length === 0) {
    return (
      <View className="flex items-center justify-center h-64">
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <View className="w-full px-4">
        {hits.map((property) => {
          // Transform property data
          const transformedProperty: Property = property;
          
          return (
            <PropertyCard 
              key={property.objectID} 
              property={transformedProperty}
              onCardClick={handleCardClick} 
            />
          );
        })}
        </View>
      
      {/* <PropertyDetailsModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
      /> */}
    </>
    // <View className="grid grid-cols-1 gap-4 p-4 pb-12">
    //   {hits.map((property) => (
    //     <PropertyCard key={property.objectID} property={property} />
    //   ))}
    // </View>
  );
}




export default function PropertiesScreen() {
  const [isMoreFiltersModalOpen, setIsMoreFiltersModalOpen] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [filtersHeight, setFiltersHeight] = useState(0);
  const [paginationHeight, setPaginationHeight] = useState(0);
  const filtersRef = useRef<View>(null);
  const paginationRef = useRef<View>(null);
  
  useEffect(() => {
    // Measure the height of the filters component
    if (filtersRef.current) {
      filtersRef.current.measure((_x: number, _y: number, _width: number, height: number) => {
        setFiltersHeight(height);
      });
    }
    
    // Measure the height of the pagination component
    if (paginationRef.current) {
      paginationRef.current.measure((_x: number, _y: number, _width: number, height: number) => {
        setPaginationHeight(height);
      });
    }
  }, []);

  const handleToggleMoreFilters = () => {
    setIsMoreFiltersModalOpen((prev) => !prev);
  };

  // Calculate the content height dynamically
  const windowHeight = Dimensions.get('window').height;
  const contentHeight = windowHeight - filtersHeight - paginationHeight;

  return (
    <View className="flex-1 bg-[#F5F6F7]">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure
          analytics={true}
          hitsPerPage={20}
          filters={`status:'Available'`}
          aroundLatLng={
            selectedLandmark?.lat && selectedLandmark?.lng
              ? `${selectedLandmark.lat},${selectedLandmark.lng}`
              : undefined
          }
          aroundRadius={selectedLandmark?.radius || undefined}
        />
        <View className="flex-1 relative">
          {/* Filters at the top */}
          <View 
            ref={filtersRef}
            className="bg-white border-b border-gray-200"
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setFiltersHeight(height);
            }}
          >
            <PropertyFilters 
              handleToggleMoreFilters={handleToggleMoreFilters} 
              selectedLandmark={selectedLandmark} 
              setSelectedLandmark={setSelectedLandmark} 
            />
          </View>
          
          {/* Main content area with dynamic height */}
          <ScrollView 
            style={{ height: contentHeight }}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            <MobileHits />
          </ScrollView>
          
          {/* Pagination at the bottom */}
          <View 
            ref={paginationRef}
            className="bg-white border-t border-gray-200"
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setPaginationHeight(height);
            }}
          >
            <CustomPagination />
          </View>
        </View>
        
      </InstantSearch>
    </View>
  );
}



const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat_400Regular',
    color: '#6B7280',
    fontSize: 16,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Montserrat_400Regular',
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Montserrat_500Medium',
    color: '#3B82F6',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  detailText: {
    fontFamily: 'Montserrat_400Regular',
    color: '#6B7280',
    fontSize: 14,
  },
});