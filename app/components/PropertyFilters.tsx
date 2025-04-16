import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import { useSearchBox } from 'react-instantsearch';
import DropdownRefinementList from './DropdownRefinementList';
import CustomCurrentRefinements from './CustomCurrentRefinements';
import { Property } from '../types';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface PropertyFiltersProps {
  handleToggleMoreFilters: () => void;
  selectedLandmark?: any;
  setSelectedLandmark?: (landmark: any) => void;
}


export default function PropertyFilters({
  handleToggleMoreFilters,
  selectedLandmark,
  setSelectedLandmark
}: PropertyFiltersProps) {
  const { query, refine } = useSearchBox();
  const [searchText, setSearchText] = useState(query);

  // Handle text input change
  const handleSearchChange = (text: string) => {
    setSearchText(text); // Update the local state with the new search text
  };

  // Handle search button press (refine action)
  const handleSearchPress = () => {
    refine(searchText);  // Trigger the refine action with the updated search text
  };

  const handleClear = () => {
    setSearchText("");
    refine("");
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.content,
        styles.mobileContent
      ]}>
        {/* Search Box */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by project, location..."
            value={searchText}
            onChangeText={handleSearchChange}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Search Button */}
        <View style={styles.filters}>
          <TouchableOpacity
            onPress={handleSearchPress}
            style={styles.searchButton}
          >
            <Feather name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Clear Button */}
        {searchText &&
          <View style={styles.filters}>
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        }

        {/* More Filters Button */}
        <View style={styles.filters}>
          <TouchableOpacity
            onPress={handleToggleMoreFilters}
            style={styles.moreFiltersButton}
          >
            <Feather name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.refinements}>
        {/* Applied Filters */}
        <CustomCurrentRefinements
          selectedLandmark={selectedLandmark}
          setSelectedLandmark={setSelectedLandmark}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: '95%',
    borderBottomWidth: 0,
    borderBottomColor: '#E5E7EB',
    alignSelf: 'center',
    // backgroundColor: '#fff',
    paddingTop: 16,
    borderRadius: 16,
  },
  contentWrapper: {
    flexDirection: 'column',
    // paddingHorizontal: 16,
    // paddingVertical: 8,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  searchBox: {
    flex: 1,
  },
  searchInput: {
    height: 40, // fixed height
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#374151',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  searchButton: {
    height: 40,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#153E3B',
  },
  clearButton: {
    height: 40,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#ff0000',
  },
  moreFiltersButton: {
    height: 40,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  moreFiltersText: {
    fontFamily: 'Montserrat_500Medium',
    alignContent: 'center',
    justifyContent: 'center',
    top: 10,
    fontSize: 14,
    color: '#374151',
  },
  refinements: {
    // marginTop: 8,
    flexDirection: 'row',
    left: -15,
  },
  mobileContent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
