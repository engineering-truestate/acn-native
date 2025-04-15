import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface MonthFilterOption {
  label: string;
  value: string;
}

interface MonthFilterDropdownProps {
  options: MonthFilterOption[];
  value: string;
  setValue: (value: string) => void;
}

const MonthFilterDropdown = ({ options, value, setValue }: MonthFilterDropdownProps) => {
  const allOptions = [{label: "All", value: ""}, ...options];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    if (!value || value === "") {
      setSelectedLabel("All");
    } else {
      const selected = allOptions?.find((option) => option?.value === value)?.label;
      if (selected) {
        setSelectedLabel(selected);
      }
    }
  }, [value, allOptions]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    if (value !== optionValue) {
      setValue(optionValue);
    }
    setIsOpen(false);
    // Add analytics here if needed
  };

  return (
    <StyledView className="flex-row items-center justify-between bg-gray-100 px-4 py-2 rounded-md">
      <StyledText className="text-sm text-gray-700 font-medium">
        Filter by month:
      </StyledText>
      
      <StyledView className="relative z-20">
        <StyledTouchableOpacity
          className="flex-row items-center justify-between bg-white min-w-[80px] px-3 py-1 rounded-md border border-gray-200"
          onPress={toggleDropdown}
        >
          <StyledText className="text-sm font-medium text-black mr-2">
            {selectedLabel}
          </StyledText>
          <Ionicons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={14} 
            color="#0A0B0A" 
          />
        </StyledTouchableOpacity>

        {isOpen && (
          <StyledView className="absolute top-9 right-0 p-1 bg-white border border-gray-200 rounded-lg shadow-md z-30 min-w-[100px]">
            {allOptions.map((option, index) => (
              <StyledTouchableOpacity
                key={index}
                className="rounded-md w-full px-3 py-2 mb-1"
                style={{backgroundColor: option.value === value ? '#F2F2F2' : 'transparent'}}
                onPress={() => handleOptionClick(option.value)}
              >
                <StyledText className="font-medium text-sm text-black">
                  {option.label}
                </StyledText>
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        )}
      </StyledView>
    </StyledView>
  );
};

export default MonthFilterDropdown; 