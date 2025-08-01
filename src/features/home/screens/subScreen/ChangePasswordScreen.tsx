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
import { goBack, reset } from '@/app/NavigationService';
import { ROUTES } from '@/app/routes';
import { appConfig } from '@/shared/utils/appConfig';
import { useBackHandler } from "@/shared/hooks/useBackHandler";
import { useXAlert } from '@/shared/components/XAlertContext';


export default function ChangePasswordScreen() {
 // Sử dụng functional update
const [showPass, setShowPass] = React.useState({
  oldPassword: true,
  newPassword: true,
  confirmPassword: true,
});

const toggleField = React.useCallback((field: keyof typeof showPass) => {
  setShowPass(prev => ({
    ...prev,
    [field]: !prev[field],
  }));
}, []);
  const logout = useUserStore(useShallow((state)=>userSelectors.selectLogout(state)));
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
      secureTextEntry: showPass.oldPassword,
      iconRight: showPass.oldPassword ? "showPassword" : "hidePassword",
      onIconRightPress: () => toggleField('oldPassword'),
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
      secureTextEntry: showPass.newPassword,
      iconRight: showPass.newPassword ? "showPassword" : "hidePassword",
      onIconRightPress: () => toggleField('newPassword'),
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: 'Enter your confirm password',
      // iconLeft: 'user',
      keyboardType: 'default',
      type: 'password',
      autoCapitalize: 'none',
      rules: {
        required: 'New password is required',
      },
      secureTextEntry: showPass.confirmPassword,
      iconRight: showPass.confirmPassword ? "showPassword" : "hidePassword",
      onIconRightPress: () => toggleField('confirmPassword'),
    },
   
  ];
  const navigation = useNavigation();

  useBackHandler(navigation, () => {
    
    console.log('back handler');
});
  const [visible, setVisible] = React.useState(false);
  const [defaultValues, setDefaultValues] = useState({
    newPassword: '',
    oldPassword: '',
    confirmPassword: ''
  });

  const setValueField = React.useCallback((field: keyof typeof defaultValues, value: string) => {
    setDefaultValues(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  
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
      oldPassword: data.oldPassword,
      confirmPassword: data.confirmPassword
    };
    setDefaultValues({
      newPassword: data.newPassword,
      oldPassword: data.oldPassword,
      confirmPassword: data.confirmPassword
    });
    setPendingData(changePasswordRequest);
    setVisible(true);
  };

  const showAlert = useXAlert();
  const handleConfirm = async () => {
    setVisible(false);
    const result = await changePassword(pendingData as ChangePasswordRequest);
    if (isSuccess(result)) {
      showAlert.showAlert({
        title: 'Success',
        message: 'Password changed successfully',
        type: 'success',
        onClose: async () => {
          useUserStore.setState({ error: null});
          await logout();
          await appConfig.clearAutoLogin();
          await appConfig.clearUseBiometric();
          reset([{ name: ROUTES.LOGIN }], 0);
        }
      });
      
     
    } else {
      useUserStore.setState({ error: result.error?.message});
    }
  };
  useEffect(() => {
    useUserStore.setState({ error: null });
  }, []);
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


