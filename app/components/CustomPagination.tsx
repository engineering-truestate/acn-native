import React, { RefObject, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useInstantSearch, usePagination } from 'react-instantsearch';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

interface CustomPaginationProps {
  isSticky?: boolean;
  scrollRef?: RefObject<ScrollView> | null;
}

export default function CustomPagination({ isSticky = false, scrollRef = null }: CustomPaginationProps) {

  const [loading, setLoading] = useState(false);

  const {
    currentRefinement,
    nbPages,
    refine,
    createURL,
  } = usePagination();

  const { status } = useInstantSearch();

  useEffect(() => {
    if (status === 'loading' && loading === true && scrollRef?.current)
      scrollRef.current.scrollTo({ y: 0, animated: true })
    setLoading(status === 'loading');
  }, [status]);

  return (
    <View style={[styles.container, isSticky && styles.stickyContainer]} >
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          setLoading(true);
          setTimeout(() => {
            refine(currentRefinement - 1)
          }, 0)
        }}
        disabled={currentRefinement === 0 || loading}
        style={[
          styles.button,
          styles.leftButton,
          (currentRefinement === 0 || loading) && styles.disabledButton
        ]}
      >
        <Text style={[
          styles.buttonText,
          currentRefinement === 0 || loading ? styles.disabledButtonText : styles.enabledButtonText
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
        onPress={() => {
          Keyboard.dismiss()
          setLoading(true);
          setTimeout(() => {
            refine(currentRefinement + 1)
          }, 0)
        }}
        disabled={currentRefinement === nbPages - 1 || loading}
        style={[
          styles.button,
          styles.rightButton,
          (currentRefinement === nbPages - 1 || loading) && styles.disabledButton
        ]}
      >
        <Text style={[
          styles.buttonText,
          currentRefinement === nbPages - 1 || loading ? styles.disabledButtonText : styles.enabledButtonText
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