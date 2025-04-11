import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import RequirementFilters from '../components/requirement/RequirementFilters';
import RequirementCard from '../components/requirement/RequirementCard';
import CustomPagination from '../components/CustomPagination';
import DetailsModal from '../components/requirement/DetailsModal';
import MoreFiltersRequirement from '../components/requirement/MoreFiltersRequirement';
import { InstantSearch } from 'react-instantsearch';
import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch(
    "J150UQXDLH",
    "146a46f31a26226786751f663e88ae33"
  );


const RequirementsPage = () => {
  const [isPropertyDetailsModalOpen, setPropertyDetailsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isMoreFiltersModalOpen, setIsMoreFiltersModalOpen] = useState(false);


  const handleToggleMoreFilters = () => {
    setIsMoreFiltersModalOpen(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <InstantSearch 
        searchClient={searchClient} 
        indexName="acn-agent-requirement"
      >
        <View style={styles.content}>
          {/* Sticky filters */}
          <View style={styles.filtersContainer}>
            <RequirementFilters handleToggleMoreFilters={handleToggleMoreFilters} />
          </View>

            <View style={styles.mobileContent}>
              <RequirementCard onPress={() => {}} />
            </View>

          {/* Sticky pagination at the bottom */}
          <View style={styles.paginationContainer}>
            <CustomPagination />
          </View>

          {/* Modal for displaying details */}
          {isPropertyDetailsModalOpen && (
            <DetailsModal
              onClose={() => {
                setPropertyDetailsModalOpen(false);
                setSelectedProperty(null);
              }}
              requirement={selectedProperty}
            />
          )}

          <MoreFiltersRequirement
            isOpen={isMoreFiltersModalOpen}
            setIsOpen={setIsMoreFiltersModalOpen}
            handleToggle={handleToggleMoreFilters}
          />
        </View>
      </InstantSearch>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F7',
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    backgroundColor: '#F5F6F7',
  },
  mobileContent: {
    flex: 1,
    width: '100%',
    maxHeight: Dimensions.get('window').height - 190,
  },
  desktopContent: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CFCECE',
    backgroundColor: '#F5F6F7',
  },
  paginationContainer: {
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
    backgroundColor: '#F5F6F7',
    paddingBottom: 16,
  },
});

export default RequirementsPage; 