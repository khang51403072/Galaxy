import React from 'react';
import XScreen from '../../../shared/components/XScreen';
import XForm, { XFormField } from '../../../shared/components/XForm';
import { useUserStore } from '../stores/userStore';
import { useNavigation } from '@react-navigation/native';
import { isEmailValid, isPhoneValid } from '../../../shared/utils/validators';

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
    rules: {
      required: 'Phone is required',
      validate: (v: string) => isPhoneValid(v) || 'Phone is invalid',
    },
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
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

export default function UpdateInfoForm() {
  const { profile, isLoading, getProfile } = useUserStore();
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);

  // Lấy giá trị mặc định từ profile
  const defaultValues = React.useMemo(() => ({
    name: profile ? (profile.firstName + (profile.lastName ? ' ' + profile.lastName : '')) : '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    address: profile?.address?.address || '',
  }), [profile]);

  const handleSubmit = async (data: any) => {
    setErrorMessage(undefined);
    try {
      const { updateProfile } = await import('../usecase/ProfileUseCase');
      const { isSuccess } = await import('../../../shared/types/Result');
      // Tách firstName, lastName từ name
      const [firstName, ...lastArr] = data.name.trim().split(' ');
      const lastName = lastArr.join(' ');
      const updateData: any = {
        firstName,
        lastName,
        phone: data.phone,
        email: data.email,
        address: { address: data.address },
      };
      const result = await updateProfile(updateData);
      if (isSuccess(result)) {
        await getProfile();
        navigation.goBack();
      } else {
        setErrorMessage(result.error.message);
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Update failed');
    }
  };

  return (
    <XScreen keyboardAvoiding dismissKeyboard title="Information" showHeader>
      <XForm
        fields={fields}
        onSubmit={handleSubmit}
        loading={isLoading}
        confirmTitle="Update"
        errorMessage={errorMessage}
        defaultValues={defaultValues}
      />
    </XScreen>
  );
} 