import React, { useState, useRef } from 'react';
import { View, Image, FlatList, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageCarouselProps {
  images: string[];
  onImagePress?: () => void;
}

const { width } = Dimensions.get('window');

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onImagePress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  if (!images || images.length === 0) {
    return (
      <View style={styles.placeholderContainer}>
        <Ionicons name="image-outline" size={48} color="#CCCCCC" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity 
        style={styles.imageItem} 
        activeOpacity={0.9}
        onPress={onImagePress}
      >
        <Image 
          source={{ uri: item }} 
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  const handlePageChange = (index: number) => {
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.floor(
            event.nativeEvent.contentOffset.x / width
          );
          setActiveIndex(newIndex);
        }}
      />
      
      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <TouchableOpacity 
            style={[styles.navButton, styles.leftButton]}
            disabled={activeIndex === 0}
            onPress={() => handlePageChange(activeIndex - 1)}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={activeIndex === 0 ? "#CCCCCC" : "#153E3B"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, styles.rightButton]}
            disabled={activeIndex === images.length - 1}
            onPress={() => handlePageChange(activeIndex + 1)}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={activeIndex === images.length - 1 ? "#CCCCCC" : "#153E3B"} 
            />
          </TouchableOpacity>
        </>
      )}
      
      {/* Page indicator */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View 
            key={index.toString()}
            style={[
              styles.paginationDot, 
              index === activeIndex && styles.activeDot
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  imageItem: {
    width,
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
});

export default ImageCarousel; 