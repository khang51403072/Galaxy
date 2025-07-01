import React, { useEffect } from 'react';
import { View, Alert } from 'react-native';
import { XColors } from '../../../shared/constants/colors';
import XButton from '../../../shared/components/XButton';
import XDivider from '../../../shared/components/XDivider';
import XText from '../../../shared/components/XText';
import TitleGroup from '../components/TitleGroup';
import RowInfo from '../components/RowInfo';
import LinearGradient from 'react-native-linear-gradient';
import XAvatar from '../../../shared/components/XAvatar';
import { pickImageFromLibrary, pickImageFromCamera, checkPermission } from '../../../shared/services/ImagePickerService';
import { useAvatarStore, avatarSelectors } from '../stores/avatarStore';
import { useUserStore, userSelectors } from '../stores/userStore';
import { useShallow } from 'zustand/react/shallow';
import XScreen from '../../../shared/components/XScreen';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../../app/routes';

export default function ProfileScreen() {
  const navigation = useNavigation();
  
  // User store for profile data with selectors
  const { profile, isLoading: profileLoading, getProfile, changePassword } = useUserStore(
    useShallow((state) => ({
      profile: userSelectors.selectProfile(state),
      isLoading: userSelectors.selectIsLoading(state),
      getProfile: userSelectors.selectGetProfile(state),
      changePassword: userSelectors.selectChangePassword(state),
    }))
  );

  // Avatar store (existing)
  const { avatarUri, isLoading: avatarLoading, error } = useAvatarStore(
    useShallow((state) => ({
      avatarUri: avatarSelectors.selectAvatarUri(state),
      isLoading: avatarSelectors.selectIsLoading(state),
      error: avatarSelectors.selectError(state),
    }))
  );

  const { updateAvatar, restoreAvatar } = useAvatarStore(
    useShallow((state) => ({
      updateAvatar: state.updateAvatar,
      restoreAvatar: state.restoreAvatar,
    }))
  );


  // Load profile data on mount
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // Handle avatar errors
  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error);
    }
  }, [error]);

  const handlePickImage = async (type: 'camera' | 'library') => {
    try {
      const granted = await checkPermission(type);
      if (!granted) return;
      
      let asset = null;
      if (type === 'camera') {
        asset = await pickImageFromCamera();
      } else if (type === 'library') {
        asset = await pickImageFromLibrary();
      }
      
      if (asset?.uri) {
        await updateAvatar(asset.uri);
        console.log('Avatar updated:', asset.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Get display name from profile
  const getDisplayName = () => {
    if (profile) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return 'Loading...';
  };

  // Get formatted income
  const getFormattedIncome = () => {
    if (profile) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(profile.income);
    }
    return 'Loading...';
  };

  // Get full address
  const getFullAddress = () => {
    if (profile?.address) {
      const { address, unitNumber, city, state, zip } = profile.address;
      return `${address}${unitNumber ? ` Unit ${unitNumber}` : ''}, ${city}, ${state} ${zip}`;
    }
    return 'No address provided';
  };

  return (
    <XScreen
      loading={profileLoading}
      error={error}
      // onRetry={() => {
      //   getProfile();
      //   restoreAvatar();
      // }}
      paddingHorizontal={0}
      scrollable={true}
      onRefresh={() => {
        getProfile();
        }}
    >
      {/* Header with gradient background */}
      <LinearGradient
        colors={["#3B96F6", "#1D62D8"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ width: '100%', height: '25%', alignItems: 'center', justifyContent: 'center' }}
      >
        <XAvatar
          uri={avatarUri || profile?.image || undefined} 
          size={120}
          onPickImage={handlePickImage}
          editable={!profileLoading && !avatarLoading}
        />
      </LinearGradient>
      
      {/* Content Section */}
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <TitleGroup titleIcon="Edit" title="Information" icon="pen" onPress={() => {
          console.log('navigate to update profile');
          navigation.navigate(ROUTES.UPDATE_PROFILE as never)}} type="edit"/>
        <RowInfo titleLeft="Name" titleRight={getDisplayName()} />
        <RowInfo titleLeft="DOB" titleRight={'Loading...'} />
        <RowInfo titleLeft="Phone" titleRight={profile?.phone || 'Loading...'} />
        <RowInfo titleLeft="Email" titleRight={profile?.email || 'Loading...'} />
        <RowInfo titleLeft="Address" titleRight={getFullAddress()} />
        <XDivider />

        <TitleGroup 
          titleIcon="Change" 
          title="Password" 
          icon="pen" 
          onPress={() => {
            navigation.navigate(ROUTES.CHANGE_PASSWORD as never)}}
          type="edit" 
        />
        <XDivider />

        <TitleGroup title="Work Details" onPress={() => {}} />
        <RowInfo titleLeft="Start Date" titleRight={profile?.startDate || 'Loading...'} />
        <RowInfo titleLeft="Income" titleRight={getFormattedIncome() || 'Loading...'} />
        <RowInfo titleLeft="Store" titleRight={profile?.storeName || 'Loading...'} />
        <XDivider />
        <TitleGroup title="Sign In With Face ID" onPress={() => {}} type="switch" switchValue={true} onToggleChange={() => {}} />
        
        <XButton
          title="Log out"
          onPress={() => {}}
          useGradient={false}
          backgroundColor={XColors.primary}
          style={{ borderRadius: 8, marginTop: 16 }}
        />
        <XText variant="content300" style={{ textAlign: 'center', marginTop: 16}}>
          Version 1.0.0
        </XText>
      </View>
    </XScreen>
  );
}
