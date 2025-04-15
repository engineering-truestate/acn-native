import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useRefinementList } from 'react-instantsearch';
import { Ionicons } from '@expo/vector-icons';

interface RefinementItem {
  value: string;
  label: string;
  count: number;
  isRefined: boolean;
}

interface DropdownMoreFiltersProps {
  attribute: string;
  title: string;
  type?: string;
  transformFunction?: (label: string) => string;
  items: RefinementItem[], 
  refine: any,
}

const DropdownMoreFilters = ({
  attribute,
  title,
  items, 
  refine,
  type,
  transformFunction
}: DropdownMoreFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ height: 0 });

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  const handleLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    setDropdownLayout({ height });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleRefine = useCallback((value: string) => {
    refine(value);
  }, [refine]);

  const renderItems = useMemo(() => {
    return items.map((item, index) => {
      const isSelected = items.some(items => items.isRefined && items.label === item.label);

    return (
      <TouchableOpacity
        key={index}
        className="flex-row justify-between items-center py-2 px-3 border-b border-gray-100"
        onPress={() => handleRefine(item.value)}
      >
        <View className="flex-row items-center flex-1">
          <View className={`w-4 h-4 ${isSelected ? 'bg-[#153E3B]' : 'border border-gray-300'} rounded mr-2 items-center justify-center`}>
            {isSelected && (
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            )}
          </View>
          <Text className="text-gray-800">{item.label}</Text>
        </View>
        <View className="ml-2">
          <Text className="text-xs text-gray-600">{item.count}</Text>
        </View>

      </TouchableOpacity>
    );
  });
}, [items, handleRefine]);

return (
  <View className="relative">
    <TouchableOpacity
      className={`flex-row justify-between items-center px-3 py-2 ${isOpen ? 'bg-[#153E3B]' : 'bg-white border border-gray-300'} rounded-md`}
      onPress={handleToggle}
      onLayout={handleLayout}
    >
      <Text className={isOpen ? "text-white" : "text-gray-700"}>
        {title}
      </Text>
      <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={isOpen ? "#FFFFFF" : "#666"} />
    </TouchableOpacity>
    {isOpen && (
      <View
        className={`border border-gray-200 rounded-md bg-white shadow-sm z-10 absolute w-full ${isOpen ? 'visible' : 'invisible'}`}
        style={{ top: dropdownLayout.height + 8 }}
      >
        {renderItems}
      </View>
    )}
  </View>
);
};



export default React.memo(DropdownMoreFilters); 