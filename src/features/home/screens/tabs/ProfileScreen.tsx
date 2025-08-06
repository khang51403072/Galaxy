import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import XButton from '../../../../shared/components/XButton';
import XDivider from '../../../../shared/components/XDivider';
import XText from '../../../../shared/components/XText';
import TitleGroup from '../../components/TitleGroup';
import RowInfo from '../../components/RowInfo';
import LinearGradient from 'react-native-linear-gradient';
import XAvatar from '../../../../shared/components/XAvatar';
import { pickImageFromLibrary, pickImageFromCamera, checkPermission } from '../../../../shared/services/ImagePickerService';
import { useAvatarStore, avatarSelectors } from '../../stores/avatarStore';
import { useUserStore, userSelectors } from '../../stores/profileStore';
import { useShallow } from 'zustand/react/shallow';
import XScreen from '../../../../shared/components/XScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from '../../../../app/routes';
import { ProfileSkeleton } from '../../components/ProfileSkeleton';
import { isFailure, isSuccess } from '../../../../shared/types/Result';
import { useTheme } from '../../../../shared/theme/ThemeProvider';
import { navigate, reset } from '@/app/NavigationService';
import { appConfig } from '@/shared/utils/appConfig';
import { checkBiometricAvailable, simpleBiometricAuth } from '@/shared/services/BiometricService';
import DeviceInfo from 'react-native-device-info';
import { useHomeStore } from '../../stores/homeStore';

export default function ProfileScreen() {
  const route = useRoute<any>();
  const theme = useTheme();
  // User store for profile data with selectors
  const { profile, 
    isLoading: profileLoading, 
    getProfile, 
    logout, 
    setIsUseFaceId, 
    isUseFaceId, 
    uploadAvatar,
    setShowTooltip,
    showTooltip
     } = useUserStore(
    useShallow((state) => ({
      profile: userSelectors.selectProfile(state),
      isLoading: userSelectors.selectIsLoading(state),
      getProfile: userSelectors.selectGetProfile(state),
      changePassword: userSelectors.selectChangePassword(state),
      logout: userSelectors.selectLogout(state),
      setIsUseFaceId: userSelectors.selectSetIsUseFaceId(state),
      isUseFaceId: userSelectors.selectIsUseFaceId(state),
      uploadAvatar: userSelectors.selectUploadAvatar(state),
      setShowTooltip:userSelectors.selectSetShowTooltip(state),
      showTooltip: userSelectors.selectShowTooltip(state),
    }))
  );

  // Avatar store (existing)
  const { avatarUri, isLoading: avatarLoading } = useAvatarStore(
    useShallow((state) => ({
      avatarUri: avatarSelectors.selectAvatarUri(state),
      isLoading: avatarSelectors.selectIsLoading(state),
    }))
  );

  const loadProfile = async () => {
    const profile = await getProfile();
    if(isFailure(profile)) {
      useUserStore.setState({ error: profile.error.message });
    }
    else{
      useUserStore.setState({ profile: profile.value });
      useAvatarStore.setState({ avatarUri: profile.value.image });
      const json = await appConfig.getUser();
      if(json) {
        json.avatarUri = profile.value.image;
        await appConfig.saveUser(json);
      }
    }
  }
  // Load isUseFaceId from appConfig
  useEffect(() => {
    appConfig.getUseBiometric().then(isUseFaceId => {
      setIsUseFaceId(isUseFaceId??false);
    });
    loadProfile();
  }, []);
 
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
        // await updateAvatar(asset.uri);
        const uploadResult = await uploadAvatar(asset);
        if(isSuccess(uploadResult)) {
          useAvatarStore.setState({ avatarUri: asset.uri??'' });
          useHomeStore.getState().getHomeData();
        }
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
    return '';
  };

  // Get formatted income
  const getFormattedIncome = () => {
    if (profile) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(profile.income);
    }
    return '';
  };

  // Get full address
  const getFullAddress = () => {
    if (profile?.address) {
      const { address, unitNumber, city, state, zip } = profile.address;
      return `${address}${unitNumber ? ` Unit ${unitNumber}` : ''}, ${city}, ${state} ${zip}`;
    }
    return 'No address provided';
  };

  const isLoading = profileLoading || avatarLoading;

  return (
    <XScreen
      loading={isLoading}
      skeleton={<ProfileSkeleton />}
      paddingHorizontal={0}
      scrollable={true}
      onRefresh={() => {
        loadProfile();
        }}
      haveBottomTabBar={true}
    >
      {/* Header with gradient background */}
      <LinearGradient
        colors={theme.colors.primaryGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 1]}
        style={{gap: theme.spacing.sm, flexDirection: 'column', width: '100%', height: '25%', alignItems: 'center', justifyContent: 'center' }}
      >
        <XAvatar
          uri={avatarUri || undefined} 
          size={100}
          onPickImage={handlePickImage}
          editable={!avatarLoading}
        />
        <XText variant='titleMedium' style={{ color: theme.colors.white }}>
          {getDisplayName()}
        </XText>
      </LinearGradient>
      
      {/* Content Section */}
      <View style={{ width: '100%', paddingHorizontal: theme.spacing.md, gap: theme.spacing.sm, paddingTop: theme.spacing.md }}>
        <TitleGroup  titleIcon="Edit" title="Information" icon="pen" onPress={() => {
          navigate(ROUTES.UPDATE_PROFILE)
          }
        } type="edit"/>
        <RowInfo titleLeft="Name" titleRight={getDisplayName()} />
        <RowInfo titleLeft="Phone" titleRight={profile?.phone || ''} />
        <RowInfo titleLeft="Email" titleRight={profile?.email || ''} />
        <RowInfo titleLeft="Address" titleRight={getFullAddress()} />
        <XDivider />
        <TitleGroup 
          titleIcon="Change" 
          title="Password" 
          icon="pen" 
          onPress={() => {
            navigate(ROUTES.CHANGE_PASSWORD)}}
          type="edit" 
        />
        <XDivider />

        <TitleGroup title="Work Details" onPress={() => {}} />
        <RowInfo titleLeft="Start Date" titleRight={ (profile?.startDate?.toDDMMYYYY("/") || '')} />
        <RowInfo titleLeft="Income" titleRight={getFormattedIncome() || ''} />
        <RowInfo titleLeft="Store" titleRight={profile?.storeName || ''} />
        <XDivider />
        <TitleGroup 
          titleIcon="Change" 
          title="Theme" 
          icon="pen" 
          onPress={() => {
            navigate(ROUTES.CHANGE_THEME)}}
          type="edit" 
        />
        <XDivider />
        <TitleGroup isShowTooltip={showTooltip} onCloseTooltip={
          () => setShowTooltip(false)} title="Sign In With Face ID" 
          onPress={() => {}} 
          type="switch" 
          switchValue={isUseFaceId} 
          onToggleChange={async () => {
            try{
            const  available = await checkBiometricAvailable();
            if (!available) {
             return;
            }
            const result = await simpleBiometricAuth();
            if(result) {        
              appConfig.saveUseBiometric(!isUseFaceId);
              setIsUseFaceId(!isUseFaceId);
            }
            else{
              setIsUseFaceId(false);
            }
            }catch(error){
              setIsUseFaceId(false);
              useUserStore.setState({ error: 'Authentication failed' });
            }
        }} />
        
        
        <XButton
          title="Log out"
            onPress={async () => {
              await logout();
              reset([{ name: ROUTES.LOGIN }], 0);
            }}
          useGradient={false}
          backgroundColor={theme.colors.primaryMain}
          style={{ borderRadius: theme.borderRadius.md, marginTop: theme.spacing.md }}
        />
        <XText variant="captionLight" style={{ textAlign: 'center', marginTop: 16}}>
          Version {DeviceInfo.getVersion()}
        </XText>
      </View>
      
    </XScreen>
  );
}
