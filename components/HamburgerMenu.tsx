import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

interface MenuItem {
  title: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { title: 'Home', path: '/' },
  { title: 'Profile', path: '/profile' },
  { title: 'Settings', path: '/settings' },
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
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
        <View style={styles.hamburgerIcon}>
          <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
          <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
          <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
        </View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
            display: isOpen ? 'flex' : 'none',
          },
        ]}
      >
        <Pressable style={styles.overlayPressable} onPress={handleOverlayPress} />
      </Animated.View>

      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.menuContent}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.path} asChild>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  toggleMenu();
                }}
              >
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
  },
  hamburgerIcon: {
    width: 30,
    height: 20,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  hamburgerLineOpen: {
    backgroundColor: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  overlayPressable: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: '100%',
    backgroundColor: '#333',
    zIndex: 2,
  },
  menuContent: {
    paddingTop: 100,
    paddingLeft: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  menuItemText: {
    fontSize: 18,
    color: '#fff',
  },
}); 