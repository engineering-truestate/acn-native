import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import RequirementFilters from '../components/requirement/RequirementFilters';
import RequirementCard from '../components/requirement/RequirementCard';
import CustomPagination from '../components/CustomPagination';
import MoreFiltersRequirement from '../components/requirement/MoreFiltersRequirement';
import { InstantSearch, useHits } from 'react-instantsearch';
import algoliasearch from 'algoliasearch';
import RequirementDetailsModal from '../components/requirement/RequirementDetailsModal';
import { Requirement } from '../types';

const searchClient = algoliasearch(
  "J150UQXDLH",
  "146a46f31a26226786751f663e88ae33"
);

const RequirementsList = () => {
  // The generic type should be Requirement, not Requirement[]
  const { hits } = useHits<Requirement>();
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);

  const handleCardClick = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
  };

  return (
    <>
      <ScrollView style={[styles.mobileContent, { marginTop: '35%' }]} contentContainerStyle={{ paddingBottom: 100 }}>
        {hits.map((requirement: Requirement) => (
          <RequirementCard 
            key={requirement.requirementId}
            requirement={requirement}
            onCardClick={handleCardClick}
          />
        ))}
      </ScrollView>

      <RequirementDetailsModal
        isOpen={!!selectedRequirement}
        onClose={() => setSelectedRequirement(null)}
        requirement={selectedRequirement}
      />
    </>
  );
};

const RequirementsPage = () => {
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
          {/* Filters */}
          <View style={styles.filtersContainer}>
            <RequirementFilters handleToggleMoreFilters={handleToggleMoreFilters} />
          </View>

          <RequirementsList />

          {/* Pagination */}
          <View style={styles.paginationContainer}>
            <CustomPagination />
          </View>

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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mobileContent: {
    flex: 1,
    padding: 16,
    marginTop: 60, // Add margin to account for the fixed filters
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
});

export default RequirementsPage;