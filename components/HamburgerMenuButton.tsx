import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface HamburgerMenuButtonProps {
  onPress: () => void;
  isOpen: boolean;
}

export const HamburgerMenuButton = ({ onPress, isOpen }: HamburgerMenuButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-7 h-5 flex justify-between ml-[6px]">
        <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
        <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
        <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hamburgerLine: {
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  hamburgerLineOpen: {
    backgroundColor: '#000',
  },
}); 