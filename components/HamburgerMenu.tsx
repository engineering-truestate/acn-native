import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Pressable, ScrollView, Alert, Image, Linking } from 'react-native';
import { Link, useRouter, usePathname } from 'expo-router';
import ProfileModal from '@/app/modals/ProfileModal';
import { Button } from 'react-native-elements/dist/buttons/Button';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logOut } from '@/store/slices/authSlice';
import { MaterialIcons, FontAwesome5, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import Tooltip from 'react-native-elements/dist/tooltip/Tooltip';
import { selectAdmin, selectName } from '@/store/slices/agentSlice';
import { toCapitalizedWords } from '@/app/helpers/common';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

interface MenuItem {
  title: string;
  path: string;
  icon: string;
  iconType: 'MaterialIcons' | 'FontAwesome5' | 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';
}

interface SidebarItemProps {
  onClick: () => void;
  icon: string;
  label?: string;
  selected: boolean;
  iconType: MenuItem['iconType'];
}

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', path: '/dashboardTab', icon: 'dashboard', iconType: 'MaterialIcons' },
  { title: 'Properties', path: '/properties', icon: 'home', iconType: 'MaterialIcons' },
  { title: 'Requirements', path: '/requirements', icon: 'list-alt', iconType: 'MaterialIcons' },
];

const bottomMenuItems: MenuItem[] = [
  { title: 'Billing', path: '/billings', icon: 'dollar-sign', iconType: 'Feather' },
  { title: 'Help', path: '/help', icon: 'help-circle', iconType: 'Feather' },
];

const getIconComponent = (type: MenuItem['iconType'], name: string, size: number = 24, color: string = '#252626') => {
  switch (type) {
    case 'MaterialIcons':
      return <MaterialIcons name={name as any} size={size} color={color} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={name as any} size={size} color={color} />;
    case 'Ionicons':
      return <Ionicons name={name as any} size={size} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    case 'Feather':
      return <Feather name={name as any} size={size} color={color} />;
    default:
      return <MaterialIcons name="error" size={size} color={color} />;
  }
};

const SidebarItem = forwardRef<View, SidebarItemProps>(({ onClick, icon, label, selected, iconType }, ref) => (
  <TouchableOpacity
    onPress={onClick}
    className={`flex flex-row items-center py-2 px-4 gap-2 ${selected ? 'bg-[#B9D7D2] rounded-lg' : ''}`}
    ref={ref}
  >
    {getIconComponent(iconType, icon, 18)}
    {label && <Text className="mt-1 font-sans text-lg text-[#252626] font-medium">{label}</Text>}
  </TouchableOpacity>
));

export const HamburgerMenu = ({ visible, onClose, onOpenProfile }: HamburgerMenuProps) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const agentName = useSelector(selectName);
  const monthlyCredits = useSelector((state: RootState) => state?.agent?.docData?.monthlyCredits);
  const isAuthenticated = useSelector((state: RootState) => state?.auth?.isAuthenticated);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  });

  const handleOverlayPress = () => {
    onClose();
  };

  const handleNavigation = (path: string) => {
    if (pathname === path) {
      onClose();
      return;
    }
    router.push(path as any);
    onClose();
  };

  const handleOpenProfile = () => {
    onOpenProfile();
    onClose();
  };

  const handleRequirementSubmit = () => {
    router.push('/(tabs)/UserRequirementForm');
    onClose();
  };

  const handleHelpClick = () => {
    router.push('/help' as any);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showTooltip) {
      timeoutId = setTimeout(() => {
        setShowTooltip(false);
      }, 1500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showTooltip]);

  if (!visible) return null;

  return (
    <>
      <Animated.View
        style={[
          styles.overlay,
          { opacity: overlayOpacity },
        ]}
      >
        <Pressable style={styles.overlayPressable} onPress={handleOverlayPress} />
      </Animated.View>

      <Animated.View
        style={[
          styles.menuContainer,
          { transform: [{ translateX }] },
        ]}
      >
        <ScrollView contentContainerStyle={[styles.menuContent, { flexGrow: 1 }]}>
          <View className="flex flex-col h-full">
            {/* Main Menu Items */}
            <View className="gap-3">
              {menuItems.map((item) => (
                <View className='flex flex-col gap-3'>
                <SidebarItem
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  icon={item.icon}
                  label={item.title}
                  selected={isActive(item.path)}
                  iconType={item.iconType}
                />
                </View>
              ))}

              <View className='flex flex-col gap-3 pr-[10]'>
              <TouchableOpacity
                onPress={handleRequirementSubmit}
                className="bg-[#153E3B] flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-[6px]"
              >
                <MaterialIcons name="post-add" size={20} color="#fff" />
                <Text className="text-white">Add Requirement</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://chat.whatsapp.com/KcirtDCrZkA3sdgS6WIB38')
                    .catch((err) => console.error('Failed to open URL:', err));
                }}
                className="flex flex-row items-center justify-center gap-2 border-[1px] border-[#153E3B] px-4 py-2 rounded-[6px]"
              >
                <FontAwesome5 name="whatsapp" size={20} color="#153E3B" />
                <Text className="text-[#153E3B] font-semibold">Join Community</Text>
              </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Menu Items */}
            <View className="mt-auto px-4 pb-10">
              {bottomMenuItems.map((item) => (
                <View className='flex flex-col pb-1'>
                <SidebarItem
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  icon={item.icon}
                  label={item.title}
                  selected={isActive(item.path)}
                  iconType={item.iconType}
                />
                </View>
              ))}

              {/* Credits Display */}
              <View className="flex flex-row justify-between items-center w-full border border-[#E3E3E3] rounded-[20px] px-4 py-3 mt-3">
                <View className="flex flex-row items-center gap-2">
                  <MaterialIcons name="monetization-on" size={20} color="#FFD700" />
                  <Text className="font-sans font-medium text-[14px] leading-[21px] text-[#5A5555]">
                    {monthlyCredits} Credits
                  </Text>
                </View>
                <View className="relative">
                  <TouchableOpacity onPress={() => setShowTooltip(!showTooltip)}>
                    <MaterialIcons name="info-outline" size={18} color="#5A5555" />
                  </TouchableOpacity>
                  {showTooltip && (
                    <View className="absolute top-[-40px] right-0 bg-[#2B2928] p-2 rounded-lg z-50 min-w-[180px] shadow-lg">
                      <Text className="text-[12px] text-white">1 Credit is used per enquiry.</Text>
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleOpenProfile}
                className={`flex flex-row items-center border border-[#E3E3E3] rounded-[6px] py-2 gap-2 mt-3 ${isActive('/profile') ? 'bg-[#B9D7D2]' : ''}`}
              >
                <View className="w-[28px] h-[28px] rounded-full bg-[#153E3B] items-center justify-center">
                  <MaterialIcons name="person" size={16} color="#fff" />
                </View>
                <View className="flex flex-col gap-1">
                  <Text className="text-[14px] text-[#2B2928] font-bold">{toCapitalizedWords(agentName) || 'Agent Name'}</Text>
                  <View className="flex flex-row items-center gap-1">
                    <Text className="text-[12px] text-[#205E59]">Check profile</Text>
                    <MaterialIcons name="arrow-forward" size={12} color="#205E59" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <ProfileModal
        visible={profileModalVisible}
        setVisible={setProfileModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 3,
  },
  overlayPressable: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.55,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    
  },
  menuContent: {
    paddingTop: 100,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
});