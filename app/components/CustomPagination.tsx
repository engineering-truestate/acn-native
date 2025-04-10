import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePagination } from 'react-instantsearch';

interface CustomPaginationProps {
  isMobile?: boolean;
}

export default function CustomPagination({ isMobile = false }: CustomPaginationProps) {
  const {
    currentRefinement,
    nbPages,
    refine,
    createURL,
  } = usePagination();

  return (
    <View className={`flex-row justify-center items-center p-4 ${isMobile ? 'fixed bottom-0 w-full bg-white' : ''}`}>
      <TouchableOpacity
        onPress={() => refine(currentRefinement - 1)}
        disabled={currentRefinement === 0}
        className={`px-4 py-2 rounded-l-lg ${
          currentRefinement === 0 ? 'bg-gray-200' : 'bg-blue-500'
        }`}
      >
        <Text style={[
          styles.buttonText,
          currentRefinement === 0 ? styles.disabledButtonText : styles.enabledButtonText
        ]}>
          Previous
        </Text>
      </TouchableOpacity>

      <View className="px-4 py-2 bg-gray-100">
        <Text style={styles.pageText}>
          Page {currentRefinement + 1} of {nbPages}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => refine(currentRefinement + 1)}
        disabled={currentRefinement === nbPages - 1}
        className={`px-4 py-2 rounded-r-lg ${
          currentRefinement === nbPages - 1 ? 'bg-gray-200' : 'bg-blue-500'
        }`}
      >
        <Text style={[
          styles.buttonText,
          currentRefinement === nbPages - 1 ? styles.disabledButtonText : styles.enabledButtonText
        ]}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
  },
  enabledButtonText: {
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  pageText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#4B5563',
  },
}); 