import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, Pressable, PanResponder, Animated } from 'react-native';
import { useCurrentRefinements, useRefinementList } from 'react-instantsearch';
import DropdownMoreFilters from './DropdownMoreFilters';
import { Ionicons } from '@expo/vector-icons';
import BudgetRangeSlider from './requirement/BudgetRangeSlider';

interface MoreFiltersProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleToggle: () => void;
  isMobile: boolean;
  selectedLandmark?: any;
  setSelectedLandmark?: (landmark: any) => void;
}

// RangeInput component for number ranges
const RangeInput = ({ 
  title, 
  attribute, 
  minValue = '', 
  maxValue = '',
  onApply = () => {} 
}: { 
  title: string; 
  attribute: string; 
  minValue?: string; 
  maxValue?: string;
  onApply?: () => void 
}) => {
  // Start with empty values by default
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  // Apply the filter values
  const handleApply = () => {
    setHasApplied(true);
    onApply();
  };

  return (
    <View className="p-4 border border-gray-200 rounded-xl w-full mb-4">
      <Text className="font-semibold text-sm text-gray-700 mb-4">{title}</Text>
      <View className="flex-row items-center">
        <View className="flex-row items-center flex-1 justify-between">
          <TextInput
            className="h-12 w-[45%] border border-gray-300 rounded-md px-3 text-gray-700"
            placeholder="Min"
            value={min}
            onChangeText={setMin}
            keyboardType="numeric"
          />
          <Text className="text-gray-500">to</Text>
          <TextInput
            className="h-12 w-[45%] border border-gray-300 rounded-md px-3 text-gray-700"
            placeholder="Max"
            value={max}
            onChangeText={setMax}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity 
          className="bg-[#153E3B] py-3 px-4 rounded-md items-center ml-3"
          onPress={handleApply}
        >
          <Text className="text-white font-medium">Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Custom Slider component to replace the problematic RNCSlider
const CustomSlider = ({ 
  value = 5.8, 
  onValueChange,
  minimumValue = 1, 
  maximumValue = 10,
  step = 0.1,
  stopperPosition = 5.8
}: { 
  value: number; 
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  stopperPosition?: number;
}) => {
  const sliderRef = useRef<View>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  
  // Calculate the percentage position of the thumb
  const percentage = (value - minimumValue) / (maximumValue - minimumValue) * 100;
  const stopperPercentage = (stopperPosition - minimumValue) / (maximumValue - minimumValue) * 100;
  
  const handlePress = (event: any) => {
    if (sliderWidth === 0 || !sliderRef.current) return;
    
    sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
      const locationX = event.nativeEvent.locationX;
      if (locationX < 0 || locationX > width) return;
      
      // Calculate the new value based on position
      const newValue = minimumValue + (locationX / width) * (maximumValue - minimumValue);
      // Round to nearest step
      const steppedValue = Math.round(newValue / step) * step;
      // Ensure value is within range
      const clampedValue = Math.min(Math.max(steppedValue, minimumValue), maximumValue);
      
      onValueChange(Number(clampedValue.toFixed(1)));
    });
  };
  
  return (
    <View className="h-8 mb-2 justify-center">
      <View 
        ref={sliderRef}
        className="h-2 bg-gray-200 rounded-full"
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
      >
        {/* Track fill */}
        <View 
          className="absolute h-2 bg-[#153E3B] rounded-full" 
          style={{ width: `${percentage}%` }} 
        />
        
        {/* Stopper */}
        <View 
          className="absolute top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gray-400 rounded-full" 
          style={{ left: `${stopperPercentage}%` }}
        />
        
        {/* Thumb */}
        <Pressable 
          className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#153E3B]"
          style={{ left: `${percentage}%`, marginLeft: -10 }}
          onResponderMove={handlePress}
          onStartShouldSetResponder={() => true}
        />
      </View>
      
      {/* Hit area for the slider */}
      <Pressable 
        className="absolute w-full h-full"
        onPress={handlePress}
      />
    </View>
  );
};

// SearchRadiusSlider component with simpler implementation
const SearchRadiusSlider = ({ 
  attribute, 
  onApply 
}: { 
  attribute: string; 
  onApply: () => void 
}) => {
  // Use local state for radius instead of depending on Animated
  const [radius, setRadius] = useState(0); // Default to 0
  const [sliderWidth, setSliderWidth] = useState(0);
  
  // Handle slider track press to update radius directly
  const handleSliderPress = (event: any) => {
    if (sliderWidth === 0) return;
    
    const offsetX = event.nativeEvent.locationX;
    const percentage = Math.max(0, Math.min(100, (offsetX / sliderWidth) * 100));
    
    // Convert percentage to radius
    const newRadius = (percentage / 100) * 10;
    
    // Round to nearest 0.5 step
    const step = 0.5;
    const steppedRadius = Math.round(newRadius / step) * step;
    
    // Update radius
    setRadius(steppedRadius);
  };
  
  // Default stopper position at 5 km (50%)
  const stopperPercentage = 50;
  
  // Calculate thumb position based on current radius (as percentage of width)
  const thumbPercentage = (radius / 10);

  return (
    <View className="mt-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold text-sm text-gray-700">Search Radius (in km)</Text>
        <Ionicons name="information-circle-outline" size={18} color="#6B7280" />
      </View>
      
      <Text className="text-sm text-gray-700 font-medium mb-2">
        Selected: {radius.toFixed(1)} km
      </Text>

      {/* The slider container */}
      <View 
        className="h-8 mb-3"
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
      >
        {/* Slider track */}
        <TouchableOpacity 
          activeOpacity={0.8}
          className="h-2 bg-gray-200 rounded-full"
          onPress={handleSliderPress}
        >
          {/* Track fill */}
          <View 
            className="absolute h-2 bg-[#153E3B] rounded-full" 
            style={{ width: sliderWidth * thumbPercentage }} 
          />
          
          {/* Stopper */}
          <View 
            className="absolute top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gray-400 rounded-full" 
            style={{ left: sliderWidth * (stopperPercentage/100) }}
          />
          
          {/* Slider thumb */}
          <View 
            className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#153E3B]"
            style={{ 
              left: sliderWidth * thumbPercentage,
              marginLeft: -12, // Half of thumb width
              marginTop: -12, // Half of thumb height
              justifyContent: 'center',
              alignItems: 'center'
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Labels */}
      <View className="flex-row justify-between">
        <Text className="text-xs text-gray-500">0 km</Text>
        <Text className="text-xs text-gray-500">
          Default: 5 km
        </Text>
        <Text className="text-xs text-gray-500">10 km</Text>
      </View>
    </View>
  );
};

const MoreFilters = ({ 
  isOpen, 
  setIsOpen, 
  handleToggle, 
  isMobile, 
  selectedLandmark, 
  setSelectedLandmark 
}: MoreFiltersProps) => {
  const { items, refine } = useCurrentRefinements();
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('landmark');
  const [landmarkSearch, setLandmarkSearch] = useState('');

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
    { title: 'SBUA (sqft)', attribute: 'sbua', type: 'range', minValue: '428', maxValue: '90100' },
    { title: 'Total Ask Price (Lacs)', attribute: 'totalAskPrice', type: 'range', minValue: '30', maxValue: '8109' },
  ];

  const insideFilters = [
    { title: 'Plot Size (sqft)', attribute: 'plotSize', type: 'range', minValue: '1', maxValue: '198198' },
    { title: 'Carpet Area (sqft)', attribute: 'carpet', type: 'range', minValue: '365', maxValue: '16000' },
    { title: 'Ask Price/Sqft', attribute: 'askPricePerSqft', type: 'range', minValue: '', maxValue: '' },
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
            className={`py-2 px-3 border border-gray-300 rounded-md bg-white ${
              item.isRefined ? 'bg-[#DFF4F3] border-[#10B981]' : ''
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
          <TouchableOpacity onPress={handleToggle}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-2">
          {/* Asset Type & Configuration - First Row */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1 border border-gray-200 rounded-xl p-4">
              <Text className="font-semibold text-sm text-gray-700 mb-3">
                {outsideFilters[0].title}
              </Text>
              <DropdownMoreFilters
                attribute={outsideFilters[0].attribute}
                title="Please Select"
              />
            </View>
            
            <View className="flex-1 border border-gray-200 rounded-xl p-4">
              <Text className="font-semibold text-sm text-gray-700 mb-3">
                {outsideFilters[1].title}
              </Text>
              <DropdownMoreFilters
                attribute={outsideFilters[1].attribute}
                title="Please Select"
              />
            </View>
          </View>

          {/* SBUA Range */}
          <RangeInput
            title={outsideFilters[2].title}
            attribute={outsideFilters[2].attribute}
            minValue={outsideFilters[2].minValue}
            maxValue={outsideFilters[2].maxValue}
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
                  className={`flex-1 py-3 px-4 rounded-md ${
                    selectedLocationFilter === 'landmark' 
                      ? 'bg-white' 
                      : ''
                  }`}
                  onPress={() => {
                    setSelectedLocationFilter('landmark');
                    clearAttributeFilter('micromarket');
                  }}
                >
                  <Text className={`text-center font-medium ${
                    selectedLocationFilter === 'landmark' ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    Landmark
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className={`flex-1 py-3 px-4 rounded-md ${
                    selectedLocationFilter === 'micromarket' 
                      ? 'bg-white' 
                      : ''
                  }`}
                  onPress={() => {
                    setSelectedLocationFilter('micromarket');
                    setSelectedLandmark?.(null);
                  }}
                >
                  <Text className={`text-center font-medium ${
                    selectedLocationFilter === 'micromarket' ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    Micromarket
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Input */}
            <View className="p-4">
              <View className="flex-row items-center border border-gray-300 rounded-md px-3 h-12 mb-2">
                <Ionicons name="location-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-2 text-gray-700"
                  placeholder="Search landmarks"
                  value={landmarkSearch}
                  onChangeText={setLandmarkSearch}
                />
              </View>

              {selectedLocationFilter === 'landmark' && (
                <SearchRadiusSlider attribute="radius" onApply={() => {}} />
              )}

              {selectedLocationFilter === 'micromarket' && (
                renderRefinementList(micromarketItems, refineMicromarket)
              )}
            </View>
          </View>

          {/* Inside Filters - Plot Size, Carpet Area, Ask Price/Sqft */}
          <RangeInput
            title={insideFilters[0].title}
            attribute={insideFilters[0].attribute}
            minValue={insideFilters[0].minValue}
            maxValue={insideFilters[0].maxValue}
          />

          <RangeInput
            title={insideFilters[1].title}
            attribute={insideFilters[1].attribute}
            minValue={insideFilters[1].minValue}
            maxValue={insideFilters[1].maxValue}
          />

          <RangeInput
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