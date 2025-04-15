import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Dimensions } from 'react-native';

interface RangeMoreFiltersProps {
  title: string;
  // attribute: string;
  transformFunction?: (value: number) => string | number;
  refine: (range: [number, number]) => void;
  // currentRefinement?: [number | undefined, number | undefined];
  range: { min?: number; max?: number }; // Add range prop
  start: (number | undefined)[]; // Add start prop
}

const RangeMoreFilters: React.FC<RangeMoreFiltersProps> = ({
  title,
  // attribute,
  transformFunction,
  refine,
  range,
  start,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(Dimensions.get('window').width <= 640);

  const formatValue = (value: string | number | undefined): string => {
    if (value === undefined || value === '') return '';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return transformFunction && typeof numValue === 'number'
      ? transformFunction(numValue).toString()
      : String(value);
  };
  
  const [minValue, setMinValue] = useState<string>(
    start && start[0] !== undefined && start[0] !== -Infinity
      ? start[0].toString()
      : ""
  );
  const [maxValue, setMaxValue] = useState<string>(
    start && start[1] !== undefined && start[1] !== Infinity
      ? start[1].toString()
      : ""
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(window.width <= 640);
    });

    return () => subscription.remove();
  }, []);

  const handleApply = (): void => {
    const min: number = minValue ? Number(minValue) : (range.min ?? 0);
    const max: number = maxValue ? Number(maxValue) : (range.max ?? 0);
    
    refine([min, max]);
  };

  return (
    <View className="p-4 border border-gray-200 rounded-xl w-full mb-4">
      <Text className="font-semibold text-sm text-gray-700 mb-4">{title}</Text>
      <View className="flex-row items-center">
        <View className="flex-row items-center flex-1 justify-between">
          <TextInput
            className="h-12 w-[45%] border border-gray-300 rounded-md px-3 text-gray-700"
            placeholder={formatValue(range.min) || 'Min'}
            value={minValue}
            onChangeText={setMinValue}
            keyboardType="numeric"
          />
          <Text className="text-gray-500">to</Text>
          <TextInput
            className="h-12 w-[45%] border border-gray-300 rounded-md px-3 text-gray-700"
            placeholder={formatValue(range.max) || 'Max'}
            value={maxValue}
            onChangeText={setMaxValue}
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

export default RangeMoreFilters;