import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  Linking,
  Alert
} from 'react-native';
import { FontAwesome as FAIcon } from '@expo/vector-icons';
import { FontAwesome5 as FA5Icon } from '@expo/vector-icons';
import { getFunctions, httpsCallable } from "firebase/functions";

import { formatCost } from "../../helpers/common.js";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store.js';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type BillingContainerProps = {
    onOpenBusinessModal: () => void;
  };

const BillingContainer: React.FC<BillingContainerProps> = ({ onOpenBusinessModal }) => {
    const [processing, setProcessing] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const [showKeyBenefits, setShowKeyBenefits] = useState(false);
    const originalAmount = 10000;
    const [totalAmount, setTotalAmount] = useState(originalAmount);

    const phoneNumber = useSelector((state: RootState) => state?.agent?.phonenumber) || null;
    const cpId = useSelector((state: RootState) => state?.agent?.docData?.cpId) || null;

    const toggleKeyBenefits = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowKeyBenefits(prev => !prev);
    };

    const [couponCode, setCouponCode] = useState('');
    const [matchedCoupon, setMatchedCoupon] = useState<{
        name: string;
        code: string;
        description: string;
        discount: number; // in rupees
    } | null>(null);

  const initiatePayment = async () => {
    console.log("Initiating payment...");
    setProcessing(true);

    const functions = getFunctions();
    const initiatePhonePePayment = httpsCallable(functions, "initiatePhonePePayment");

    try {
      const transactionId = "TXN" + Date.now();
      //figure out and validate anoter redirect url for app.
      const redirectUrl = "https://acnonline.in/billing"; 
      const mobileNumber = phoneNumber;
      const userId = cpId;

      const response: any = await initiatePhonePePayment({
        amount: totalAmount,
        transactionId,
        redirectUrl,
        mobileNumber,
        userId,
      });

      console.log("response", response.data);

      if (response.data.success) {
        const paymentUrl: string = response.data.paymentUrl;

        const supported = await Linking.canOpenURL(paymentUrl);
        if (supported) {
          await Linking.openURL(paymentUrl);
        } else {
          Alert.alert("Error", "Unable to open payment URL.");
        }
      } else {
        console.error("Payment failed:", response.data.error);
        Alert.alert("Payment Failed", response.data.error || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error.message);
      Alert.alert("Error", error.message || "Payment could not be initiated.");
    }

    setProcessing(false);
  };

    const applyCoupon = () => {
        console.log('Entered Coupon Code:', couponCode);
        // Simulate a matched coupon with all required fields
        setMatchedCoupon({
        name: 'Flat ₹1000 OFF',
        code: couponCode,
        description: 'Get ₹1000 off on your annual subscription.',
        discount: 1000,
        });
    };

    const removeCoupon = () => {
        setMatchedCoupon(null);
        setCouponCode('');
    };

    useEffect(() => {
        if (matchedCoupon) {
            const newAmount = originalAmount - matchedCoupon.discount;
            setTotalAmount(newAmount);
        } else {
            setTotalAmount(originalAmount);
        }
    }, [matchedCoupon])

    // const initiatePayment = async () => {
    //     setProcessing(true);
    //     console.log("processing payment")
    //     setProcessing(false);
    // };

    const benefitIcons: Record<
  'earth' | 'file-cloud' | 'message-text-outline' | 'shield-check' | 'whatsapp' | 'headset',
  string
> = {
  earth: 'globe',
  'file-cloud': 'cloud',
  'message-text-outline': 'comment',
  'shield-check': 'shield-alt',
  whatsapp: 'whatsapp',
  headset: 'headphones',
};


    return (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              {/* price container */}
              <View style={styles.card}>
                <View style={styles.header}>
                  <Text style={styles.title}>
                    ACN Annual{'\n'}
                    <Text style={styles.subtext}>Membership (1 year)</Text>
                  </Text>
                  <Text style={styles.costText}>
                    {formatCost(originalAmount)}/yr
                  </Text>
                </View>
    
                <Text style={styles.description}>
                  Get full access to <Text style={styles.bold}>ACN</Text> with a mandatory <Text style={styles.regular}>12-month subscription</Text>, allowing verified agents to list, manage, and inquire about resale inventories while connecting with a trusted real estate network.
                </Text>
    
                <View style={styles.keyBenefitsSection}>
                  <View style={styles.keyBenefitsHeader}>
                    <Text style={styles.keyBenefitsTitle}>KEY BENEFITS</Text>
                    <TouchableOpacity onPress={toggleKeyBenefits} style={styles.keyBenefitsTitle}>
                      <FA5Icon
                        name="chevron-down"
                        size={24}
                        style={[
                          styles.arrowIcon,
                          showKeyBenefits && styles.arrowIconRotated
                        ]}
                      />
                    </TouchableOpacity>
                  </View>
    
                  {showKeyBenefits && (
                    <View style={styles.benefitsList}>
                      {[
                        { icon: 'earth', label: 'Exclusive Access' },
                        { icon: 'file-cloud', label: 'Post & Manage Listings' },
                        { icon: 'message-text-outline', label: 'On-demand Enquiries' },
                        { icon: 'shield-check', label: 'Verified Network' },
                        { icon: 'whatsapp', label: 'WhatsApp Community' },
                        { icon: 'headset', label: 'Priority Support' },
                      ].map((item, index) => (
                        <View key={index} style={styles.benefitItem}>
                            <View style={styles.iconContainer}>
                                <FA5Icon name={benefitIcons[item.icon as keyof typeof benefitIcons]} size={20} />
                            </View>
                          <Text style={styles.benefitText}>{item.label}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
    
                <View style={styles.validitySection}>
                  <Text style={styles.validityText}>
                    Validity: <Text style={styles.bold}>12 Months</Text> from the date of activation.
                  </Text>
                  <Text style={styles.refundText}>
                    Non-refundable & Non-transferable.**
                  </Text>
                </View>
    
                <Text style={styles.gstText}>
                  Have a GST?{' '}
                  <Text style={styles.linkText} onPress={onOpenBusinessModal}>
                    Click here
                  </Text>{' '}
                  to submit details.
                </Text>
              </View>
    
              {/* coupon container */}
              <View style={styles.couponContainer}>
                <Text style={styles.heading}>Coupon code</Text>
                <Text style={styles.couponSubtext}>
                  Have a coupon? Enter the code here to avail discounts!
                </Text>
    
                {!matchedCoupon ? (
                  <View style={styles.inputRow}>
                    <TextInput
                      value={couponCode}
                      onChangeText={setCouponCode}
                      placeholder="Coupon code"
                      style={styles.input}
                      placeholderTextColor="#747474"
                    />
                    <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}>
                      <Text style={styles.applyText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.couponRow}>
                    <View style={styles.appliedCoupon}>
                      <FAIcon name="tag" size={20} style={styles.icon} />
                      <Text style={styles.couponCodeText}>{matchedCoupon.code}</Text>
                    </View>
                    <TouchableOpacity style={styles.removeBtn} onPress={removeCoupon}>
                      <FAIcon name="close" size={20} style={styles.icon} color={"white"}/>
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
    
              {/* order container */}
              <View style={styles.orderContainer}>
                <Text style={styles.orderHeader}>Order Summary</Text>
    
                <View style={styles.summaryCard}>
                  {/* Payment Breakdown */}
                  <View style={styles.paymentBreakdown}>
                    <View>
                      <View style={styles.rowBetween}>
                        <Text style={styles.label}>Annual membership</Text>
                        <Text style={styles.value}>{formatCost(10000)}</Text>
                      </View>
                      <Text style={styles.orderDescription}>Valid for 12 months</Text>
                    </View>
    
                    {matchedCoupon && (
                      <View>
                        <View style={styles.rowBetween}>
                          <Text style={styles.label}>{matchedCoupon.name}</Text>
                          <Text style={[styles.value, { color: '#898483' }]}>
                            - {formatCost(matchedCoupon.discount)}
                          </Text>
                        </View>
                        <Text style={styles.orderDescription}>{matchedCoupon.description}</Text>
                      </View>
                    )}
                  </View>
    
                  {/* Divider */}
                  <View style={styles.divider} />
    
                  {/* Total */}
                  <View style={styles.rowBetween}>
                    <Text style={styles.totalLabel}>Total (INR)</Text>
                    <Text style={styles.totalAmount}>{formatCost(totalAmount)}</Text>
                  </View>
    
                  <Text style={styles.taxInfo}>Total includes applicable taxes**</Text>
                </View>
    
                {/* Bottom section */}
                <View style={styles.bottomSection}>
                  {matchedCoupon && (
                    <View style={styles.row}>
                      <FA5Icon name="birthday-cake" size={20} style={styles.iconSmall} />
                      <Text style={styles.savingText}>
                        Nice! You saved {formatCost(originalAmount - totalAmount)} on your order.
                      </Text>
                    </View>
                  )}
    
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={initiatePayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <Text style={styles.payText}>Processing...</Text>
                    ) : (
                      <View style={styles.row}>
                        <Text style={styles.payText}>I am Ready to Pay</Text>
                        <FAIcon name="arrow-right" size={20} style={styles.iconSmall} color={"white"}/>
                      </View>
                    )}
                  </TouchableOpacity>
    
                  <View style={styles.paymentMethods}>
                    <View style={styles.row}>
                      <FAIcon name="lock" size={24} style={styles.iconSmall} />
                      <Text style={styles.secureText}>Secure Payment</Text>
                    </View>
    
                    <View style={styles.row}>
                        <Image
                            source={require('../../../assets/icons/billing/visa-icon.png')} 
                            style={styles.upiIcon}
                        />
                        <Image
                            source={require('../../../assets/icons/billing/master-card-icon.png')} 
                            style={styles.upiIcon}
                        />
                        <Image
                            source={require('../../../assets/icons/billing/credit-card-color-icon.png')} 
                            style={styles.upiIcon}
                        />
                        <Image
                            source={require('../../../assets/icons/billing/upi-icon (3).png')} 
                            style={styles.upiIcon}
                        />
                        <Image
                            source={require('../../../assets/icons/billing/rupay-logo-icon.png')} 
                            style={styles.upiIcon}
                        />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      );
    
};


const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 12
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F6F7',
        paddingHorizontal: 12,
        paddingTop: 12,
        alignItems: 'center',
        justifyContent: 'flex-start',
        
    },
    innerContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        justifyContent: 'space-between',
        gap: 38,
        paddingVertical: 30,
    },
    header: {
        
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: { 
        fontFamily: 'Montserrat_700Bold',
        fontSize: 18,
        lineHeight: 27,
        color: '#433F3E',
    },
    subtext: {
        fontFamily: 'Montserrat_700Bold',
    },
    costText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 20,
        lineHeight: 27,
        color: '#205E59',
        marginLeft: 12,
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        color: '#5A5555',
        fontFamily: 'System',
    },
    bold: {
        color: '#0A0B0A',
        fontWeight: '700',
    },
    regular: {
        color: '#0A0B0A',
        fontWeight: '700'
    },
    keyBenefitsSection: {
        width: '100%',
        gap: 16,
    },
    keyBenefitsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    keyBenefitsTitle: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 18,
        lineHeight: 21,
        color: '#5A5555',
        paddingBottom: 10
    },
    arrowIcon: {
        width: 20,
        height: 20,
        transform: [{ rotate: '0deg' }],
    },
    arrowIconRotated: {
        transform: [{ rotate: '180deg' }],
    },
    benefitsList: {
        gap: 26,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    benefitIcon: {
        width: 32,
        height: 32,
        padding: 8,
        backgroundColor: '#DAFBEA',
        borderRadius: 4,
    },
    benefitText: {
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 21,
        color: '#0A0B0A',
    },
    validitySection: {
        alignItems: 'flex-start',
        gap: 4,
    },
    validityText: {
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
        color: '#433F3E',
    },
    refundText: {
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 21,
        color: '#433F3E',
    },
    gstText: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: '#433F3E',
    },
    linkText: {
        color: 'blue',
    },
    couponContainer: {
        marginTop: 20,
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        gap: 10,
    },
    heading: {
        fontFamily: "Montserrat_700Bold",
        // fontWeight: 'bold',
        fontSize: 20,
        lineHeight: 24,
        color: '#433F3E',
    },
    couponSubtext: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 20,
        color: '#0A0B0A',
        marginBottom: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        marginTop: 4,
    },
    input: {
        height: 45,
        flex: 1,
        color: "#747474",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCBCB',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        textAlignVertical: "center",
        fontSize: 17,
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 5,
            },
            android: {
              elevation: 8, // Android shadow
            },
          }),
    },
    applyBtn: {
        paddingHorizontal: 26,
        paddingVertical: 11,
        borderRadius: 10,
        backgroundColor: '#153E3B',
    },
    applyText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '500',
    },
    couponRow: {
        padding:5,
        flexDirection: 'row',
        // alignItems: 's',
        gap: 10,
        width: '100%',
    },
    appliedCoupon: {
        height: 45,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCCBCB',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#E3E3E3',
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 5,
            },
            android: {
              elevation: 8, // Android shadow
            },
          }),
    },
    couponCodeText: {
        height: 45,
        textAlignVertical: "center",
        fontSize: 17,
        fontWeight: 'bold',
        color: '#747474',
    },
    removeBtn: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#153E3B',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    removeText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '500',
    },
    icon: {
        width: 20,
        height: 20,
    },
    orderContainer: {
        marginTop:20,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        width: '100%',
        gap: 20,
    },
    orderHeader: {
        fontFamily: "Montserrat_700Bold",
        fontSize: 20,
        lineHeight: 24,
        color: '#433F3E',
        paddingHorizontal: 20,
    },
    summaryCard: {
        backgroundColor: '#DAFBEA',
        paddingVertical: 28,
        paddingHorizontal: 20,
        borderRadius: 8,
        gap: 20,
    },
    paymentBreakdown: {
        gap: 10,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontFamily: "Montserrat_600SemiBold",
        fontSize: 14,
        fontWeight: '600',
        color: '#0A0B0A',
    },
    value: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0A0B0A',
    },
    orderDescription: {
        paddingRight:75,
        fontSize: 14,
        fontWeight: '500',
        color: '#898483',
    },
    divider: {
        height: 1,
        backgroundColor: '#E3E3E3',
    },
    totalLabel: {
        fontSize: 18,
        fontFamily: "Montserrat_700Bold",
        color: '#252626',
    },
    totalAmount: {
        fontSize: 22,
        fontFamily: "Montserrat_700Bold",
        color: '#205E59',
    },
    taxInfo: {
        fontSize: 14,
        fontWeight: '400',
        color: '#464748',
        textAlign: 'center'
    },
    bottomSection: {
        gap: 20,
        alignItems: 'center',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'nowrap',
    },
    savingText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#0A0B0A',
    },
    payButton: {
        backgroundColor: '#153E3B',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    payText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
    },
    paymentMethods: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
    },
    secureText: {
        paddingLeft:5,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0A0B0A',
    },
    iconSmall: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    iconLarge: {
        width: 40,
        height: 26,
        resizeMode: 'contain',
        marginHorizontal:2,
    },
    iconContainer:{
        width: 35,
        height: 35,
        borderRadius: 5,
        backgroundColor: '#DAFBEA', 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    upiIcon:{
        marginHorizontal:2,
        height:26,
        width:40,
    }
});

export default BillingContainer;
