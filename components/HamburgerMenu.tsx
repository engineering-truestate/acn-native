import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

interface MenuItem {
  title: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', path: '/settings' },
  { title: 'Properties', path: '/properties' },
  { title: 'Requirements', path: '/requirements' },

  { title: 'Add Requirements', path: '/+not-found' },
  { title: 'Join Community', path: 'https://chat.whatsapp.com/KcirtDCrZkA3sdgS6WIB38' },
  { title: 'Billing', path: '/billings' },
  { title: 'Help', path: '/+not-found' },
  { title: 'Credits', path: '/+not-found' },
  { title: 'Profile', path: '/+not-found' },
  // Add more menu items as needed
];

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setIsOpen(!isOpen);
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  });

  const handleOverlayPress = () => {
    if (isOpen) {
      toggleMenu();
    }
  };

  return (
    <>
      <TouchableOpacity onPress={toggleMenu} className="absolute top-10 left-5 z-20">
        <View className="w-7 h-5 flex justify-between">
          <View className={`h-0.75 bg-black rounded-md ${isOpen ? 'bg-black' : ''}`} />
          <View className={`h-0.75 bg-black rounded-md ${isOpen ? 'bg-black' : ''}`} />
          <View className={`h-0.75 bg-black rounded-md ${isOpen ? 'bg-black' : ''}`} />
        </View>
      </TouchableOpacity>
  
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(107, 107, 107, 0.64)',
            zIndex: 1,
          },
          { opacity: overlayOpacity, display: isOpen ? 'flex' : 'none' },
        ]}
      >
        <Pressable style={{ flex: 1 }} onPress={handleOverlayPress} />
      </Animated.View>
  
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            width: width * 0.8,
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 2,
          },
          { transform: [{ translateX }] },
        ]}
      >
        <View className="pt-24 pl-5">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.path} asChild>
              <TouchableOpacity
                className="py-4 border-b border-[#444]"
                onPress={() => {
                  toggleMenu();
                }}
              >
                <Text className="text-xl text-black">{item.title}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </Animated.View>
    </>
  );
}  