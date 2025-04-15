import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearchBox } from 'react-instantsearch';
import CustomCurrentRefinements from '../CustomCurrentRefinements';

interface RequirementFiltersProps {
  handleToggleMoreFilters: () => void;
}

const CustomSearchBox = () => {
  const { query, refine } = useSearchBox();

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search requirements..."
        value={query}
        onChangeText={refine}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};

const RequirementFilters = ({ handleToggleMoreFilters }: RequirementFiltersProps) => {
  return (
    <View style={styles.container}>
      <CustomSearchBox />
      
      <View style={styles.filtersContainer}>
        
        <TouchableOpacity 
          style={styles.moreFiltersButton}
          onPress={handleToggleMoreFilters}
        >
          <Text style={styles.moreFiltersText}>More Filters</Text>
          <Ionicons name="options" size={16} color="#10B981" />
        </TouchableOpacity>
      </View>

      <CustomCurrentRefinements />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#374151',
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  filterButtonText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#374151',
  },
  moreFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  moreFiltersText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#10B981',
  },
});

export default RequirementFilters; 