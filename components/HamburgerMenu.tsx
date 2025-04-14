import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';
import ProfileModal from '@/app/modals/ProfileModal';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const { width } = Dimensions.get('window');

interface MenuItem {
  title: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', path: '/dashboard' },
  { title: 'Properties', path: '/properties' },
  { title: 'Requirements', path: '/requirements' },

  { title: 'Add Requirements', path: '/UserRequirementForm' },
  { title: 'Join Community', path: 'https://chat.whatsapp.com/KcirtDCrZkA3sdgS6WIB38' },
  { title: 'Billing', path: '/billings' },
  { title: 'Help', path: '/help' },
  // this is not to be done like this, it has to be a design elimante not a route
  { title: 'Credits', path: '/+not-found' },
  // Add more menu items as needed
];

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

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
      {isAuthenticated &&
        <>
          <TouchableOpacity onPress={toggleMenu} className="absolute top-10 left-5 z-20">
            <View className="w-7 h-5 flex justify-between">
              <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
              <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
              <View style={[styles.hamburgerLine, isOpen && styles.hamburgerLineOpen]} />
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
              <ProfileModal
                visible={profileModalVisible}
                setVisible={setProfileModalVisible}
              />
              <Button
                title="Profile"
                onPress={() => {
                  setProfileModalVisible(true);
                  toggleMenu();
                }}
                containerStyle={{ marginVertical: 10 }}
                buttonStyle={{ backgroundColor: '#007BFF' }}
              />
            </View>
          </Animated.View>
        </>
      }
    </>
  );
}




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
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(107, 107, 107, 0.64)',
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
    backgroundColor: '#fff',
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
    color: '#000',
  },
});