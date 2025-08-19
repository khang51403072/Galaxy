import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import type BottomSheetType from '@gorhom/bottom-sheet';
import XInput from './XInput';
import XIcon from './XIcon';
import XText from './XText';
import { useTheme } from '../theme/ThemeProvider';
import { EmployeeEntity, getDisplayName } from '../../features/ticket/types/TicketResponse';
import XAvatar from './XAvatar';
import XNoDataView from './XNoDataView';


interface Props {
  visible: boolean;
  onClose: () => void;
  data: EmployeeEntity[];
  onSelect: (item: EmployeeEntity) => void;
  placeholder?: string;
  title?: string;
}

export default function XBottomSheetSearch({ 
  visible, 
  onClose, 
  data, 
  onSelect, 
  placeholder = "Tìm kiếm...",
  title = "Tìm kiếm"
}: Props) {
  const sheetRef = useRef<BottomSheetType>(null);
  const snapPoints = useMemo(() => ['90%'], []);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const theme = useTheme();



  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    closeButton: { 
      borderRadius: 100, 
      padding: theme.spacing.sm, 
      backgroundColor: theme.colors.backroundIconClose
    },
    input: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
    itemContainer: { 
      paddingHorizontal: theme.spacing.md, 
      paddingVertical: theme.spacing.sm, 
      borderBottomWidth: 1, 
      borderBottomColor: theme.colors.border 
    },
  });
  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(item => getDisplayName(item).toLowerCase().includes(searchText.toLowerCase()))
      );
    }
  }, [searchText, data]);

  const handleSelect = (item: EmployeeEntity) => {
    onSelect(item);
    setSearchText('');
    onClose();
  };

  const renderItem = ({ item }: { item: EmployeeEntity }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => handleSelect(item)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <XAvatar uri={item.avatar} size={32} editable={false}/>
        <XText variant="bottomSheetItemText">{getDisplayName(item)}</XText>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay mờ, chừa header */}
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' }}>
        <BottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          onClose={onClose}
          enablePanDownToClose
          enableDynamicSizing={false}
          handleIndicatorStyle={{ backgroundColor: theme.colors.gray400 }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <XText variant="headingRegular" color={theme.colors.gray800}>{title}</XText>
            <TouchableOpacity onPress={onClose} 
            style={styles.closeButton}>
              <XIcon name="x" width={10} height={10} color={theme.colors.gray800} />
            </TouchableOpacity>
          </View>
          <XInput
              placeholder={placeholder}
              
              value={searchText}
              onChangeText={setSearchText}
              iconLeft="search"
              blurOnSubmit={false}
              style={styles.input}
            />
          {/* LIST */}
          <BottomSheetFlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <XNoDataView/>
            }
            style={{ flex: 1 , paddingTop: 16}}
            contentContainerStyle={{ paddingBottom: 40,flexGrow: 1 }}
            // Thêm props này để tối ưu performance
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        </BottomSheet>
      </View>
    </Modal>
  );
}

       
       
       
       


