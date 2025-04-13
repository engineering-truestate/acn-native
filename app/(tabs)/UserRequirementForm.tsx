import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ARSecondaryButton from '../components/Button/ARSecondaryButton';
import ARPrimaryButton from '../components/Button/ARPrimaryButton';
import { FontAwesome } from '@expo/vector-icons';
import { Requirement } from '../types';
import submitRequirement from '../helpers/submitRequirement';

const UserRequirementForm = () => {
  const [focusedFields, setFocusedFields] = useState<{ [key: string]: boolean }>({});
  const handleFocus = (fieldName: string) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: true }));
  };
  const handleBlur = (fieldName: string) => {
    setFocusedFields((prev) => ({ ...prev, [fieldName]: false }));
  };

  const [propertyName, setPropertyName] = useState('');
  const [requirementDetails, setRequirementDetails] = useState('');
  const [assetType, setAssetType] = useState('');
  const [area, setArea] = useState<number | null>(null);
  const [configuration, setConfiguration] = useState('');
  const [budgetFrom, setBudgetFrom] = useState<number | null>(null);
  const [budgetTo, setBudgetTo] = useState<number | null>(null);
  const [marketValue, setMarketValue] = useState(false);

  const [error, setError] = useState<{
    propertyName?: string;
    assetType?: string;
    configuration?: string;
    budget?: string;
  }>({});

  const getConfigurations = () => {
    switch (assetType) {
      case "apartment":
        return [
          "1 BHK",
          "2 BHK",
          "2.5 BHK",
          "3 BHK",
          "3.5 BHK",
          "4 BHK",
          "5 BHK",
        ];
      case "plot":
        return [];
      case "villa":
      case "duplex":
      case "penthouse":
      case "rowhouse":
      case "bungalow":
      case "villament":
        return ["2BHK", "3BHK", "3.5BHK", "4BHK", "4.5BHK", "5BHK", "5+BHK"];
      case "commercial building":
        return ["Commercial Building"];
      case "independent building":
        return [
          "2BHK",
          "3BHK",
          "3.5BHK",
          "4BHK",
          "4.5BHK",
          "5BHK",
          "5+BHK",
          "Commercial Building",
        ];
      default:
        return [];
    }
  };

  const handleMarketValueCheckbox = () => {
    if (marketValue)
      setMarketValue(false);
    else
      setMarketValue(true);
    setBudgetFrom(null);
    setBudgetTo(null);
  };

  const clearForm = () => {
    // Reset form fields
    setPropertyName('');
    setRequirementDetails('');
    setAssetType('');
    setArea(null);
    setConfiguration('');
    setBudgetFrom(null);
    setBudgetTo(null);
    setMarketValue(false); // Reset to default value

    // Clear errors
    setError({});

    // Reset focus states
    setFocusedFields({});
  };


  const handleSubmit = async () => {
    const newErrors: any = {};

    if (!propertyName.trim()) {
      newErrors.propertyName = "Please enter property name or location";
    }

    if (!assetType.trim()) {
      newErrors.assetType = "Asset type is required";
    }

    if (!configuration.trim()) {
      newErrors.configuration = "Configuration is required";
    }

    if (!(budgetFrom && budgetTo) && !marketValue) {
      newErrors.budget = "Either budget range or market value is required";
    }

    if (budgetTo && budgetFrom && (budgetTo < budgetFrom)) {
      newErrors.budget = "Invalid range provided";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length != 0) {
      return;
    }

    setSaving(true);

    try {
      const userRequirement: Requirement = {
        propertyName,
        requirementDetails,
        assetType,
        area: area || undefined,
        configuration,
        budget: {
          from: budgetFrom || undefined,
          to: budgetTo || undefined,
        },
        marketValue: marketValue === true ? "Market Value" : "",
      }

      await submitRequirement(userRequirement);

    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      clearForm();
      setSaving(false);
      console.log("requirement submitted");
    }
  };

  const [saving, setSaving] = useState(false);
  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer} >

        {/* Fixed Header */}
        <View style={styles.contentContainer}>

          {/* Scrollable Content */}
          <ScrollView className="flex-grow p-5 bg-[#F5F6F7] gap-1">

            {/* Propery Name/ Location Feild */}
            <View className="space-y-2 pb-5 pt-4">
              <Text className="text-left text-lg" style={{ fontFamily: 'Montserrat_600SemiBold' }}>
                Project Name / Location <Text className="text-red-500">*</Text>
              </Text>

              <TextInput
                value={propertyName}
                onChangeText={(text) => {
                  setPropertyName(text);
                  setError((prev) => ({ ...prev, propertyName: undefined }));
                }}
                onFocus={() => handleFocus('propertyName')}
                onBlur={() => handleBlur('propertyName')}
                placeholder="Type here"
                className={`
                        rounded-xl p-4 w-full text-xl bg-white 
                        border ${focusedFields['propertyName'] ? 'border-yellow-600 border-2' : 'border-gray-300'}
                      `}
              />
              {error.propertyName && (
                <Text className="text-red-500 text-base">{error.propertyName}</Text>
              )}
            </View>

            {/* Requirement Details */}
            <View className="space-y-2 pt-4 pb-10">
              <Text className="text-left text-lg" style={{ fontFamily: 'Montserrat_600SemiBold' }}>
                Requirement Details
              </Text>

              <TextInput
                value={requirementDetails}
                onChangeText={setRequirementDetails}
                onFocus={() => handleFocus('requirementDetails')}
                onBlur={() => handleBlur('requirementDetails')}
                placeholder="Enter the details"
                className={`
                        rounded-xl px-4 w-full text-xl bg-white h-24
                        border ${focusedFields['requirementDetails'] ? 'border-yellow-600 border-2' : 'border-gray-300'}
                      `}
                textAlignVertical="top"
                multiline
              />
            </View>

            {/* Third Container */}
            <View className="flex-1 px-6 py-7 mb-7 bg-white border border-gray-300 rounded-xl ">
              {/* Asset Type */}
              <View className="space-y-4 mb-4">
                <Text className="text-left text-lg" style={{ fontFamily: "Montserrat_600SemiBold" }}>
                  Asset Type <Text className="text-red-500">*</Text>
                </Text>
                <View className="space-y-2 ">
                  <View
                    className={`rounded-xl px-2  bg-gray-100 ${focusedFields['assetType']
                      ? 'border-2 border-yellow-600'
                      : 'border border-gray-300'
                      }`}
                  >
                    <Picker
                      selectedValue={assetType}
                      onValueChange={(itemValue) => {
                        setAssetType(itemValue);
                        setError((prev) => ({ ...prev, assetType: "" }));
                      }}
                      onFocus={() => handleFocus('assetType')}
                      onBlur={() => handleBlur('assetType')}
                      dropdownIconColor={"#000"}
                    >
                      <Picker.Item label="Select Asset Type" value="" style={{ fontSize: 20 }} />
                      <Picker.Item label="Apartment" value="apartment" style={{ fontSize: 20 }} />
                      <Picker.Item label="Plot" value="plot" style={{ fontSize: 20 }} />
                      <Picker.Item label="Villa" value="villa" style={{ fontSize: 20 }} />
                      <Picker.Item label="Duplex" value="duplex" style={{ fontSize: 20 }} />
                      <Picker.Item label="Penthouse" value="penthouse" style={{ fontSize: 20 }} />
                      <Picker.Item label="Independent Building" value="independent building" style={{ fontSize: 20 }} />
                      <Picker.Item label="Commercial Building" value="commercial building" style={{ fontSize: 20 }} />
                      <Picker.Item label="Row House" value="rowhouse" style={{ fontSize: 20 }} />
                      <Picker.Item label="Bungalow" value="bungalow" style={{ fontSize: 20 }} />
                      <Picker.Item label="Villament" value="villament" style={{ fontSize: 20 }} />
                    </Picker>
                  </View>

                  {error.assetType && (
                    <Text className="text-red-500 text-base">{error.assetType}</Text>
                  )}
                </View>
              </View>

              {/* Configuration + Area Row */}
              <View className="flex-row gap-x-4 ">
                {/* Configuration */}
                <View className="space-y-4 flex-1">
                  <Text className="text-left text-lg" style={{ fontFamily: "Montserrat_600SemiBold" }}>
                    Configuration <Text className="text-red-500">*</Text>
                  </Text>

                  <View className="space-y-2">
                    <View
                      className={`rounded-xl px-2 bg-gray-100 ${focusedFields['configuration']
                        ? 'border-2 border-yellow-600'
                        : 'border border-gray-300'
                        } ${getConfigurations().length == 0 ? 'opacity-50' : ''}`}
                    >
                      <Picker
                        selectedValue={configuration}
                        onValueChange={(itemValue) => {
                          setConfiguration(itemValue);
                          setError((prev) => ({ ...prev, configuration: "" }));
                        }}
                        onFocus={() => handleFocus('configuration')}
                        onBlur={() => handleBlur('configuration')}
                        dropdownIconColor={"#000"}
                        enabled={getConfigurations().length > 0}
                      >
                        <Picker.Item
                          label={getConfigurations().length == 0 ? "Not applicable" : "Select Configuration"}
                          value=""
                          style={{ fontSize: 20 }}
                        />
                        {getConfigurations().map((config, index) => (
                          <Picker.Item key={index} label={config} value={config} style={{ fontSize: 20 }} />
                        ))}
                      </Picker>
                    </View>

                    {error.configuration && (
                      <Text className="text-red-500 text-base">{error.configuration}</Text>
                    )}
                  </View>
                </View>

                {/* Area */}
                <View className="space-y-4 flex-1">
                  <Text className="text-left text-lg" style={{ fontFamily: "Montserrat_600SemiBold" }}>
                    Area (Sqft)
                  </Text>
                  <TextInput
                    value={area !== null ? area.toString() : ''}
                    onChange={(e) => {
                      const text = e.nativeEvent.text;
                      if (/^\d*$/.test(text)) {
                        setArea(text === '' ? null : parseInt(text, 10));
                      }
                    }}
                    onFocus={() => handleFocus('area')}
                    onBlur={() => handleBlur('area')}
                    keyboardType="number-pad"
                    placeholder="0000"
                    className={`
                            rounded-xl p-4 w-full text-xl bg-gray-100
                            border ${focusedFields['area'] ? 'border-yellow-600 border-2' : 'border-gray-300'}
                          `}
                  />
                </View>
              </View>
            </View>

            {/* Fourth Container */}
            {/* Budget */}
            <View className="space-y-10 bg-white rounded-xl border border-gray-200 px-6 py-8 mb-16">
              <View className="space-y-2">
                <Text className="text-left text-lg " style={{ fontFamily: 'Montserrat_600SemiBold' }}>
                  Budget (Cr) <Text className="text-red-500">*</Text>
                </Text>

                <View className="flex-row items-center space-x-2">
                  {/* Budget From */}
                  <TextInput
                    placeholder="From"
                    value={budgetFrom !== null ? budgetFrom.toString() : ''}
                    onFocus={() => handleFocus('budgetFrom')}
                    onBlur={() => handleBlur('budgetFrom')}
                    onChangeText={(text) => {
                      let numericValue = text.replace(/[^0-9.]/g, "");
                      const parts = numericValue.split(".");
                      if (parts.length > 2) {
                        numericValue = `${parts[0]}.${parts[1]}`;
                      }
                      if (parts.length > 1) {
                        parts[1] = parts[1].slice(0, 2);
                        numericValue = `${parts[0]}.${parts[1]}`;
                      }
                      setBudgetFrom(numericValue === '' ? null : parseFloat(numericValue));
                    }}
                    className={`
                            flex-1 rounded-lg px-3 py-3 text-lg
                            border border-gray-300
                            ${marketValue ? "bg-stone-100 text-gray-500" : "bg-white text-black"}
                            ${focusedFields['budgetFrom'] ? 'border-yellow-600 border-2' : 'border-gray-300'}
                          `}
                    editable={!marketValue}
                    keyboardType="decimal-pad"
                  />

                  <Text className="text-lg">To</Text>

                  {/* Budget To */}
                  <TextInput
                    placeholder="To"
                    value={budgetTo !== null ? budgetTo.toString() : ''}
                    onFocus={() => handleFocus('budgetTo')}
                    onBlur={() => handleBlur('budgetTo')}
                    onChangeText={(text) => {
                      let numericValue = text.replace(/[^0-9.]/g, "");
                      const parts = numericValue.split(".");
                      if (parts.length > 2) {
                        numericValue = `${parts[0]}.${parts[1]}`;
                      }
                      if (parts.length > 1) {
                        parts[1] = parts[1].slice(0, 2);
                        numericValue = `${parts[0]}.${parts[1]}`;
                      }
                      setBudgetTo(numericValue === '' ? null : parseFloat(numericValue));
                    }}
                    className={`
                            flex-1 rounded-lg px-3 py-3 text-lg
                            border border-gray-300
                            ${marketValue ? "bg-stone-100 text-gray-500" : "bg-white text-black"}
                            ${focusedFields['budgetTo'] ? 'border-yellow-600 border-2' : 'border-gray-300'}
                          `}
                    editable={!marketValue}
                    keyboardType="decimal-pad"
                  />
                </View>

                {error.budget && (
                  <Text className="text-red-500 text-base">{error.budget}</Text>
                )}
              </View>

              {/* Checkbox */}
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity
                  onPress={handleMarketValueCheckbox}
                  className={`w-5 h-5 rounded border ${marketValue ? "bg-yellow-500 border-yellow-600" : "border-gray-400"
                    }`}
                >
                  {/* Show a checkmark when marketValue is true */}
                  {marketValue && (
                    <View className="w-full h-full bg-blue-500 rounded justify-center items-center">
                      {/* Using a Unicode tick symbol or FontAwesome icon can be used instead of the box */}
                      <Text className="text-white text-center">✔</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <Text className="text-xl font-semibold">As per Market Price</Text>
              </View>
            </View>

          </ScrollView>
        </View>



        {/* Fixed Footer */}
        <View style={styles.footer}>
          <View style={styles.footerButtons}>
            {/* Clear Button */}
            <ARSecondaryButton onPress={clearForm} style={styles.clearButton} >
              Clear
            </ARSecondaryButton>

            {/* Submit Button */}
            <ARPrimaryButton onPress={handleSubmit} style={styles.submitButton} disabled={saving}>
              Submit
            </ARPrimaryButton>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 60,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingBottom: 100,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    flexGrow: 1,
    // paddingBottom:110,
    backgroundColor: "#F5F6F7"
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 22,
    paddingHorizontal: 20,
  },

  footerButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: "30%",
  },

  clearButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999',
    flexShrink: 1,
  },

  submitButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#153E3B',
    flexShrink: 1,
  },
});

export default UserRequirementForm;
