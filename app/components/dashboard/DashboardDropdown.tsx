import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import ArrowDownIcon from '../../assets/icons/arrow-down.svg';
import { Ionicons } from '@expo/vector-icons';

interface Option {
  label: string;
  value: string;
}

interface DashboardDropdownProps {
  options: Option[];
  value: string | null;
  setValue: (value: string) => void;
  type?: 'requirement' | 'inventory';
}

const DashboardDropdown: React.FC<DashboardDropdownProps> = ({
  options,
  value,
  setValue,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>("");

  useEffect(() => {
    const selected: string | null = options?.find(
      (option) => option?.value?.toLowerCase() === value?.toLowerCase()
    )?.label || value;
    setSelectedLabel(selected);
  }, [value, options]);

  const toggleDropdown = () => {
    if (value === "De-Listed") return; // Prevent opening if disabled
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    if (value !== option) {
      setValue(option);
    }
    setIsOpen(false);
  };

  // Determine button style based on value
  const getButtonStyle = () => {
    if (value === "Pending" || value === "Available") {
      return styles.buttonAvailable;
    } else if (value === "Hold") {
      return styles.buttonHold;
    } else if (value === "De-Listed") {
      return styles.buttonDisabled;
    } else {
      return styles.buttonDeListed;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          getButtonStyle(),
          type === "requirement" ? styles.requirementButton : styles.inventoryButton
        ]}
        onPress={toggleDropdown}
        disabled={value === "De-Listed"}
      >
        {type === "requirement" && (
          <Ionicons name="chevron-down" size={16} color={value === 'Closed' ? "#FF0000" : "#153E3B"} />
        )}
        <Text style={styles.buttonText}>
          {selectedLabel}
        </Text>
        {type === "inventory" && (
          <Ionicons name="chevron-down" size={16} color={value === 'Closed' ? "#FF0000" : "#153E3B"} />
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View 
            style={[
              styles.dropdown,
              type === "requirement" ? styles.requirementDropdown : styles.inventoryDropdown
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleOptionClick(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 6,
  },
  requirementButton: {
    width: 100,
  },
  inventoryButton: {
    width: 114,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'sans-serif',
    fontWeight: '500',
    lineHeight: 21,
    textAlign: 'center',
    color: '#153E3B',
  },
  buttonAvailable: {
    backgroundColor: '#E0F7F4',
    borderColor: '#A3E6DE',
  },
  buttonHold: {
    backgroundColor: '#FBDD97',
    borderColor: '#E8B006',
  },
  buttonDisabled: {
    backgroundColor: '#D3D3D3',
    borderColor: '#A3A4A5',
    opacity: 0.5,
  },
  buttonDeListed: {
    backgroundColor: '#FCD5DC',
    borderColor: '#F9ABB9',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FAFAFA',
    borderRadius: 6,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  requirementDropdown: {
    width: 100,
  },
  inventoryDropdown: {
    width: 114,
  },
  option: {
    borderRadius: 6,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  optionText: {
    fontFamily: 'sans-serif',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 21,
    color: '#0A0B0A',
  },
});

export default DashboardDropdown;