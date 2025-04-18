import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from 'react-native-elements';
import KamManager from '@/app/modals/KamModal';
import KamModalIcon from '@/assets/icons/svg/KamModal';

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
                paddingHorizontal: 12,
              }}
              icon={
                <KamModalIcon/>
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
    marginRight: 10,
  },
});