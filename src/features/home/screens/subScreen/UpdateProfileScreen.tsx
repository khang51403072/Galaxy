import React, { useEffect } from 'react';
import XScreen from '../../../../shared/components/XScreen';
import XForm, { XFormField } from '../../../../shared/components/XForm';
import { useUserStore, userSelectors } from '../../stores/profileStore';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../../../app/routes';
import { isEmailValid, isPhoneValid } from '../../../../shared/utils/validators';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '../../../auth/stores/authStore';
import { isSuccess } from '../../../../shared/types/Result';
import XDialog from '../../../../shared/components/XDialog';
import { goBack } from '@/app/NavigationService';

const fields: XFormField[] = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your name',
    // iconLeft: 'user',
    autoCapitalize: 'words',
    rules: {
      required: 'Name is required',
      minLength: { value: 2, message: 'Name must be at least 2 characters' },
    },
  },
  {
    name: 'phone',
    label: 'Phone',
    placeholder: 'Enter your phone',
    // iconLeft: 'user',
    keyboardType: 'phone-pad',
    type: 'phone',
    rules: {
      required: 'Phone is required',
      validate: (v: string) => isPhoneValid(v) || 'Phone is invalid',
    },
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    // iconLeft: 'user',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    rules: {
      required: 'Email is required',
      validate: (v: string) => isEmailValid(v) || 'Email is invalid',
    },
  },
  {
    name: 'address',
    label: 'Address',
    placeholder: 'Enter your address',
    // iconLeft: 'home',
    rules: {
      required: 'Address is required',
    },
  },
];

export default function UpdateProfileScreen() {
  const navigation = useNavigation();
  const employeeId = useAuthStore((state) => state.employeeId);
  
  const { profile, isUpdating, updateProfile } = useUserStore(
    useShallow((state) => ({
      profile: userSelectors.selectProfile(state),
      isUpdating: userSelectors.selectIsUpdating(state),
      updateProfile: userSelectors.selectUpdateProfile(state),
    }))
  );

  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
  const [visible, setVisible] = React.useState(false);
  const [pendingData, setPendingData] = React.useState<any>(null);

  // Lấy giá trị mặc định từ profile
  const defaultValues = React.useMemo(() => ({
    name: profile ? (profile.firstName + (profile.lastName ? ' ' + profile.lastName : '')) : '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    address: profile?.address?.address || '',
  }), [profile]);
  
  const handleSubmit = async (data: any) => {
    console.log('Form data:', data);
    setErrorMessage(undefined);
    const updateRequest = {
      employeeId: employeeId || '',
      fullName: data.name,
      phone: data.phone,
      email: data.email,
      address: { 
        address: data.address,
        unitNumber: '',
        city: '',
        state: '',
        zip: ''
      },
    };
    setPendingData(updateRequest);
    setVisible(true);
    
  };

  const handleConfirm = async () => {
    setVisible(false);
    const result = await updateProfile(pendingData);
      
    if (isSuccess(result)) {
      // Success - back về Profile screen với data mới
      
      useUserStore.setState({ profile: result.value });
      goBack();
    } else {
      // Error - hiển thị error message
      setErrorMessage(result.error.message);
    }
  };  
  return (
    <XScreen title="Information" showHeader loading={isUpdating} error={errorMessage}>
      <XForm
        style={{paddingTop: 16, paddingBottom: 8}}
        gap={16}
        fields={fields}
        onSubmit={handleSubmit}
        loading={isUpdating}
        confirmTitle="Confirm"
        errorMessage={errorMessage}
        defaultValues={defaultValues as any}
      />
      <XDialog
        visible={visible}
        content="Are you sure you want to update your information?"
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
      />
    </XScreen>
  );
} 