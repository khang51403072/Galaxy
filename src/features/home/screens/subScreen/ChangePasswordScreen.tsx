import React, { useEffect, useState } from 'react';
import XScreen from '../../../../shared/components/XScreen';
import XForm, { XFormField } from '../../../../shared/components/XForm';
import { useUserStore, userSelectors } from '../../stores/profileStore';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../../auth/stores/authStore';
import { isSuccess } from '../../../../shared/types/Result';
import XDialog from '../../../../shared/components/XDialog';
import { ChangePasswordRequest } from '../../types/ProfileRequest';
import { goBack } from '@/app/NavigationService';


export default function ChangePasswordScreen() {
  const [{
    oldPassword,
    newPassword
  }, setShowPass] = React.useState({
    oldPassword: true,
    newPassword: true
  });
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
      secureTextEntry: oldPassword,
      iconRight: oldPassword ? "showPassword" : "hidePassword",
      onIconRightPress: () => setShowPass({oldPassword: !oldPassword, newPassword: newPassword}),
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
      secureTextEntry: newPassword,
      iconRight: newPassword ? "showPassword" : "hidePassword",
      onIconRightPress: () => setShowPass({oldPassword: oldPassword, newPassword: !newPassword}),
    },
   
  ];
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const [defaultValues, setDefaultValues] = useState({
    newPassword: '',
    oldPassword: ''
  });
  
  const [pendingData, setPendingData] = React.useState<ChangePasswordRequest | undefined>(undefined);
  const { isLoading, changePassword, error } = useUserStore(
    useShallow((state) => ({
      isLoading: userSelectors.selectIsLoading(state),
      changePassword: userSelectors.selectChangePassword(state),
      error: userSelectors.selectError(state),
    }))
  );
  const {employeeId} = useAuthStore(useShallow((state)=>{
    return {
      employeeId: state.employeeId,
    }
  })
);
  const handleSubmit = async (data: any) => {
    const changePasswordRequest: ChangePasswordRequest = {
      employeeId: employeeId || '',
      newPassword: data.newPassword,
    };
    setDefaultValues({
      newPassword: data.newPassword,
      oldPassword: data.oldPassword
    });
    setPendingData(changePasswordRequest);
    setVisible(true);
  };

  
  const handleConfirm = async () => {
    setVisible(false);
    const result = await changePassword(pendingData as ChangePasswordRequest);
    if (isSuccess(result)) {
      goBack();
    } else {
      useUserStore.setState({ error: result.error?.message});
    }
  };

  return (
    <XScreen title='Change Password' showHeader loading={isLoading} error={error} >
      <XForm style={{paddingTop: 16}} gap={16} fields={fields} onSubmit={handleSubmit} defaultValues={defaultValues} />
      <XDialog
        visible={visible}
        content= "Are you sure you want to change your password?"
        onCancel={() => setVisible(false)}
        onConfirm={handleConfirm}
        
      />
    </XScreen>
  );
}

