import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from 'react-native-elements';
import KamManager from '@/app/modals/KamModal';

export const KamModalButton = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [kamModalVisible, setKamModalVisible] = useState(false);

  return (
    <>
      {isAuthenticated && (
        <>
          <KamManager
            visible={kamModalVisible}
            setVisible={setKamModalVisible}
          />
          <View style={styles.button}>
            <Button
              title="Kam"
              onPress={() => {
                setKamModalVisible(true);
              }}
              containerStyle={{ marginVertical: 10 }}
              buttonStyle={{ backgroundColor: '#007BFF' }}
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