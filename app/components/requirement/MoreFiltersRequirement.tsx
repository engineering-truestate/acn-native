import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRefinementList } from 'react-instantsearch';
import CheckboxFilter from './CheckboxFilter';
import DropdownMoreFilters from '../DropdownMoreFilters';
import RangeMoreFilters from '../RangeMoreFilters';

interface BudgetMarketValueFiltersProps {
  isMarketValueActive: Boolean;
  isBudgetActive: Boolean;
  handleRangeFilterChange: (attribute: string) => void;
}
const BudgetMarketValueFilters = ({
  isMarketValueActive,
  isBudgetActive,
  handleRangeFilterChange,
}: BudgetMarketValueFiltersProps) => {
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const { items, refine } = useRefinementList({ attribute: 'marketValue' });

  return (
    <View className="border border-[#ECECEC] rounded-xl p-4 bg-white mb-5">
      <Text className="text-sm font-semibold text-neutral-700 mb-2">Budget</Text>

      {!isMarketValueActive && (
        <View className="mb-4 flex-row space-x-3">
          <TextInput
            className="flex-1 h-12 px-3 rounded-md border border-neutral-300 bg-white text-base text-neutral-800"
            placeholder="Min"
            value={minBudget}
            keyboardType="numeric"
            onChangeText={(val) => {
              setMinBudget(val);
              handleRangeFilterChange('budget.to');
            }}
          />
          <TextInput
            className="flex-1 h-12 px-3 rounded-md border border-neutral-300 bg-white text-base text-neutral-800"
            placeholder="Max"
            value={maxBudget}
            keyboardType="numeric"
            onChangeText={(val) => {
              setMaxBudget(val);
              handleRangeFilterChange('budget.to');
            }}
          />
        </View>
      )}

      {!isBudgetActive && (
        <>
          <View className="h-px bg-neutral-300 my-2" />
          <Text className="text-sm font-semibold text-neutral-700 mt-2 mb-2">Market Value</Text>
          <View className="max-h-[240px]">
            <FlatList
              data={items}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isRefined = item.isRefined;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      refine(item.value);
                      handleRangeFilterChange('marketValue');
                    }}
                    className={`flex-1 m-1 p-3 rounded-lg border ${isRefined
                      ? 'bg-[#DFF4F3] border-primary'
                      : 'bg-gray-50 border-neutral-300'
                      }`}
                  >
                    <Text
                      className={`text-sm font-medium ${isRefined ? 'text-primary' : 'text-neutral-800'
                        }`}
                    >
                      {item.label}
                    </Text>
                    <Text
                      className={`text-xs ${isRefined ? 'text-primary' : 'text-neutral-500'
                        }`}
                    >
                      {item.count}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

interface MoreFiltersRequirementProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleToggle: () => void;
}
const MoreFiltersRequirement = ({
  isOpen,
  setIsOpen,
  handleToggle,
}: MoreFiltersRequirementProps) => {
  if (!isOpen) return null;

  const [showFilters, setShowFilters] = useState(true);

  const toggleFiltersVisibility = () => {
    setShowFilters(!showFilters);
  };


  return (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={()=> {
        toggleFiltersVisibility()}}
      
    >
      <SafeAreaView className="flex-1 bg-white px-4">
        <View className="flex-row justify-between items-center px-4 pt-10 pb-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-black text-center flex-1">More Filters</Text>
          <TouchableOpacity onPress={handleToggle}>
            <Text className="text-lg text-black">✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="px-4">
          <View className="flex-row flex-wrap justify-between mb-4">
            <View className="w-[48%] mb-4 z-20">
              <Text className="text-base font-semibold text-black mb-2 font-['Montserrat']">Asset Type</Text>
              <DropdownMoreFilters title="Asset Type" attribute="assetType" type="dropdown" />
            </View>
            <View className="w-[48%] mb-4 z-20">
              <Text className="text-base font-semibold text-black mb-2 font-['Montserrat']">configuration</Text>
              <DropdownMoreFilters attribute="configuration" title="Configuration" type="dropdown" />
            </View>
          </View>



          <RangeMoreFilters title="SBUA (sqft)" attribute="sbua" />
          <CheckboxFilter attribute="Requirment" />
          <BudgetMarketValueFilters
            isBudgetActive={false}
            isMarketValueActive={false}
            handleRangeFilterChange={() => console.log()}
          />
        </ScrollView>

        <TouchableOpacity
          className="bg-[#103D35] p-3 mx-4 mb-8 rounded-lg items-center"
          onPress={() => {
             // Make sure this is called to handle any side effects
            toggleFiltersVisibility()
          }}
        >
          <Text className="text-white text-lg font-semibold">Show Results</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

export default MoreFiltersRequirement;

