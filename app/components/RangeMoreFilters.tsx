import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useRange } from 'react-instantsearch';
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';


interface RangeMoreFiltersProps {
  title:string;
  attribute: string;
  transformFunction?: (value: any) => any;
}

const RangeMoreFilters = ({title, attribute, transformFunction }: RangeMoreFiltersProps) => {
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width <= 640);
  const { start, range, refine } = useRange({ attribute });
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(window.width <= 640);
    });

    return () => subscription.remove();
  }, []);

  const handleApply = () => {
    const min = minValue ? Number(minValue) : range.min;
    const max = maxValue ? Number(maxValue) : range.max;
    refine([min, max]);
  };

  return (
    <View className="p-4 border border-gray-200 rounded-xl w-full mb-4">
      <Text className="font-semibold text-sm text-gray-700 mb-4">{title}</Text>
      <View className="flex-row items-center">
        <View className="flex-row items-center flex-1 justify-between">
          <TextInput
            className="h-12 w-[45%] border border-gray-300 rounded-md px-3 text-gray-700"
            placeholder={range.min?.toString() || 'Min'}
            value={minValue}
            onChangeText={setMinValue}
            keyboardType="numeric"
          />
          <Text className="text-gray-500">to</Text>
          <TextInput
            className="h-12 w-[45%] border border-gray-300 rounded-md px-3 text-gray-700"
            placeholder={range.max?.toString() || 'Max'}
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