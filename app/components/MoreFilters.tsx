import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import { useCurrentRefinements, useRefinementList } from 'react-instantsearch';
import DropdownMoreFilters from './DropdownMoreFilters'
import { Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';

interface MoreFiltersProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleToggle: () => void;
  isMobile: boolean;
  selectedLandmark?: any;
  setSelectedLandmark?: (landmark: any) => void;
}

const MoreFilters = ({ 
  isOpen, 
  setIsOpen, 
  handleToggle, 
  isMobile, 
  selectedLandmark, 
  setSelectedLandmark 
}: MoreFiltersProps) => {
  const { items, refine } = useCurrentRefinements();
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('micromarket');

  // Micromarket refinement list
  const { items: micromarketItems, refine: refineMicromarket } = useRefinementList({
    attribute: 'micromarket',
    limit: 50,
  });

  // Status refinement list
  const { items: statusItems, refine: refineStatus } = useRefinementList({
    attribute: 'currentStatus',
    limit: 50,
  });

  // Area refinement list
  const { items: areaItems, refine: refineArea } = useRefinementList({
    attribute: 'area',
    limit: 50,
  });

  const clearAttributeFilter = (attribute: string) => {
    const targetItem = items.find((item) => item.attribute === attribute);
    if (targetItem) {
      targetItem.refinements.forEach((refinement) => {
        refine(refinement);
      });
    }
  };

  useEffect(() => {
    const hasMicromarketFilter = items?.some((item) => item.attribute === 'micromarket');
    setSelectedLocationFilter((hasMicromarketFilter && !selectedLandmark) ? 'micromarket' : 'landmark');
  }, [items]);

  const outsideFilters = [
    { title: 'Asset Type', attribute: 'assetType', type: 'dropdown' },
    { title: 'Configuration', attribute: 'unitType', type: 'dropdown' },
    { title: 'SBUA (sqft)', attribute: 'sbua', type: 'range' },
    { title: 'Total Ask Price (Lacs)', attribute: 'totalAskPrice', type: 'range' },
  ];

  const insideFilters = [
    { title: 'Plot Size (sqft)', attribute: 'plotSize', type: 'range' },
    { title: 'Carpet Area (sqft)', attribute: 'carpet', type: 'range' },
    { title: 'Ask Price/Sqft', attribute: 'askPricePerSqft', type: 'range' },
    { title: 'Facing', attribute: 'facing', type: 'dropdown' },
    { title: 'Floor', attribute: 'floorNo', type: 'dropdown' },
    { title: 'Status', attribute: 'currentStatus', type: 'tab' },
    { title: 'Area', attribute: 'area', type: 'tab' },
  ];

  const renderRefinementList = (items: any[], refine: (value: string) => void) => {
    return (
      <View style={styles.refinementList}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.refinementItem,
              item.isRefined && styles.selectedRefinementItem
            ]}
            onPress={() => refine(item.value)}
          >
            <Text style={styles.refinementLabel}>{item.label}</Text>
            <Text style={styles.refinementCount}>{item.count}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleToggle}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>More Filters</Text>
            <TouchableOpacity onPress={handleToggle}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
          <View style={styles.mobileFilters}>
                {outsideFilters.map((filter, idx) => (
                  <View key={idx} style={styles.filterCard}>
                    <Text style={styles.filterTitle}>{filter.title}</Text>
                    {filter.type === 'dropdown' ? (
                      <DropdownMoreFilters
                        attribute={filter.attribute}
                        title="Please Select"
                        type={filter.type}
                      />
                    ) : filter.type === 'range' ? (
                        <></>
                    ) : null}
                  </View>
                ))}
              </View>

            {/* Location Filter */}
            <View style={styles.locationFilter}>
              <View style={styles.locationButtons}>
                <TouchableOpacity
                  style={[
                    styles.locationButton,
                    selectedLocationFilter === 'landmark' && styles.selectedLocationButton
                  ]}
                  onPress={() => {
                    setSelectedLocationFilter('landmark');
                    clearAttributeFilter('micromarket');
                  }}
                >
                  <Text style={[
                    styles.locationButtonText,
                    selectedLocationFilter === 'landmark' && styles.selectedLocationButtonText
                  ]}>
                    Landmark
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.locationButton,
                    selectedLocationFilter === 'micromarket' && styles.selectedLocationButton
                  ]}
                  onPress={() => {
                    setSelectedLocationFilter('micromarket');
                    setSelectedLandmark?.(null);
                  }}
                >
                  <Text style={[
                    styles.locationButtonText,
                    selectedLocationFilter === 'micromarket' && styles.selectedLocationButtonText
                  ]}>
                    Micromarket
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedLocationFilter === 'micromarket' && (
                renderRefinementList(micromarketItems, refineMicromarket)
              )}
            </View>

            {/* Inside Filters */}
            <View style={styles.insideFilters}>
              {insideFilters.map((filter, idx) => (
                <View key={idx} style={styles.filterCard}>
                  <Text style={styles.filterTitle}>{filter.title}</Text>
                  {filter.type === 'dropdown' ? (
                    <DropdownMoreFilters
                      attribute={filter.attribute}
                      title="Please Select"
                    />
                  ) : filter.type === 'range' ? (
                    // <RangeMoreFilters attribute={filter.attribute} />
                    <></>
                  ) : filter.type === 'tab' ? (
                    filter.attribute === 'currentStatus' ? (
                      renderRefinementList(statusItems, refineStatus)
                    ) : filter.attribute === 'area' ? (
                      renderRefinementList(areaItems, refineArea)
                    ) : null
                  ) : null}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.showResultsButton} onPress={handleToggle}>
              <Text style={styles.showResultsText}>Show Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#374151',
  },
  closeButton: {
    fontSize: 24,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  mobileFilters: {
    padding: 16,
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    padding: 16,
    marginBottom: 16,
  },
  filterTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  locationFilter: {
    padding: 16,
  },
  locationButtons: {
    flexDirection: 'row',
    backgroundColor: '#EFF0F1',
    borderRadius: 8,
    padding: 6,
    marginBottom: 8,
  },
  locationButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedLocationButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FAFAFA',
  },
  locationButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: '#726C6C',
  },
  selectedLocationButtonText: {
    color: '#313534',
  },
  insideFilters: {
    padding: 16,
  },
  refinementList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  refinementItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  selectedRefinementItem: {
    backgroundColor: '#DFF4F3',
    borderColor: '#10B981',
  },
  refinementLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: '#374151',
  },
  refinementCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  showResultsButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  showResultsText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default MoreFilters; 