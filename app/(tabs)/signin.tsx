import { auth } from "../config/firebase";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,Alert, TextInput, Button } from "react-native";

 
export default function SignIn() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirm, setConfirm] = useState(false);
    const [code, setCode] = useState('');
    const [user, setUser] = useState<any>(null);

    const signInWithPhoneNumber = async () => {
        if (!phoneNumber.startsWith('+')) {
          Alert.alert('Error', 'Phone number must be in E.164 format (+91XXXXXXXXXX)')
          return;
        }
        
        try {
        //   const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        //   console.log("confirmation", confirmation);
          setConfirm(true);
        } catch (error: any) {
          Alert.alert('Error', error.message);
        }
      };
      const handleOTP = async () =>{
        setConfirm(false);
      }
    return (
        <View style={styles.container}>
          {!confirm ? (
            <>
              <TextInput
                placeholder="+91XXXXXXXXXX"
                style={styles.input}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <Button title="Send OTP" onPress={signInWithPhoneNumber} />
            </>
          ) : (
            <>
              <TextInput
                placeholder="Enter OTP"
                style={styles.input}
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
              />
              <Button title="Verify OTP" onPress={handleOTP} />
            </>
          )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    successText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
});