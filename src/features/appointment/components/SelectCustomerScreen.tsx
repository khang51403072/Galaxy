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
import { useCreateAppointmentStore } from '../stores/createAppointmentStore';
import { useAppointmentStore } from '../stores/appointmentStore'; // Giữ lại để lấy config

export default function SelectCustomerScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // --- SỬ DỤNG STORE MỚI: useAppointmentFormStore ---
  const { customerList, getCustomerLookup, setSelectedCustomer } = useCreateAppointmentStore(
    useShallow((state) => ({
      customerList: state.customerList,
      getCustomerLookup: state.getCustomerLookup,
      setSelectedCustomer: state.setSelectedCustomer,
    }))
  );
  
  // Lấy config isShowPhone từ store chung của feature Appointment
  const isShowPhone = useAppointmentStore(state => state.json?.isShowPhone);

  const fetchData = useCallback(async (currentPage: number, searchTerm: string) => {
    setIsLoading(true);
    await getCustomerLookup(currentPage, 20, searchTerm); // Tăng pageSize để có nhiều kết quả hơn
    setIsLoading(false);
  }, [getCustomerLookup]);

  // useEffect để tải danh sách ban đầu
  useEffect(() => {
    fetchData(1, '');
  }, [fetchData]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (debounceRef.current) {
        clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
        setPage(1); // Reset page khi tìm kiếm mới
        fetchData(1, text);
    }, 500); // 500ms debounce
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    fetchData(1, '');
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
          value={search}
          onChangeText={handleSearch}
          iconLeft="search"
          keyboardType="default"
          iconRight={search ? <XIcon name="x" width={12} height={12} /> : undefined}
          onIconRightPress={handleClearSearch}
        />
        <FlatList
          data={customerList}
          keyExtractor={item => item.id?.toString() || item.cellPhone}
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