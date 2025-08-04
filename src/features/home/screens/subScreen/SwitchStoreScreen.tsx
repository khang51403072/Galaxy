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


 export type StoreEntity = {
  url: string;
  name: string;
  address: string;
  
 }


const SwitchStoreScreen = () => {
  const theme =  useTheme() ;
  const [stores, setStores] = useState<StoreEntity[]>();
  const { selectedStore, setSelectedStore } = useHomeStore();
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
    const list: StoreEntity[] = [{
        url: "https://www.google.com",
        name: "Store 1",
        address: "123 Main St, Anytown, USA"
      },
      {
        url: "https://www.google.com",
        name: "Store 2",
        address: "321 Main St, Anytown, USA"
      }]
    setStores(list);
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handlePress = async (item: StoreEntity) => {
    setSelectedStore(item);
    navigate(ROUTES.HOME);
  };

  const renderItem = ({ item }: { item: StoreEntity }) => (
    <TouchableOpacity
      style={[styles.item]}
      onPress={() => handlePress(item)}
    > 
      <XAvatar uri={item.url} size={50} />
      <View style={{flexDirection:"column", justifyContent:"space-between", gap: theme.spacing.sm}}>
        <XText variant="titleRegular" style={{color: theme.colors.gray800}}>{item.name}</XText>
        <XText variant="bodyLight" style={{color: theme.colors.gray600}}>{item.address}</XText>
      </View>
      
    </TouchableOpacity>
  );
  const [isShowAlert, setShowAlert] = useState(false)

  return (
    <XScreen title='Switch Stores' style={styles.container} paddingHorizontal={0}>
      <FlatList
        data={stores}
        keyExtractor={item => item.url}
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