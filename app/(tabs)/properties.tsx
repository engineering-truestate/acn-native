import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Keyboard, RefreshControl } from "react-native";
import algoliasearch from "algoliasearch";
import { InstantSearch, Configure, useInstantSearch } from "react-instantsearch";
import { useHits, useSearchBox } from "react-instantsearch";
import PropertyFilters from "../components/PropertyFilters";
import CustomPagination from "../components/CustomPagination";
import { Property } from "../types";
import { useRouter } from "expo-router";
import PropertyCard from "../components/property/PropertyCard";
import MoreFilters from "../components/MoreFilters";
import { useDoubleBackPressExit } from "@/hooks/useDoubleBackPressExit";

// Initialize Algolia search client
const searchClient = algoliasearch(
  "IX7SWC1B42",
  "72106b08028d186542a82eafa570fc88"
);

const indexName = "propertyId";

export interface Landmark {
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

// SearchRefresher component that accesses the refresh method
function SearchRefresher({ onRefreshAvailable }: { onRefreshAvailable: (refresh: Function) => void }) {
  const { refresh } = useInstantSearch();
  
  useEffect(() => {
    if (refresh && onRefreshAvailable) {
      onRefreshAvailable(refresh);
    }
  }, [refresh, onRefreshAvailable]);

  // This component doesn't render anything visible
  return null;
}

// MobileHits Component
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
        <ActivityIndicator size={'large'} color={'#153E3B'} />
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
    </>
  );
}

export default function PropertiesScreen() {
  const [isMoreFiltersModalOpen, setIsMoreFiltersModalOpen] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [filtersHeight, setFiltersHeight] = useState(0);
  const [paginationHeight, setPaginationHeight] = useState(0);
  const filtersRef = useRef<View>(null);
  const paginationRef = useRef<View>(null);
  const [refreshFunction, setRefreshFunction] = useState<Function | null>(null);

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
    Keyboard.dismiss(); // Dismiss the keyboard when toggling filters
  };

  // Calculate the content height dynamically
  const windowHeight = Dimensions.get('window').height;

  const [refreshing, setRefreshing] = useState(false);
  
  // Handle when refresh function becomes available
  const handleRefreshAvailable = useCallback((refresh: Function) => {
    setRefreshFunction(() => refresh);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Call the Algolia refresh method if available
    if (refreshFunction) {
      refreshFunction();
    }

    // Set a timeout to stop the refreshing indicator after some time
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [refreshFunction]);

  useDoubleBackPressExit();

  return (
    <View className="flex-1 bg-[#F5F6F7]">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        {/* This component gets the refresh function and passes it up */}
        <SearchRefresher onRefreshAvailable={handleRefreshAvailable} />
        
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
        <View className="flex-1 relative gap-4">
          {/* Filters at the top */}
          <View
            ref={filtersRef}
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#153E3B"]}
                tintColor="#153E3B"
                title="Refreshing..."
                titleColor="#153E3B"
              />
            }
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
        <MoreFilters
          isOpen={isMoreFiltersModalOpen}
          setIsOpen={setIsMoreFiltersModalOpen}
          handleToggle={handleToggleMoreFilters}
          isMobile={true}
          selectedLandmark={selectedLandmark}
          setSelectedLandmark={setSelectedLandmark}
        />
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