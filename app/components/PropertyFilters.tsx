import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import { useSearchBox } from 'react-instantsearch';
import DropdownRefinementList from './DropdownRefinementList';
import CustomCurrentRefinements from './CustomCurrentRefinements';
import { Property } from '../types';

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
            value={query}
            onChangeText={refine}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          {/* More Filters Button */}
          <TouchableOpacity
            onPress={handleToggleMoreFilters}
            style={styles.moreFiltersButton}
          >
            <Text style={styles.moreFiltersText}>More Filters</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Applied Filters */}
      <CustomCurrentRefinements
        selectedLandmark={selectedLandmark}
        setSelectedLandmark={setSelectedLandmark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 16,
  },
  mobileContent: {
    flexDirection: 'column',
    gap: 8,
  },
  desktopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    marginRight: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#374151',
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moreFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  moreFiltersText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#374151',
  },
}); 