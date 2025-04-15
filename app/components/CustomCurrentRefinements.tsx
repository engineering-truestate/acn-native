import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useClearRefinements, useCurrentRefinements } from 'react-instantsearch';
import { Button } from 'react-native-elements';

interface CustomCurrentRefinementsProps {
  selectedLandmark?: any;
  setSelectedLandmark?: (landmark: any) => void;
}

export default function CustomCurrentRefinements({
  selectedLandmark,
  setSelectedLandmark,
}: CustomCurrentRefinementsProps) {
  const { items, refine } = useCurrentRefinements();
  const { refine: clearRefinements } = useClearRefinements();

  if (items.length === 0 && !selectedLandmark) {
    return null;
  }

  console.log("selectedLandmark", selectedLandmark);
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
      >
        <View style={styles.content}>
          {selectedLandmark && (
            <TouchableOpacity
              onPress={() => {setSelectedLandmark && setSelectedLandmark(null)}}
              style={styles.chip}
            >
              <Text style={styles.chipText}>
                {selectedLandmark.name} ({selectedLandmark.radius/1000}km)
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
      {(items.length > 0 || selectedLandmark) && (
        <TouchableOpacity onPress={() => { clearRefinements(); { setSelectedLandmark && setSelectedLandmark(null); } }}>
          <View>
            <Text className='font-lato text-[#E11E1E] text-[12px] font-semibold'>Clear All</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
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