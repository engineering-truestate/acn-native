import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from 'react-native-elements';
import KamManager from '@/app/modals/KamModal';
import KamModalIcon from '../assets/icons/KamModal.png';

export const KamModalButton = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const pathName = usePathname();
  const [kamModalVisible, setKamModalVisible] = useState(false);

  return (
    <>
      {(isAuthenticated && pathName != "/" && pathName != "/components/Auth/Signin" && pathName != "/components/Auth/OTPage" && pathName != "/components/Auth/BlacklistedPage" && pathName != "/components/Auth/VerificationPage") && (
        <>
          <KamManager
            visible={kamModalVisible}
            setVisible={setKamModalVisible}
          />
          <View style={styles.button}>
            <Button
              onPress={() => {
                setKamModalVisible(true);
              }}
              containerStyle={{ marginVertical: 10 }}
              buttonStyle={{
                backgroundColor: '#153E3B',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              icon={
                <Image
                  source={require('../assets/icons/KamModal.webp')}
                  style={{ width: 24, height: 24 }} // You can adjust the size
                />
              }
            />

          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
  },
});