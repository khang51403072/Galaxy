import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  StyleProp,
  ViewStyle,
  UIManager,
  findNodeHandle,
} from 'react-native';
import Modal from 'react-native-modal';
import XIcon from './XIcon';
import { useTheme } from '../theme/ThemeProvider';
import XText from './XText';
import XInput from './XInput';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MARGIN = 12;
const DROPDOWN_MIN_WIDTH = 180;
const DROPDOWN_MAX_WIDTH = 340;
const DROPDOWN_MAX_HEIGHT = 240;

export interface DropdownOption {
  label: string;
  value: string | number | any;
}

interface XDropdownProps {
  options: DropdownOption[];
  value?: DropdownOption|null;
  onSelect: (option: DropdownOption) => void;
  placeholder?: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  searchable?: boolean;
  renderItem?: (option: DropdownOption, selected: boolean) => React.ReactNode;
  renderLabel?: (option: DropdownOption) => React.ReactNode;
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
  renderItem,
  renderLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ left: MARGIN, top: MARGIN, width: DROPDOWN_MIN_WIDTH });
  const buttonRef = useRef<View>(null);
  const theme = useTheme();

  // Tính toán vị trí dropdown
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const node = findNodeHandle(buttonRef.current)!;
    UIManager.measureInWindow(node, (x, y, w, h) => {
      let left = x;
      let top = y + h;
      let width = Math.max(w, DROPDOWN_MIN_WIDTH);
      width = Math.min(width, DROPDOWN_MAX_WIDTH);
      if (left + width > SCREEN_WIDTH - MARGIN) left = SCREEN_WIDTH - width - MARGIN;
      if (top + DROPDOWN_MAX_HEIGHT > SCREEN_HEIGHT - MARGIN) top = y - DROPDOWN_MAX_HEIGHT;
      left = Math.max(MARGIN, left);
      setPos({ left, top, width });
    });
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    updatePosition();
    
  };

  useEffect(() => {
    if (isOpen) updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, options.length]);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      color: theme.colors.text,
      marginBottom: 4,
    },
    dropdownText: {
      color: value ? theme.colors.text : theme.colors.textPlaceholder,
    },
    dropdownList: {
      position: 'absolute',
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      maxHeight: DROPDOWN_MAX_HEIGHT,
      
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      zIndex: 1000,
      minWidth: DROPDOWN_MIN_WIDTH,
    },
    optionItem: {
      paddingVertical: theme.spacing.sm,
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
      backgroundColor: theme.colors.primaryMain + '10',
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
    <>
      <View style={[style]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity
          ref={buttonRef}
          onPress={handleOpen}
          activeOpacity={0.7}
          disabled={disabled}
        >
          {renderLabel && value ? renderLabel(value) : (
          <XInput
            value={value?.label}
            onChangeText={() => {}}
            placeholder={placeholder}
            style={styles.dropdownText}
            iconRight="downArrow"
            editable={false}
            pointerEvents="none"
          />
          )}
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isOpen}
        onBackdropPress={() => setIsOpen(false)}
        backdropColor="transparent"
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{ margin: 0, zIndex: 1000 }}
      >
        <View
          style={[
            styles.dropdownList,
            {
              left: pos.left,
              top: pos.top,
              width: pos.width,
            },
          ]}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => {
              const isSelected = value?.value === item.value;
              if (renderItem) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIsOpen(false);
                      onSelect(item);
                      
                    }}
                    activeOpacity={0.7}
                  >
                    {renderItem(item, isSelected)}
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setIsOpen(false);
                    onSelect(item);
                    
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No options available</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </>
  );
};

export default XDropdown; 