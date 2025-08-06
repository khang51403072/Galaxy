import React, { useState, useMemo, useEffect, useRef } from 'react';
import XScreen from '@/shared/components/XScreen';
import XText from '@/shared/components/XText';
import XInput from '@/shared/components/XInput';
import XIcon from '@/shared/components/XIcon';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useCreateAppointmentStore, createAppointmentSelectors, CreateAppointmentState } from '../stores/createAppointmentStore';
import { useShallow } from 'zustand/react/shallow';
import { CustomerEntity } from '../types/CustomerResponse';
import { goBack, navigate } from '@/app/NavigationService';
import { appointmentSelectors, createAppointmentStore, useAppointmentStore } from '../stores/appointmentStore';
import { ROUTES } from '@/app/routes';
import { useTheme } from '@/shared/theme';
export default function SelectCustomerScreen() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const {customerList, getCustomerLookup} = useCreateAppointmentStore(useShallow((state) => ({
    customerList: createAppointmentSelectors.selectCustomerList(state),
    getCustomerLookup: createAppointmentSelectors.selectGetCustomerLookup(state),
  })));
  const {setSelectedCustomer} =  useCreateAppointmentStore(
    useShallow((state: CreateAppointmentState)=>({
      setSelectedCustomer: createAppointmentSelectors.selectSetSelectedCustomer(state),
     
    }))
  ) 
  const json = useAppointmentStore.getState().json// Sử dụng đúng property của CustomerEntity, ví dụ: firstName, cellPhone
  const filteredCustomers = useMemo(() => {
    if (!search) return customerList || [];
    return customerList?.filter(
      c =>
        c.cellPhone?.toLowerCase().includes(search.toLowerCase()) ||
        (c.firstName?.toLowerCase() + " " + c.lastName?.toLowerCase()).includes(search.toLowerCase())
    );
  }, [search, customerList]);

  // Chỉ cho nhập số vào input
  const handleSearch = (text: string) => {
    // Loại bỏ ký tự không phải số
    const onlyNumber = text;//.replace(/[^0-9]/g, '');
    setSearch(onlyNumber);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (onlyNumber.length === 0) {
      setPage(1);
      // getCustomerLookup(page, 10, '');
      return;
    }
    if (onlyNumber.length >= 3) {
      debounceRef.current = setTimeout(() => {
        setPage(1);
        // getCustomerLookup(page, 10, onlyNumber);
      }, 500);
    }
  };

  useEffect(() => {
    // getCustomerLookup(page, 10, '');
  }, []);

  return (
    <XScreen loading={isLoading} title="Select Customer" dismissKeyboard={true} 
    rightIcon={
      <TouchableOpacity onPress={()=>{
        navigate(ROUTES.CREATE_CUSTOMER as never);
      }}>
      <XIcon name="userPlus" width={24} height={24} color={theme.colors.primaryMain}  />
      </TouchableOpacity>
    }>
      <View style={{ paddingTop: 8 }}>
        <XInput
          placeholder="Search..."
          value={search}
          onChangeText={handleSearch}
          iconLeft="search"
          keyboardType="default"
          iconRight={search ? <XIcon name="x" width={12} height={12} /> : undefined}
          onIconRightPress={() => {
            setSearch('');
            // Không cần gọi lại API ở đây nữa vì handleSearch đã xử lý khi input rỗng
          }}
        />
        <FlatList
          data={filteredCustomers}
          keyExtractor={item => item.id?.toString() || item.cellPhone}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                goBack();
                setSelectedCustomer(item)
              }}
              style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}
            >
              <XText variant='titleRegular'>{item.firstName} {item.lastName}</XText>
              {json?.isShowPhone && <XText variant='bodyRegular'>{item.cellPhone}</XText>}
            </TouchableOpacity>
          )}
        />
      </View>
    </XScreen>
  );
} 