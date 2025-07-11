import React, { useEffect, useState } from 'react';
import XScreen from '../../../../shared/components/XScreen';
import XForm, { XFormField } from '../../../../shared/components/XForm';
import { useUserStore, userSelectors } from '../../stores/profileStore';
import { useNavigation } from '@react-navigation/native';
import { isEmailValid, isPhoneValid } from '../../../../shared/utils/validators';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../../auth/stores/authStore';
import { isSuccess } from '../../../../shared/types/Result';
import XDialog from '../../../../shared/components/XDialog';
import { ChangePasswordRequest } from '../../types/ProfileRequest';
import { ROUTES } from '@/navigation/routes';
import XIcon from '@/shared/components/XIcon';


export default function NotificationScreen() {
  
  
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
   
  
  const [pendingData, setPendingData] = React.useState<ChangePasswordRequest | undefined>(undefined);
  
  const {employeeId} = useAuthStore(useShallow((state)=>{
    return {
      employeeId: state.employeeId,
    }
  })
);
  const handleSubmit = async (data: any) => {
    
  };

  
  const handleConfirm = async () => {
   
  };

  return (
    <XScreen title='Notification' showHeader >
      
      <XDialog
        visible={visible}
        content= "Are you sure you want to change your password?"
        onCancel={() => setVisible(false)}
        onConfirm={handleConfirm}
        
      />
    </XScreen>
  );
}

