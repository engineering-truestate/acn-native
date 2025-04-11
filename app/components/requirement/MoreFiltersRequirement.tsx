import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRefinementList } from 'react-instantsearch';

interface MoreFiltersRequirementProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleToggle: () => void;
}

const FilterSection = ({ attribute, title }: { attribute: string; title: string }) => {
  const { items, refine } = useRefinementList({ attribute });

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item.value}
          style={styles.filterItem}
          onPress={() => refine(item.value)}
        >
          <Switch
            value={item.isRefined}
            onValueChange={() => refine(item.value)}
            trackColor={{ false: '#E5E7EB', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
          <Text style={styles.filterLabel}>{item.label}</Text>
          <Text style={styles.filterCount}>({item.count})</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const MoreFiltersRequirement = ({
  isOpen,
  setIsOpen,
  handleToggle,
}: MoreFiltersRequirementProps) => {
  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleToggle}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>More Filters</Text>
            <TouchableOpacity onPress={handleToggle}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <FilterSection attribute="assetType" title="Asset Type" />
            <FilterSection attribute="configuration" title="Configuration" />
            <FilterSection attribute="budget.from" title="Budget Range" />
            <FilterSection attribute="location" title="Location" />
            <FilterSection attribute="status" title="Status" />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#374151',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  filterLabel: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  filterCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 16,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  clearButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#374151',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default MoreFiltersRequirement; 