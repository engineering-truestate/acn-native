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
      <View style={styles.searchAndFiltersRow}>
        <CustomSearchBox />

        <TouchableOpacity
          onPress={handleToggleMoreFilters}
          style={styles.moreFiltersButton}
        >
          <Text style={styles.moreFiltersText}>More Filters</Text>
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
  searchAndFiltersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1, // Allow search box to take remaining space
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
  moreFiltersButton: {
    height: 40, // same fixed height
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
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
});

export default RequirementFilters;