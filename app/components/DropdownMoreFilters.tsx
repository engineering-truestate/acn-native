import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useRefinementList } from 'react-instantsearch';
import { Ionicons } from '@expo/vector-icons';

interface DropdownMoreFiltersProps {
  attribute: string;
  title: string;
  type?: string;
  transformFunction?: (label: string) => string;
}

interface RefinementItem {
  value: string;
  label: string;
  count: number;
  isRefined: boolean;
}

const DropdownMoreFilters = ({ 
  attribute, 
  title, 
  type,
  transformFunction 
}: DropdownMoreFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { items, refine } = useRefinementList({
    attribute,
    limit: 50,
    transformItems: useCallback((items: RefinementItem[]) => 
      items.map((item) => ({
        ...item,
        label: transformFunction ? transformFunction(item.label) : item.label,
      })), [transformFunction])
  });

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleRefine = useCallback((value: string) => {
    refine(value);
  }, [refine]);

  const renderItems = useMemo(() => {
    return items.map((item) => (
      <TouchableOpacity
        key={item.value}
        style={[
          styles.refinementItem,
          item.isRefined && styles.refinementSelectedItem
        ]}
        onPress={() => handleRefine(item.value)}
      >
        <View style={styles.refinementLabel}>
          <Text style={styles.refinementText}>{item.label}</Text>
          <View style={styles.refinementCount}>
            <Text style={styles.countText}>{item.count}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }, [items, handleRefine]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isOpen && styles.buttonOpen
        ]}
        onPress={handleToggle}
      >
        <Text style={[
          styles.buttonText,
          isOpen && styles.buttonTextOpen
        ]}>
          {title}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={isOpen ? '#FFFFFF' : '#313131'}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={styles.dropdown}>
            <ScrollView style={styles.scrollView}>
              <View style={styles.refinementRoot}>
                <View style={styles.refinementList}>
                  {renderItems}
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  buttonOpen: {
    backgroundColor: '#0F2C2A',
    borderColor: '#0F2C2A',
  },
  buttonText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#313131',
  },
  buttonTextOpen: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    maxHeight: 200,
    margin: 16,
  },
  scrollView: {
    maxHeight: 200,
  },
  refinementRoot: {
    width: '100%',
  },
  refinementList: {
    padding: 8,
  },
  refinementItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  refinementSelectedItem: {
    backgroundColor: '#DFF4F3',
  },
  refinementLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refinementText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: '#313131',
  },
  refinementCount: {
    backgroundColor: '#E8ECEB',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 12,
    color: '#313131',
  },
});

export default React.memo(DropdownMoreFilters); 