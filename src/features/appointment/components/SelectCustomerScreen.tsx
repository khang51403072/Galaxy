import React, { useState, useEffect, useRef, useCallback } from 'react';
import XScreen from '@/shared/components/XScreen';
import XText from '@/shared/components/XText';
import XInput from '@/shared/components/XInput';
import XIcon from '@/shared/components/XIcon';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { CustomerEntity } from '../types/CustomerResponse';
import { goBack, navigate } from '@/app/NavigationService';
import { ROUTES } from '@/app/routes';
import { useTheme, Theme } from '@/shared/theme';

// --- IMPORT STORE MỚI ---
import { useAppointmentStore } from '../stores/appointmentStore'; // Giữ lại để lấy config
import { useCustomerStore } from '../stores/customerStore';

export default function SelectCustomerScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // --- SỬ DỤNG STORE MỚI: useAppointmentFormStore ---
  const { 
    searchCustomer, 
    isLoading, 
    cachedCustomerList, 
    customerList, 
    getCustomerLookup, 
    setSelectedCustomer, 
    setSearchString, 
    searchString, 
  } = useCustomerStore(
    useShallow((state) => ({
      customerList: state.customerList,
      isLoading: state.isLoading,
      searchString: state.searchString,
      getCustomerLookup: state.getCustomerLookup,
      setSelectedCustomer: state.setSelectedCustomer,
      setSearchString: state.setSearchString,
      setIsLoading: state.setIsLoading,
      searchCustomer: state.searchCustomer,
      cachedCustomerList: state.cachedCustomerList,
    }))
  );

  // Lấy config isShowPhone từ store chung của feature Appointment
  const isShowPhone = useAppointmentStore(state => state.json?.isShowPhone);

  // useEffect để tải danh sách ban đầu
  useEffect(() => {
    if (cachedCustomerList.length == 0) getCustomerLookup()
  }, [cachedCustomerList]);


  const handleSearch = (text: string) => {
    setSearchString(text);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      searchCustomer(text)
    }, 850); // 500ms debounce
  };

  const handleClearSearch = () => {
    setSearchString('');
  }

  const handleSelectCustomer = (item: CustomerEntity) => {
    setSelectedCustomer(item);
    goBack();
  };

  const renderCustomerItem = ({ item }: { item: CustomerEntity }) => (
    <TouchableOpacity
      onPress={() => handleSelectCustomer(item)}
      style={styles.itemContainer}
    >
      <XText variant='titleRegular'>{item.firstName} {item.lastName}</XText>
      {isShowPhone && item.cellPhone && <XText variant='bodyRegular' color={theme.colors.gray600}>{item.cellPhone}</XText>}
    </TouchableOpacity>
  );

  return (
    <XScreen
      loading={isLoading}
      title="Select Customer"
      dismissKeyboard={true}
      rightIcon={
        <TouchableOpacity onPress={() => navigate(ROUTES.CREATE_CUSTOMER as never)}>
          <XIcon name="userPlus" width={24} height={24} color={theme.colors.primaryMain} />
        </TouchableOpacity>
      }
    >
      <View style={styles.container}>
        <XInput
          placeholder="Search by name or phone number..."
          value={searchString}
          onChangeText={handleSearch}
          iconLeft="search"
          keyboardType="default"
          iconRight={searchString ? <XIcon name="x" width={12} height={12} /> : undefined}
          onIconRightPress={handleClearSearch}
        />
        <FlatList
          data={customerList}
          keyExtractor={item => item.id?.toString() + item.cellPhone}
          renderItem={renderCustomerItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        // Có thể thêm onEndReached để làm pagination sau này
        />
      </View>
    </XScreen>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingTop: theme.spacing.sm,
    flex: 1
  },
  itemContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray200,
  }
});