import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput, Button, Modal } from "react-native";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { signIn, handleSessionTimeout, logOut ,} from '../redux/authSlice';
import {
    setPhonenumber,
    setAgentDataState,
    listenToAgentChanges,
    selectVerified,
    selectBlacklisted,
} from '../redux/agentSlice';
import { addDoc, collection } from 'firebase/firestore';7
import { db } from '../config/firebase';
//import appCheck from '@react-native-firebase/app-check';
interface CountryCode {
    value: string;
    label: string;
    countryName: string;
    key: string;
}

const defaultCountryCodes: CountryCode[] = [
    { value: '+91', label: '+91', countryName: 'India', key: '+91-India' },
    { value: '+1', label: '+1', countryName: 'USA', key: '+1-USA' },
    { value: '+44', label: '+44', countryName: 'UK', key: '+44-UK' }
];

// Find India's country code from default codes
const defaultIndiaCode = defaultCountryCodes.find((code: CountryCode) => code.value === '+91') || defaultCountryCodes[0];

interface NewAgent {
    phonenumber: string;
    admin: boolean;
    blacklisted: boolean;
    verified: boolean;
    added: number;
    lastModified: number;
}

export default function SignIn() {
    const dispatch = useDispatch<AppDispatch>();
    const isVerified = useSelector(selectVerified);
    const isBlacklisted = useSelector(selectBlacklisted);
    //const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated)
    const [errorMessage, setErrorMessage] = useState('');
    const [isAgentInDb, setIsAgentInDb] = useState(false);
    
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneInput, setPhoneInput] = useState('');
    const [confirm, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
    const [code, setCode] = useState('');
    const [user, setUser] = useState<any>(null);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [countryCodes, setCountryCodes] = useState<CountryCode[]>(defaultCountryCodes);
    const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>(defaultIndiaCode);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [customCountryCode, setCustomCountryCode] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [addingNewAgent, setAddingNewAgent] = useState(false);
    const [appCheckInitialized, setAppCheckInitialized] = useState(false);

    const handleSignOut = () => {
        auth().signOut();
        dispatch(logOut());
        setConfirm(null);
        setCode('');
    };

    useEffect(() => {
        const fetchCountryCodes = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                const data = await response.json();
                const codes = data
                    .filter((country: any) => country.idd?.root && country.idd?.suffixes)
                    .map((country: any) => {
                        const countryCode = "+" + country.idd.root.replace("+", "") + country.idd.suffixes[0];
                        return {
                            value: countryCode,
                            label: countryCode,
                            countryName: country.name.common,
                            key: `${countryCode}-${country.name.common}`
                        };
                    })
                    .sort((a: CountryCode, b: CountryCode) => a.value.localeCompare(b.value));
                
                if (codes.length > 0) {
                    // Find India in the fetched codes or use default
                    const indiaCode = codes.find((code: CountryCode) => code.value === '+91') || defaultIndiaCode;
                    setCountryCodes(codes);
                    setSelectedCountryCode(indiaCode);
                }
            } catch (error) {
                console.error("Error fetching country codes:", error);
                Alert.alert('Error', 'Failed to load country codes. Using default codes.');
                setCountryCodes(defaultCountryCodes);
                setSelectedCountryCode(defaultIndiaCode);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCountryCodes();
    }, []);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
            console.log('🔐 Auth State Changed:', {
                userId: firebaseUser?.uid,
                phoneNumber: firebaseUser?.phoneNumber,
                isNewUser: firebaseUser?.metadata.creationTime === firebaseUser?.metadata.lastSignInTime
            });
            setUser(firebaseUser);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0 && !canResend) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [resendTimer, canResend]);

    useEffect(() => {
        // Listen to agent changes when user is authenticated
        if (user) {
            console.log('🔄 Setting up agent listener for:', user.phoneNumber);
            dispatch(listenToAgentChanges(user.phoneNumber));
        }
    }, [user, dispatch]);

    // Separate useEffect for verification checks to avoid race conditions
    useEffect(() => {
        if (!user) {
            console.log('⏳ No user, skipping verification check');
            return;
        }

        // Wait for agent data to be loaded
        if (!isAgentInDb) {
            console.log('⏳ Waiting for agent data to load...');
            return;
        }

        console.log('👤 Verification Check:', {
            isVerified,
            isBlacklisted,
            isAgentInDb,
            hasUser: !!user,
            phoneNumber: user?.phoneNumber
        });

        // Only proceed with checks if we have all required data
        if (isBlacklisted) {
            console.log('❌ User is blacklisted');
            Alert.alert(
                'Account Blocked',
                'Your account has been blacklisted. Please contact support for assistance.',
                [{ text: 'OK', onPress: handleSignOut }]
            );
            return;
        }

        // Skip verification check for new users
        if (!isVerified) {
            // Double check with agent data before showing the alert
            const agentState = (window as any)?.__reduxStore?.getState()?.agent;
            const isActuallyVerified = agentState?.docData?.verified;
            
            console.log('🔍 Double checking verification:', {
                reduxVerified: isVerified,
                firestoreVerified: isActuallyVerified
            });

            if (!isActuallyVerified) {
                console.log('⚠️ User not verified (confirmed)');
                Alert.alert(
                    'Verification Required',
                    'Your account is not yet verified. Please wait for verification or contact support.',
                    [{ text: 'OK', onPress: handleSignOut }]
                );
            } else {
                console.log('✅ User is actually verified, ignoring false negative');
            }
        } else {
            console.log('✅ User is verified');
        }
    }, [user, isVerified, isBlacklisted, isAgentInDb]);

    // useEffect(() => {
    //     // Initialize App Check
    //     const initializeAppCheck = async () => {
    //         try {
    //             console.log('Initializing App Check');
            
    //             // Enable App Check debug mode in development
    //             if (__DEV__) {
    //                 await appCheck().activate('debug');
    //             } else {
    //                 // In production, use your reCAPTCHA v3 site key
    //                 await appCheck().activate('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
    //             }
    //             console.log('App Check initialized successfully');
    //             setAppCheckInitialized(true);
    //         } catch (error) {
    //             console.error('Error initializing App Check:', error);
    //             // Continue without App Check in case of error
    //             setAppCheckInitialized(true);
    //         }
    //     };

    //     initializeAppCheck();
    // }, []);

    // const verifyAppCheck = async () => {
    //     try {
            
    //         const token = await appCheck().getToken(true);
    //         console.log('App Check token:', token);
    //         return !!token;
    //     } catch (error) {
    //         console.error('App Check verification failed:', error);
    //         return true; // Continue without App Check in case of error
    //     }
    // };

    const handlePhoneInputChange = (value: string) => {
        const regex = /^[0-9\b]+$/;
        if (value === "" || (regex.test(value) && !value.startsWith("0"))) {
            setPhoneInput(value);
            if (selectedCountryCode) {
                const fullPhoneNumber = selectedCountryCode.value + value;
                setPhoneNumber(fullPhoneNumber);
                
                if (value.length > 0) {
                    const number = parsePhoneNumberFromString(fullPhoneNumber);
                    setIsValid(number?.isValid() || false);
                } else {
                    setIsValid(false);
                }
            }
        }
    };

    const getUnixDateTime = () => {
        return Math.floor(Date.now());
    };

    const handleNewAgent = async () => {
        if (phoneNumber && isValid && !isAgentInDb && !addingNewAgent) {
            console.log('📝 Creating new agent:', { phoneNumber, isValid });
            setAddingNewAgent(true);
            try {
                const newAgent: NewAgent = {
                    phonenumber: phoneNumber,
                    admin: false,
                    blacklisted: false,
                    verified: true,
                    added: getUnixDateTime(),
                    lastModified: getUnixDateTime(),
                };

                const docRef = await addDoc(collection(db, 'agents'), newAgent);
                console.log("✅ New agent added with ID:", docRef.id, newAgent);
                
                const result = await dispatch(setAgentDataState(phoneNumber)).unwrap();
                console.log("📊 Agent data state result:", result);
                
                if (result?.docId) {
                    setIsAgentInDb(true);
                    dispatch(listenToAgentChanges(result.docId));
                    await signInWithPhoneNumber();
                }
            } catch (error: any) {
                console.error("❌ Error adding new agent:", error);
                setErrorMessage("There was an error adding the agent. Please try again.");
            } finally {
                setAddingNewAgent(false);
            }
        }
    };

    const handleCheckUser = async () => {
        try {
            console.log('🔍 Checking user:', { phoneNumber, isValid });
            
            if (!isValid) {
                setErrorMessage("Please enter a valid phone number and country code.");
                return;
            }

            // Log analytics event
            try {
                await analytics().logEvent('sign_in_button_clicked');
            } catch (analyticsError) {
                console.warn('Analytics error:', analyticsError);
            }

            // First check if user exists in database
            console.log('📊 Checking if user exists in database...');
            const result = await dispatch(setAgentDataState(phoneNumber)).unwrap();
            console.log("📱 User check result:", {
                found: !!result?.docId,
                docId: result?.docId,
                phoneNumber
            });
            
            if (result?.docId) {
                console.log('✅ Existing user found, setting up listener');
                setIsAgentInDb(true);
                dispatch(listenToAgentChanges(result.docId));
                
                // Check if user is blacklisted before sending OTP
                if (result.docData?.blacklisted) {
                    Alert.alert(
                        'Account Blocked',
                        'Your account has been blacklisted. Please contact support for assistance.'
                    );
                    return;
                }
                
                // Proceed with OTP
                console.log('📤 Proceeding to send OTP...');
                await signInWithPhoneNumber();
            } else {
                console.log('🆕 New user, creating agent');
                setIsAgentInDb(false);
                await handleNewAgent();
            }
        } catch (error: any) {
            console.error("❌ Error checking user:", error);
            setErrorMessage(error?.message || "An error occurred while checking user status.");
        } finally {
            dispatch(setPhonenumber(phoneNumber));
        }
    };

    const signInWithPhoneNumber = async () => {
        setIsSendingOTP(true);
        setErrorMessage(""); // Reset any previous errors

        try {
            console.log('📱 Attempting to send OTP to:', phoneNumber);
            
            // Configure reCAPTCHA verifier if needed
            if (!auth().settings.appVerificationDisabledForTesting) {
                console.log('⚠️ Warning: App verification is enabled. Make sure reCAPTCHA is configured.');
            }

            // Send OTP using Firebase
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
            console.log('✅ OTP sent successfully, confirmation received');
            
            setConfirm(confirmation);
            setResendTimer(30);
            setCanResend(false);
            setErrorMessage('');

            // Show success message to user
            Alert.alert('Success', 'OTP has been sent to your phone number.');

        } catch (error: any) {
            console.error("❌ Error during OTP send:", {
                message: error.message,
                code: error.code,
                nativeErrorMessage: error.nativeErrorMessage
            });
            
            // Handle specific error cases
            if (error.code === 'auth/invalid-phone-number') {
                setErrorMessage("Please enter a valid phone number.");
            } else if (error.code === 'auth/too-many-requests') {
                setErrorMessage("Too many attempts. Please try again later.");
            } else if (error.code === 'auth/operation-not-allowed') {
                setErrorMessage("Phone authentication is not enabled. Please contact support.");
            } else {
                setErrorMessage(error.message || "Failed to send OTP. Please try again.");
            }
        } finally {
            startResendTimer();
            setIsSendingOTP(false);
        }
    };

    const resendOTP = async () => {
        if (!canResend) return;
        
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
            setResendTimer(30);
            setCanResend(false);
            Alert.alert('Success', 'OTP has been resent successfully');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const confirmCode = async () => {
        if (!code || code.length < 6) {
            setErrorMessage('Please enter a valid 6-digit OTP');
            return;
        }
        try {
            console.log('🔑 Confirming OTP code');
            const credential = await confirm?.confirm(code);
            console.log('✅ OTP confirmed successfully');
            
            if (credential?.user?.phoneNumber) {
                console.log('👤 User authenticated:', {
                    uid: credential.user.uid,
                    phoneNumber: credential.user.phoneNumber
                });
                
                // First update auth state
                setUser(credential.user);
                dispatch(signIn());
                
                // Then fetch agent data
                const result = await dispatch(setAgentDataState(credential.user.phoneNumber)).unwrap();
                console.log('📊 Agent data after OTP:', {
                    hasDocId: !!result?.docId,
                    docData: result?.docData,
                    verified: result?.docData?.verified
                });

                if (result?.docId) {
                    dispatch(listenToAgentChanges(result.docId));
                    setErrorMessage('');
                } else {
                    console.error('❌ No agent document found after OTP confirmation');
                    setErrorMessage('Failed to load user data. Please try again.');
                    handleSignOut();
                }
            } else {
                console.error('❌ No user or phone number after OTP confirmation');
                setErrorMessage('Failed to sign in. Please try again.');
            }
        } catch (error) {
            console.error('❌ OTP confirmation error:', error);
            setErrorMessage('Invalid OTP code.');
        }
    };

    const handleCountryCodeSelect = (country: CountryCode) => {
        setSelectedCountryCode(country);
        setShowCountryPicker(false);
        // Update phone number with new country code if there's existing input
        if (phoneInput) {
            const fullPhoneNumber = country.value + phoneInput;
            setPhoneNumber(fullPhoneNumber);
            const number = parsePhoneNumberFromString(fullPhoneNumber);
            setIsValid(number?.isValid() || false);
        }
    };

    const handleCustomCountryCode = (value: string) => {
        // Only allow numbers and + sign
        const regex = /^\+?[0-9]*$/;
        if (regex.test(value)) {
            setCustomCountryCode(value);
        }
    };

    const applyCustomCountryCode = () => {
        if (customCountryCode) {
            const code = customCountryCode.startsWith('+') ? customCountryCode : `+${customCountryCode}`;
            const customCode: CountryCode = {
                value: code,
                label: code,
                countryName: 'Custom',
                key: `${code}-Custom`
            };
            handleCountryCodeSelect(customCode);
            setCustomCountryCode('');
            setShowCustomInput(false);
        }
    };

    const startResendTimer = () => {
        setCanResend(false);
        setResendTimer(30);

        const interval = setInterval(() => {
            setResendTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    if (user) {
        return (
            <View style={styles.container}>
                <Text style={styles.successText}>✅ Signed in as {user.phoneNumber}</Text>
                <Button title="Sign Out" onPress={handleSignOut} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            
            {!confirm ? (
                <>
                    <View style={styles.phoneInputContainer}>
                        <TouchableOpacity 
                            style={styles.countryCodeButton}
                            onPress={() => setShowCountryPicker(true)}
                            disabled={isLoading}
                        >
                            <Text style={styles.countryCodeText}>
                                {isLoading ? 'Loading...' : selectedCountryCode.value}
                            </Text>
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Phone Number"
                            style={styles.phoneInput}
                            keyboardType="phone-pad"
                            value={phoneInput}
                            onChangeText={handlePhoneInputChange}
                            maxLength={10}
                        />
                    </View>
                    <Button 
                        title="Send OTP" 
                        onPress={handleCheckUser}
                        disabled={!isValid || isLoading}
                    />
                </>
            ) : (
                <>
                    <TextInput
                        placeholder="Enter 6-digit OTP"
                        style={styles.input}
                        keyboardType="number-pad"
                        value={code}
                        onChangeText={setCode}
                        maxLength={6}
                    />
                    <Button title="Verify OTP" onPress={confirmCode} />
                    <View style={styles.resendContainer}>
                        <Text style={styles.timerText}>
                            {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                        </Text>
                        <TouchableOpacity 
                            onPress={resendOTP} 
                            disabled={!canResend}
                            style={[styles.resendButton, !canResend && styles.disabledButton]}
                        >
                            <Text style={styles.resendButtonText}>Resend</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <Modal
                visible={showCountryPicker}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Country Code</Text>
                        
                        {!showCustomInput ? (
                            <TouchableOpacity 
                                style={styles.customCodeButton}
                                onPress={() => setShowCustomInput(true)}
                            >
                                <Text style={styles.customCodeText}>+ Enter Custom Code</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.customInputContainer}>
                                <TextInput
                                    style={styles.customCodeInput}
                                    placeholder="Enter country code (e.g., +91)"
                                    value={customCountryCode}
                                    onChangeText={handleCustomCountryCode}
                                    keyboardType="phone-pad"
                                    maxLength={6}
                                />
                                <View style={styles.customCodeButtons}>
                                    <Button 
                                        title="Apply" 
                                        onPress={applyCustomCountryCode}
                                        disabled={!customCountryCode}
                                    />
                                    <Button 
                                        title="Cancel" 
                                        onPress={() => {
                                            setShowCustomInput(false);
                                            setCustomCountryCode('');
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        <ScrollView style={styles.countryList}>
                            {countryCodes.map((country) => (
                                <TouchableOpacity
                                    key={country.key}
                                    style={[
                                        styles.countryItem,
                                        selectedCountryCode.value === country.value && styles.selectedCountryItem
                                    ]}
                                    onPress={() => handleCountryCodeSelect(country)}
                                >
                                    <Text style={styles.countryText}>
                                        {country.countryName} ({country.value})
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Button title="Close" onPress={() => setShowCountryPicker(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    countryCodeButton: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRightWidth: 0,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: '#f5f5f5',
        minWidth: 60,
        alignItems: 'center',
    },
    countryCodeText: {
        fontSize: 16,
    },
    phoneInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 12,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
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
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    timerText: {
        marginRight: 8,
        color: '#666',
    },
    resendButton: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    resendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    countryList: {
        maxHeight: 300,
    },
    countryItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedCountryItem: {
        backgroundColor: '#e6f2ff',
    },
    countryText: {
        fontSize: 16,
    },
    customCodeButton: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    customCodeText: {
        fontSize: 16,
        color: '#007AFF',
    },
    customInputContainer: {
        marginBottom: 16,
    },
    customCodeInput: {
        borderWidth: 1,
        borderColor: '#aaa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    customCodeButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
        textAlign: 'center',
    },
});