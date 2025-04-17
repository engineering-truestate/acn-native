import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePagination } from 'react-instantsearch';

interface CustomPaginationProps {
  isSticky?: boolean;
}

export default function CustomPagination({ isSticky = false }: CustomPaginationProps) {
  const {
    currentRefinement,
    nbPages,
    refine,
    createURL,
  } = usePagination();

  return (
    <View style={[styles.container, isSticky && styles.stickyContainer]} >
      <TouchableOpacity
        onPress={() => refine(currentRefinement - 1)}
        disabled={currentRefinement === 0}
        style={[
          styles.button,
          styles.leftButton,
          currentRefinement === 0 && styles.disabledButton
        ]}
      >
        <Text style={[
          styles.buttonText,
          currentRefinement === 0 ? styles.disabledButtonText : styles.enabledButtonText
        ]}>
          Previous
        </Text>
      </TouchableOpacity>

      <View style={styles.pageInfo}>
        <Text style={styles.pageText}>
          Page {currentRefinement + 1} of {nbPages}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => refine(currentRefinement + 1)}
        disabled={currentRefinement === nbPages - 1}
        style={[
          styles.button,
          styles.rightButton,
          currentRefinement === nbPages - 1 && styles.disabledButton
        ]}
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
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  stickyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#153E3B',
  },
  leftButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  pageInfo: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
  },
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