import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface HamburgerMenuButtonProps {
  onPress: () => void;
  isOpen: boolean;
  showACN?: boolean
}

export const HamburgerMenuButton = ({ onPress, isOpen, showACN = false }: HamburgerMenuButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className='flex flex-row gap-10 items-center justify-start'>
        <View className="w-7 h-5 flex justify-between ml-[6px]">
          <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
          <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
          <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
        </View>
        {showACN &&
          <Text style={[
            styles.buttonLabel,
            { fontSize: 24, fontWeight: 'bold', fontFamily: 'MONTserrat_700Bold', color: '#153E3B' },
          ]}>
            ACN
          </Text>
        }
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
    backgroundColor: '#153E3B',
  },
  buttonLabel: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500',
    color: '#252626',
  },
}); 