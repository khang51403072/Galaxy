import React, { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import type BottomSheetType from '@gorhom/bottom-sheet';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import XInput from './XInput';
import { XColors } from '../constants/colors';
import { TextStyles } from '../constants/textStyles';
import XIcon from './XIcon';
import XText from './XText';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  visible: boolean;
  onClose: () => void;
  data: string[];
  onSelect: (item: string) => void;
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
        data.filter(item => item.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
  }, [searchText, data]);

  const handleSelect = (item: string) => {
    onSelect(item);
    setSearchText('');
    onClose();
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onClose={onClose}
    >
      <BottomSheetView style={{ flex: 1, backgroundColor: '#fff', minHeight: 300 }}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <View style={{ alignItems: 'center', backgroundColor: theme.colors.backroundIconClose,  borderRadius: 20, padding: theme.spacing.sm, justifyContent: 'center' }}> 
              <XIcon name="x" width={12} height={12} color={theme.colors.gray800} />  
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder={placeholder}
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
          />
        </View>
        <BottomSheetFlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchText.trim() === '' ? 'Nhập từ khóa để tìm kiếm' : 'Không tìm thấy kết quả'}
              </Text>
            </View>
          }
          style={{ flex: 1 }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  searchContainer: { padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
  itemContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemText: { fontSize: 16 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#888' },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
