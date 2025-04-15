import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, Pressable, PanResponder, Animated } from 'react-native';
import { useCurrentRefinements, useRange, useRefinementList } from 'react-instantsearch';
import DropdownMoreFilters from './DropdownMoreFilters';
import { Ionicons } from '@expo/vector-icons';
import BudgetRangeSlider from './property/BudgetRangeSlider';
import { Landmark } from '../(tabs)/properties';
import RangeMoreFilters from './RangeMoreFilters';
import LandmarkDropdownFilters from './LandmarkDropdownFilters';

interface MoreFiltersProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleToggle: () => void;
  isMobile: boolean;
  selectedLandmark: Landmark | null;
  setSelectedLandmark: (landmark: Landmark | null) => void;
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
  const [landmarkSearch, setLandmarkSearch] = useState('');

  // Debug log to check when selectedLandmark changes in this component
  console.log("MoreFilters selectedLandmark:", selectedLandmark);

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
   // Other refinement lists for assetType, unitType, etc.
   const { items: assetTypeItems, refine: refineAssetType } = useRefinementList({
    attribute: 'assetType',
    limit: 50,
  });

  const { items: unitTypeItems, refine: refineUnitType } = useRefinementList({
    attribute: 'unitType',
    limit: 50,
  });

  const { items: sbuaItems, refine: refineSbua } = useRefinementList({
    attribute: 'sbua',
    limit: 50,
  });

  const { items: totalAskPriceItems, refine: refineTotalAskPrice } = useRefinementList({
    attribute: 'totalAskPrice',
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
  }, [items, selectedLandmark]);

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
      <View className="flex-row flex-wrap gap-2">
        {items.map((item) => (
          <TouchableOpacity
            key={item.value}
            className={`py-2 px-3 border border-gray-300 rounded-md bg-white ${item.isRefined ? 'bg-[#DFF4F3] border-[#10B981]' : ''
              }`}
            onPress={() => refine(item.value)}
          >
            <View className="flex-row justify-between items-center">
              <Text className={`text-sm ${item.isRefined ? 'text-[#10B981]' : 'text-gray-700'}`}>
                {item.label}
              </Text>
              <Text className="text-xs ml-2 px-1 py-0.5 bg-gray-200 rounded text-gray-600">
                {item.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // return (
  // <Modal
  //   visible={isOpen}
  //   animationType="slide"
  //   transparent={true}
  //   onRequestClose={handleToggle}
  // >
  //   <View style={styles.modalOverlay}>
  //     <View style={styles.modalContent}>
  //       {/* Header */}
  //       <View style={styles.header}>
  //         <Text style={styles.headerTitle}>More Filters</Text>
  //         <TouchableOpacity onPress={handleToggle}>
  //           <Text style={styles.closeButton}>×</Text>
  //         </TouchableOpacity>
  //       </View>

  //       <ScrollView style={styles.scrollView}>
  //         <View style={styles.mobileFilters}>
  //           {outsideFilters.map((filter, idx) => (
  //             <View key={idx} style={styles.filterCard}>
  //               <Text style={styles.filterTitle}>{filter.title}</Text>
  //               {filter.type === 'dropdown' ? (
  //                 <DropdownMoreFilters
  //                   attribute={filter.attribute}
  //                   title="Please Select"
  //                   type={filter.type}
  //                 />
  //               ) : filter.type === 'range' ? (
  //                 <></>
  //               ) : null}
  //             </View>
  //           ))}
  //         </View>

  //         {/* Location Filter */}
  //         <View style={styles.locationFilter}>
  //           <View style={styles.locationButtons}>
  //             <TouchableOpacity
  //               style={[
  //                 styles.locationButton,
  //                 selectedLocationFilter === 'landmark' && styles.selectedLocationButton
  //               ]}
  //               onPress={() => {
  //                 setSelectedLocationFilter('landmark');
  //                 clearAttributeFilter('micromarket');
  //               }}
  //             >
  //               <Text style={[
  //                 styles.locationButtonText,
  //                 selectedLocationFilter === 'landmark' && styles.selectedLocationButtonText
  //               ]}>
  //                 Landmark
  //               </Text>
  //             </TouchableOpacity>
  //             <TouchableOpacity
  //               style={[
  //                 styles.locationButton,
  //                 selectedLocationFilter === 'micromarket' && styles.selectedLocationButton
  //               ]}
  //               onPress={() => {
  //                 setSelectedLocationFilter('micromarket');
  //                 setSelectedLandmark(null);
  //               }}
  //             >
  //               <Text style={[
  //                 styles.locationButtonText,
  //                 selectedLocationFilter === 'micromarket' && styles.selectedLocationButtonText
  //               ]}>
  //                 Micromarket
  //               </Text>
  //             </TouchableOpacity>
  //           </View>

  //           {selectedLocationFilter === 'micromarket' && (
  //             renderRefinementList(micromarketItems, refineMicromarket)
  //           )}
  //           {selectedLocationFilter === 'landmark' && (
  //             <LandmarkDropdownFilters
  //               selectedLandmark={selectedLandmark}
  //               setSelectedLandmark={setSelectedLandmark}
  //             />
  //           )}
  //         </View>

  //         {/* Inside Filters */}
  //         <View style={styles.insideFilters}>
  //           {insideFilters.map((filter, idx) => (
  //             <View key={idx} style={styles.filterCard}>
  //               <Text style={styles.filterTitle}>{filter.title}</Text>
  //               {filter.type === 'dropdown' ? (
  //                 <DropdownMoreFilters
  //                   attribute={filter.attribute}
  //                   title="Please Select"
  //                 />
  //               ) : filter.type === 'range' ? (
  //                 // <RangeMoreFilters attribute={filter.attribute} />
  //                 <></>
  //               ) : filter.type === 'tab' ? (
  //                 filter.attribute === 'currentStatus' ? (
  //                   renderRefinementList(statusItems, refineStatus)
  //                 ) : filter.attribute === 'area' ? (
  //                   renderRefinementList(areaItems, refineArea)
  //                 ) : null
  //               ) : null}
  //             </View>
  //           ))}
  //         </View>
  //       </ScrollView>

  //       {/* Footer */}
  //       <View style={styles.footer}>
  //         <TouchableOpacity style={styles.showResultsButton} onPress={handleToggle}>
  //           <Text style={styles.showResultsText}>Show Results</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </View>
  // </Modal>
  // );
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleToggle}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="font-semibold text-lg text-gray-800">More Filters</Text>
          <TouchableOpacity onPress={handleToggle} >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-2">
          {/* Asset Type & Configuration - First Row */}
          <View className="flex-row flex-wrap justify-between mb-4">

            <View className="w-[48%] mb-4 z-20">
              <Text className="text-base font-semibold text-black mb-2 font-['Montserrat']">
                {outsideFilters[0].title}
              </Text>
              <DropdownMoreFilters
                attribute={outsideFilters[0].attribute}
                title="Please Select"
                type={outsideFilters[0].type}
              />
            </View>

            <View className="w-[48%] mb-4 z-20">
              <Text className="text-base font-semibold text-black mb-2 font-['Montserrat']">
                {outsideFilters[1].title}
              </Text>
              <DropdownMoreFilters
                attribute={outsideFilters[1].attribute}
                title="Please Select"
                type={outsideFilters[1].type}
              />
            </View>
          </View>

          {/* SBUA Range */}
          <RangeMoreFilters
            title={outsideFilters[2].title}
            attribute={outsideFilters[2].attribute}

          />

          {/* Total Ask Price Range - replaced with BudgetRangeSlider */}
          <View className="border border-gray-200 rounded-xl w-full mb-4">
            <View className="py-3 px-4">
              <Text className="font-semibold text-sm text-gray-700">
                {outsideFilters[3].title}
              </Text>
            </View>
            <BudgetRangeSlider
              attribute={outsideFilters[3].attribute}
              onApply={handleToggle}
            />
          </View>

          {/* Location Filter */}
          <View className="border border-gray-200 rounded-xl mb-4">
            {/* Location Tabs */}
            <View className="bg-gray-100 p-1 rounded-t-xl">
              <View className="flex-row">
                <TouchableOpacity
                  className={`flex-1 py-3 px-4 rounded-md ${selectedLocationFilter === 'landmark'
                      ? 'bg-white'
                      : ''
                    }`}
                  onPress={() => {
                    setSelectedLocationFilter('landmark');
                    clearAttributeFilter('micromarket');
                  }}
                >
                  <Text className={`text-center font-medium ${selectedLocationFilter === 'landmark' ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                    Landmark
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 py-3 px-4 rounded-md ${selectedLocationFilter === 'micromarket'
                      ? 'bg-white'
                      : ''
                    }`}
                  onPress={() => {
                    setSelectedLocationFilter('micromarket');
                    setSelectedLandmark?.(null);
                  }}
                >
                  <Text className={`text-center font-medium ${selectedLocationFilter === 'micromarket' ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                    Micromarket
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Input */}
            <View className="p-4">
              {/* <View className="flex-row items-center border border-gray-300 rounded-md px-3 h-12 mb-2">
                <Ionicons name="location-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-2 text-gray-700"
                  placeholder="Search landmarks"
                  value={landmarkSearch}
                  onChangeText={setLandmarkSearch}
                />
              </View> */}
              {/* <TouchableOpacity
                 className="flex-row items-center border border-gray-300 rounded-md px-3 h-12 mb-2"
                  onPress={() => {
                    setSelectedLocationFilter('landmark');
                    clearAttributeFilter('micromarket');
                  }}
                >
                  <Text className="flex-1 ml-2 text-gray-700">
                    Landmark
                  </Text>
                </TouchableOpacity> */}
              {selectedLocationFilter === 'landmark' && (
                <LandmarkDropdownFilters
                  selectedLandmark={selectedLandmark}
                  setSelectedLandmark={setSelectedLandmark}
                />
              )}
              {/* {selectedLocationFilter === 'landmark' && (
                <SearchRadiusSlider attribute="radius" onApply={() => { }}

                />
              )} */}

              {selectedLocationFilter === 'micromarket' && (
                renderRefinementList(micromarketItems, refineMicromarket)
              )}
            </View>
          </View>

          {/* Inside Filters - Plot Size, Carpet Area, Ask Price/Sqft */}
          <RangeMoreFilters
            title={insideFilters[0].title}
            attribute={insideFilters[0].attribute}

          />

          <RangeMoreFilters
            title={insideFilters[1].title}
            attribute={insideFilters[1].attribute}

          />

          <RangeMoreFilters
            title={insideFilters[2].title}
            attribute={insideFilters[2].attribute}
          />

          {/* Facing Dropdown */}
          <View className="p-4 border border-gray-200 rounded-xl w-full mb-4">
            <Text className="font-semibold text-sm text-gray-700 mb-3">
              {insideFilters[3].title}
            </Text>
            <DropdownMoreFilters
              attribute={insideFilters[3].attribute}
              title="Please Select"
              type={insideFilters[3].type}
            />
          </View>

          {/* Floor Dropdown */}
          <View className="p-4 border border-gray-200 rounded-xl w-full mb-4">
            <Text className="font-semibold text-sm text-gray-700 mb-3">
              {insideFilters[4].title}
            </Text>
            <DropdownMoreFilters
              attribute={insideFilters[4].attribute}
              title="Please Select"
              type={insideFilters[4].type}
            />
          </View>

          {/* Status Refinement List */}
          <View className="p-4 border border-gray-200 rounded-xl w-full mb-4">
            <Text className="font-semibold text-sm text-gray-700 mb-3">
              {insideFilters[5].title}
            </Text>
            {renderRefinementList(statusItems, refineStatus)}
          </View>

          {/* Area Refinement List */}
          <View className="p-4 border border-gray-200 rounded-xl w-full mb-4">
            <Text className="font-semibold text-sm text-gray-700 mb-3">
              {insideFilters[6].title}
            </Text>
            {renderRefinementList(areaItems, refineArea)}
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            className="bg-[#153E3B] py-4 rounded-md items-center"
            onPress={handleToggle}
          >
            <Text className="font-semibold text-base text-white">Show Results</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default MoreFilters;