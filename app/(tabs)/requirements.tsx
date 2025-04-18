import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Keyboard } from 'react-native';
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
      <ScrollView style={[styles.mobileContent]} contentContainerStyle={{ paddingBottom: 0, }} className='bg-green-300'>
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

  const [filtersHeight, setFiltersHeight] = useState(0);
  const [paginationHeight, setPaginationHeight] = useState(0);
  const filtersRef = useRef<View>(null);
  const paginationRef = useRef<View>(null);

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
    setIsMoreFiltersModalOpen(prev => !prev);
    Keyboard.dismiss();
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

          <View
            ref={paginationRef}
            className="bg-white border-t border-gray-200 mt-4"
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setPaginationHeight(height);
            }}
          >
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
    position: 'relative',
    gap: 4,
  },
  filtersContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  mobileContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    marginTop: 60,
    backgroundColor: ''
  },
});

export default RequirementsPage;