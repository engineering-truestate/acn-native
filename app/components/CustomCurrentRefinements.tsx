import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useCurrentRefinements } from 'react-instantsearch';

interface CustomCurrentRefinementsProps {
  selectedLandmark?: any;
  setSelectedLandmark?: (landmark: any) => void;
}

export default function CustomCurrentRefinements({
  selectedLandmark,
  setSelectedLandmark,
}: CustomCurrentRefinementsProps) {
  const { items, refine } = useCurrentRefinements();

  if (items.length === 0 && !selectedLandmark) {
    return null;
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <View style={styles.content}>
        {selectedLandmark && (
          <TouchableOpacity
            onPress={() => setSelectedLandmark?.(null)}
            style={styles.chip}
          >
            <Text style={styles.chipText}>
              {selectedLandmark.name} ({selectedLandmark.radius}km)
            </Text>
            <Text style={styles.removeIcon}>×</Text>
          </TouchableOpacity>
        )}

        {items.map((item) => (
          <View key={item.attribute}>
            {item.refinements.map((refinement) => (
              <TouchableOpacity
                key={refinement.value}
                onPress={() => refine(refinement)}
                style={styles.chip}
              >
                <Text style={styles.chipText}>
                  {refinement.label}
                </Text>
                <Text style={styles.removeIcon}>×</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  removeIcon: {
    fontSize: 16,
    color: '#6B7280',
  },
}); 