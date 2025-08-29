import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getNotifications, markAllNotificationAsRead, markNotificationAsRead, NotificationItem } from '@/shared/services/FirebaseNotificationService';
import XScreen from '@/shared/components/XScreen';
import { useTheme } from '@/shared/theme';
import XIcon from '@/shared/components/XIcon';
import XAlert from '@/shared/components/XAlert';
import XDialog from '@/shared/components/XDialog';
import XNoDataView from '@/shared/components/XNoDataView';
import { useHomeStore } from '../../stores/homeStore';
import { ROUTES } from '@/app/routes';
import { navigate } from '@/app/NavigationService';
import XAvatar from '@/shared/components/XAvatar';
import XText from '@/shared/components/XText';
import { appConfig } from '@/shared/utils/appConfig';
import { StoreItemEntity } from '@/features/auth/usecase/AuthUsecase';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useShallow } from 'zustand/react/shallow';





const SwitchStoreScreen = () => {
  const theme =  useTheme() ;
  const [stores, setStores] = useState<StoreItemEntity[]>();
  const {switchStore,isLoading} = useAuthStore( 
    useShallow((state) => ({switchStore: state.switchStore, isLoading: state.isLoading})),
  )

  const initData = useHomeStore(useShallow((state)=>state.initData))
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background},
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    item: { 
        padding: theme.spacing.sm, 
        borderRadius: theme.borderRadius.md, 
        backgroundColor: theme.colors.white, 
        flexDirection: "row", 
        alignItems: 'flex-start', 
        justifyContent:'flex-start',
        gap: theme.spacing.md,
        ...theme.shadows.sm
    },
    unread: { backgroundColor: theme.colors.unselectedNotify },
    title: { fontSize: 16, fontWeight: 'bold' },
    message: { fontSize: 14, marginTop: 4 },
    time: { fontSize: 12, color: '#888', marginTop: 4 },
    status: { fontSize: 12, color: '#00796b', marginTop: 4, fontStyle: 'italic' },
    empty: { textAlign: 'center', color: '#888', marginTop: 40 },
  });
  const loadStores = async () => {
    const user = await appConfig.getUser();
    const list: StoreItemEntity[] = user.switchableStores
    setStores(list);
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handlePress = async (item: StoreItemEntity) => {
    await switchStore(item)
    
    navigate(ROUTES.HOME);
    initData()
  };

  const renderItem = ({ item }: { item: StoreItemEntity }) => (
    <TouchableOpacity
      style={[styles.item]}
      onPress={() => handlePress(item)}
    > 
      <XAvatar uri={item.storeLogo} size={50} />
      <View style={{flexDirection:"column", justifyContent:"space-between", gap: theme.spacing.sm}}>
        <XText variant="titleRegular" style={{color: theme.colors.gray800}}>{item.storeName}</XText>
        <XText variant="bodyLight" style={{color: theme.colors.gray600}}>{item.address}</XText>
      </View>
      
    </TouchableOpacity>
  );
  const [isShowAlert, setShowAlert] = useState(false)

  return (
    <XScreen loading={isLoading} title='Switch Stores' style={styles.container} paddingHorizontal={0}>
      <FlatList
        data={stores}
        keyExtractor={item => item.masterStoreId+item.storeId}
        renderItem={renderItem}
        contentContainerStyle={{gap: theme.spacing.sm, paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.sm}}
        ListEmptyComponent={<XNoDataView />}
      />
      <XDialog onCancel={()=>setShowAlert(false)} onConfirm={()=>{setShowAlert(false);markAllNotificationAsRead().then(getNotifications) }} visible={isShowAlert} content={"Read all message?"}></XDialog>
    </XScreen>
  );
};



export default SwitchStoreScreen; 