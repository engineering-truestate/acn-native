import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from "react-native";
import algoliasearch from "algoliasearch";
import { InstantSearch, Configure } from "react-instantsearch";
import { useHits, useSearchBox } from "react-instantsearch";
import PropertyFilters from "../components/PropertyFilters";
import CustomPagination from "../components/CustomPagination";
import { Property } from "../types";
import MoreFilters from "../components/MoreFilters";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PropertyCard from "../components/property/PropertyCard";

// Initialize Algolia search client
const searchClient = algoliasearch(
  "IX7SWC1B42",
  "72106b08028d186542a82eafa570fc88"
);

const indexName = "propertyId";

// PropertyDetailsModal component
interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

// Use React.memo to fix the static flag issue
const PropertyDetailsModal = React.memo(({ isOpen, onClose, property }: PropertyDetailsModalProps) => {
  if (!property) return null;
  
  // Log all properties to help debug
  React.useEffect(() => {
    if (property) {
      console.log("PropertyDetailsModal - Property object keys:", Object.keys(property));
      console.log("PropertyDetailsModal - Complete property:", JSON.stringify(property, null, 2));
    }
  }, [property]);
  
  return (
    
      <View className="flex-1 bg-black bg-opacity-50 justify-end">
        <View className="bg-white rounded-t-lg max-h-[80%]">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Property Details</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="p-4">
            <Text className="text-lg font-bold mb-2">
              {property.title || property.nameOfTheProperty || "Unnamed Property"}
            </Text>
            {property.propertyId && (
              <Text className="text-gray-500">ID: {property.propertyId}</Text>
            )}
            
            <View className="mt-4">
              <Text className="text-gray-700 font-bold">Available Properties:</Text>
              {Object.entries(property).map(([key, value]) => (
                value && typeof value !== 'object' && key !== 'objectID' ? (
                  <Text key={key} className="text-gray-600 mt-1">
                    {key}: {value.toString()}
                  </Text>
                ) : null
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    
  );
});

// Set display name for debugging
PropertyDetailsModal.displayName = 'PropertyDetailsModal';

export default function PropertiesScreen() {
  const [isMoreFiltersModalOpen, setIsMoreFiltersModalOpen] = useState(false);

  const handleToggleMoreFilters = () => {
    setIsMoreFiltersModalOpen((prev) => !prev);
  };

  return (
    <View className="flex-1 bg-[#F5F6F7]">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure
          analytics={true}
          hitsPerPage={20}
          filters={`status:'Available'`}
        />
        <View className="flex-1 relative">
          {/* Filters at the top */}
          <View className="absolute top-2 left-0 right-0 z-10 bg-white border-b border-gray-200">
            <PropertyFilters handleToggleMoreFilters={handleToggleMoreFilters} />
          </View>
          
          {/* Main content area with padding to account for filters and pagination */}
          <ScrollView className="flex-1 py-6 mt-20" contentContainerStyle={{ paddingBottom: 100 }}>
            <MobileHits />
          </ScrollView>
          
          {/* Pagination at the bottom */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <CustomPagination />
          </View>
        </View>
        <MoreFilters isOpen={isMoreFiltersModalOpen} setIsOpen={setIsMoreFiltersModalOpen} handleToggle={handleToggleMoreFilters} isMobile={true} selectedLandmark={null} setSelectedLandmark={() => {}} />
      </InstantSearch>
    </View>
  );
}

// Mobile Hits Component
function MobileHits() {
  const { hits } = useHits<Property>();
  const { query } = useSearchBox();
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const handleCardClick = (property: any) => {
    console.log("Property clicked:", property);
    setSelectedProperty(property);
  };

  // Debug the first hit if available
  React.useEffect(() => {
    if (hits && hits.length > 0) {
      console.log("First hit data (all properties):", JSON.stringify(hits[0], null, 2));
      
      // Check all possible name properties
      const firstHit = hits[0];
      console.log("Possible name properties:");
      console.log("- title:", firstHit.title);
      console.log("- name:", (firstHit as any).name);
      console.log("- propertyName:", (firstHit as any).propertyName);
      console.log("- nameOfTheProperty:", (firstHit as any).nameOfTheProperty);
      console.log("- nameOfProperty:", (firstHit as any).nameOfProperty);
      console.log("- property_name:", (firstHit as any).property_name);
      console.log("- description:", firstHit.description);
    }
  }, [hits]);

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
      <View className="w-full p-4">
        {hits.map((property) => {
          // Try different possible field names for the property name
          const propertyName = 
            property.title || 
            (property as any).name || 
            (property as any).propertyName ||
            (property as any).nameOfTheProperty ||
            (property as any).nameOfProperty ||
            (property as any).property_name ||
            property.description ||
            'Unnamed Property';
          
          // Debug individual property data transformation
          const transformedProperty = {
            propertyId: property.propertyId || '',
            title: propertyName,
            nameOfTheProperty: propertyName,
            micromarket: property.micromarket,
            assetType: property.assetType,
            unitType: property.unitType,
            facing: property.facing,
            totalAskPrice: property.totalAskPrice,
            sbua: property.sbua
          };
          
          console.log("Using property name:", propertyName);
          
          return (
            <PropertyCard 
              key={property.objectID} 
              property={transformedProperty}
              onCardClick={handleCardClick} 
            />
          );
        })}
        </View>
      
      <PropertyDetailsModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
      />
    </>
    // <View className="grid grid-cols-1 gap-4 p-4 pb-12">
    //   {hits.map((property) => (
    //     <PropertyCard key={property.objectID} property={property} />
    //   ))}
    // </View>
  );
}

// Property Card Component
// const PropertyCard = ({ property }: { property: Property }) => {
//   const router = useRouter();

//   const handlePress = () => {
//     router.push(`/property/${property.propertyId}`);

//   };

//   return (
//     <TouchableOpacity 
//       style={styles.card}
//       onPress={handlePress}
//     >
//       <Image
//         source={{ uri: property.image || 'https://via.placeholder.com/300x200' }}
//         style={styles.image}
//       />
//       <View style={styles.content}>
//         <Text style={styles.title}>{property.title}</Text>
//         <Text style={styles.price}>₹ {property.totalAskPrice} Lacs</Text>
//         <View style={styles.details}>
//           <View style={styles.detailItem}>
//             <Ionicons name="bed-outline" size={16} color="#374151" />
//             <Text style={styles.detailText}>{property.unitType}</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <Ionicons name="resize-outline" size={16} color="#374151" />
//             <Text style={styles.detailText}>{property.sbua} sqft</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <Ionicons name="location-outline" size={16} color="#374151" />
//             <Text style={styles.detailText}>{property.micromarket}</Text>
//           </View>
//         </View>

//       </View>
      
//       <PropertyDetailsModal
//         isOpen={!!selectedProperty}
//         onClose={() => setSelectedProperty(null)}
//         property={selectedProperty}
//       />
//     </>
//   );
// }

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