import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TouchableWithoutFeedback, BackHandler, LayoutChangeEvent, findNodeHandle } from 'react-native';
import { useRefinementList } from 'react-instantsearch';
import { Ionicons } from '@expo/vector-icons';

export interface RefinementItem {
  value: string;
  label: string;
  count: number;
  isRefined: boolean;
}

interface DropdownMoreFiltersProps {
  title: string;
  transformFunction?: (label: string) => string;
  items: RefinementItem[],
  refine: any,
  isAssetType?: boolean
}

const DropdownMoreFilters = ({
  title,
  items,
  refine,
  transformFunction,
  isAssetType = false
}: DropdownMoreFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ height: 0, width: 0 });
  const [maxItemWidth, setMaxItemWidth] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);
  
  // Handle back button press on Android to close dropdown
  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        setIsOpen(false);
        return true; // Prevent default behavior
      }
      return false; // Let default behavior happen
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      // Measure position just before opening
      if (buttonRef.current) {
        buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
          setButtonPosition({ x: pageX, y: pageY + height });
        });
      }
    }
    setIsOpen(prev => !prev);
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setDropdownLayout({ height, width });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleRefine = useCallback((value: string) => {
    refine(value);
  }, [refine]);

  // Calculate and track the width of the largest item
  const measureItemWidth = useCallback((item: RefinementItem) => {
    // Approximate width calculation based on character length
    const labelWidth = (item.label.length * 8) + 50; // Base width + padding
    const countWidth = (item.count.toString().length * 8) + 20; // Count width + padding
    const totalWidth = labelWidth + countWidth + 50; // Extra space for checkbox, etc.
    
    if (totalWidth > maxItemWidth) {
      setMaxItemWidth(totalWidth);
    }
  }, [maxItemWidth]);

  // Calculate all item widths when items change
  useEffect(() => {
    items.forEach(item => measureItemWidth(item));
  }, [items, measureItemWidth]);

  const dropdownWidth = useMemo(() => {
    const baseWidth = Math.max(dropdownLayout.width, maxItemWidth);
    return isAssetType ? baseWidth * 0.7 : baseWidth * 0.6;
  }, [dropdownLayout.width, maxItemWidth, title]);

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
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        ref={buttonRef}
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
        <Modal
          transparent={true}
          visible={isOpen}
          onRequestClose={handleClose}
          animationType="none"
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
          
          <View 
            style={{
              position: 'absolute',
              top: buttonPosition.y,
              left: buttonPosition.x-dropdownWidth*0.1,
              width: dropdownWidth,
              backgroundColor: 'white',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              zIndex: 1000
            }}
          >
            <ScrollView 
              style={{ maxHeight: 200 }}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              {renderItems}
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default React.memo(DropdownMoreFilters);