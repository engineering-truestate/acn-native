import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import algoliasearch from "algoliasearch";
import { InstantSearch, Configure } from "react-instantsearch";
import { useHits, useSearchBox } from "react-instantsearch";
import PropertyFilters from "../components/PropertyFilters";
import CustomPagination from "../components/CustomPagination";
import { Property } from "../types";
import MoreFilters from "../components/MoreFilters";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Initialize Algolia search client
const searchClient = algoliasearch(
  "IX7SWC1B42",
  "72106b08028d186542a82eafa570fc88"
);

const indexName = "propertyId";

export default function PropertiesScreen() {
  const [isMoreFiltersModalOpen, setIsMoreFiltersModalOpen] = useState(false);

  const handleToggleMoreFilters = () => {
    setIsMoreFiltersModalOpen((prev) => !prev);
  };

  return (
    <View className="bg-[#F5F6F7] h-[60vh]">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure
          analytics={true}
          hitsPerPage={20}
          filters={`status:'Available'`}
        />
        <View className="flex-1">
          <PropertyFilters handleToggleMoreFilters={handleToggleMoreFilters} />
          <ScrollView className="flex-1">
            <MobileHits />
          </ScrollView>
          <CustomPagination />
        </View>
        <MoreFilters isOpen={isMoreFiltersModalOpen} setIsOpen={setIsMoreFiltersModalOpen} handleToggle={handleToggleMoreFilters} isMobile={true} selectedLandmark={null} setSelectedLandmark={null} />
      </InstantSearch>

    </View>
  );
}

// Mobile Hits Component
function MobileHits() {
  const { hits } = useHits<Property>();
  const { query } = useSearchBox();

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
    <View className="grid grid-cols-1 gap-4 p-4 pb-12">
      {hits.map((property) => (
        <PropertyCard key={property.objectID} property={property} />
      ))}
    </View>
  );
}

// Property Card Component
const PropertyCard = ({ property }: { property: Property }) => {
  const router = useRouter();

  const handlePress = () => {
    console.log(property)
    router.push(`/property/${property.propertyId}`);

  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
    >
      <Image
        source={{ uri: property.image || 'https://via.placeholder.com/300x200' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.price}>₹ {property.totalAskPrice} Lacs</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={16} color="#374151" />
            <Text style={styles.detailText}>{property.unitType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="resize-outline" size={16} color="#374151" />
            <Text style={styles.detailText}>{property.sbua} sqft</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#374151" />
            <Text style={styles.detailText}>{property.micromarket}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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