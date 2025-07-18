import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import XIcon from './XIcon';
import { useTheme } from '../theme/ThemeProvider';

const SCREEN_WIDTH = Dimensions.get('window').width;

export interface DropdownOption {
  label: string;
  value: string | number | any;
}

interface XDropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onSelect: (option: DropdownOption) => void;
  placeholder?: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  searchable?: boolean;
}

const XDropdown: React.FC<XDropdownProps> = ({
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  label,
  style,
  disabled = false,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    options.find(option => option.value === value) || null
  );
  const theme = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const option = options.find(option => option.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen, slideAnim]);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 4,
      fontWeight: '500',
    },
    dropdownButton: {
      borderWidth: 1,
      borderColor: disabled ? theme.colors.primary : theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: disabled ? theme.colors.surface : '#fff',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      
    },
    dropdownText: {
      color: selectedOption ? theme.colors.text : theme.colors.textPlaceholder,
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '70%',
      minHeight: 200,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    optionItem: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary + '10',
    },
    checkIcon: {
      marginLeft: 8,
    },
    emptyState: {
      padding: 20,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={[style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => !disabled && setIsOpen(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={styles.dropdownText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <XIcon 
          name="downArrow" 
          width={16} 
          height={16} 
          color={theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {label || 'Select Option'}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsOpen(false)}
                >
                  <XIcon 
                    name="x" 
                    width={24} 
                    height={24} 
                    color={theme.colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      selectedOption?.value === item.value && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No options available</Text>
                  </View>
                }
                showsVerticalScrollIndicator={false}
              />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default XDropdown; 