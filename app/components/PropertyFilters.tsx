import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSearchBox } from 'react-instantsearch';
import CustomCurrentRefinements from './CustomCurrentRefinements';

interface RequirementFiltersProps {
  handleToggleMoreFilters: () => void;
}

const RequirementFilters = ({ handleToggleMoreFilters }: RequirementFiltersProps) => {
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
            placeholder="Search requirements..."
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
      
      <View style={styles.refinements}>
        {/* Applied Filters */}
        <CustomCurrentRefinements />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    borderBottomWidth: 0,
    borderBottomColor: '#E5E7EB',
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
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
  refinements: {
    flexDirection: 'row',
    left: -15,
  },
  mobileContent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default RequirementFilters;