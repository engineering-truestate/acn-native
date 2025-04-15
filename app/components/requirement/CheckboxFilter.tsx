import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRefinementList } from 'react-instantsearch';
import { useSelector } from 'react-redux';

interface RootState {
  agent: {
    docData: {
      cpId: string;
    };
  };
}

const CheckboxFilter = ({ attribute }: { attribute: string }) => {
  const cpId = useSelector((state: RootState) => state.agent?.docData?.cpId);
  const { items, refine } = useRefinementList({ attribute });
  const [isToggled, setIsToggled] = useState(
    items.some(item => item.value === cpId && item.isRefined)
  );

  const handleToggle = () => {
    const shouldRefine = !isToggled;
    setIsToggled(shouldRefine);
    refine(cpId);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleToggle}>
      <View style={styles.checkbox}>
        {isToggled && <View style={styles.checkboxInner} />}
      </View>
      <Text style={styles.label}>My Requirements</Text>
    </TouchableOpacity>
  );
};

export default CheckboxFilter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#b5b3b3',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#b5b3b3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#103D35', // Primary color
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
