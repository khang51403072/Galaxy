import React, { useEffect } from 'react';
import XScreen from '../../../shared/components/XScreen';
import XForm, { XFormField } from '../../../shared/components/XForm';
import { useUserStore, userSelectors } from '../stores/userStore';
import { useNavigation } from '@react-navigation/native';
import { isEmailValid, isPhoneValid } from '../../../shared/utils/validators';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../auth/stores/authStore';
import { isSuccess } from '../../../shared/types/Result';
import XDialog from '../../../shared/components/XDialog';
import { ChangePasswordRequest } from '../types/UpdateProfileTypes';

const fields: XFormField[] = [
  {
    name: 'oldPassword',
    label: 'Old Password',
    placeholder: 'Enter your old password',
    // iconLeft: 'user',
    autoCapitalize: 'none',
    keyboardType: 'default',
    type: 'password',
    rules: {
      required: 'Old password is required',
     
    },
  },
  {
    name: 'newPassword',
    label: 'New Password',
    placeholder: 'Enter your new password',
    // iconLeft: 'user',
    keyboardType: 'default',
    type: 'password',
    autoCapitalize: 'none',
    rules: {
      required: 'New password is required',
    },
  },
 
];
export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const [pendingData, setPendingData] = React.useState<ChangePasswordRequest | undefined>(undefined);
  const { isLoading, changePassword } = useUserStore(
    useShallow((state) => ({
      isLoading: userSelectors.selectIsLoading(state),
      changePassword: userSelectors.selectChangePassword(state),
    }))
  );
  const {employeeId} = useAuthStore(useShallow((state)=>{
    return {
      employeeId: state.employeeId,
    }
  })
);
  const handleSubmit = async (data: any) => {
    setErrorMessage(undefined);
    const changePasswordRequest: ChangePasswordRequest = {
      employeeId: employeeId || '',
      newPassword: data.newPassword,
    };
    setPendingData(changePasswordRequest);
    setVisible(true);
  };

  
  const handleConfirm = async () => {
    setVisible(false);
    const result = await changePassword(pendingData as ChangePasswordRequest);
    if (isSuccess(result)) {
      navigation.goBack();
    } else {
      setErrorMessage(result.error?.message || 'Change password failed');
    }
  };

  return (
    <XScreen title='Change Password' showHeader loading={isLoading} >
      <XForm fields={fields} onSubmit={handleSubmit} errorMessage={errorMessage} />
      <XDialog
        visible={visible}
        content= "Are you sure you want to change your password?"
        onCancel={() => setVisible(false)}
        onConfirm={handleConfirm}
        
      />
    </XScreen>
  );
}

