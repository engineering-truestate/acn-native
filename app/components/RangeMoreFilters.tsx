import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { useRange } from 'react-instantsearch';
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';

interface RangeMoreFiltersProps {
  attribute: string;
  transformFunction?: (value: any) => any;
}

const RangeMoreFilters = ({ attribute, transformFunction }: RangeMoreFiltersProps) => {
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
    <View style={isMobile ? styles.mobileRoot : styles.desktopRoot}>
      <View style={isMobile ? styles.mobileForm : styles.desktopForm}>
        <TextInput
          style={styles.input}
          placeholder={range.min?.toString() || 'Min'}
          value={minValue}
          onChangeText={setMinValue}
          keyboardType="numeric"
        />
        <Text style={styles.separator}>to</Text>
        <TextInput
          style={styles.input}
          placeholder={range.max?.toString() || 'Max'}
          value={maxValue}
          onChangeText={setMaxValue}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.submit} onPress={handleApply}>
        <Text style={styles.submitText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileRoot: {
    flexDirection: 'column',
    gap: 8,
  },
  desktopRoot: {
    flexDirection: 'row',
    gap: 8,
  },
  mobileForm: {
    width: '100%',
    maxWidth: '65%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  desktopForm: {
    width: '100%',
    maxWidth: '78%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginHorizontal: 8,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: '#5A5A5A',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: '#5A5A5A',
  },
  submit: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
});

export default RangeMoreFilters; 