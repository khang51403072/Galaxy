import React, { useEffect } from 'react';
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
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { ROUTES } from '../../../../app/routes';
import { ProfileSkeleton } from '../../components/ProfileSkeleton';
import { isFailure } from '../../../../shared/types/Result';
import { useTheme } from '../../../../shared/theme/ThemeProvider';
import { navigate, reset } from '@/app/NavigationService';
import { appConfig } from '@/shared/utils/appConfig';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  // User store for profile data with selectors
  const { profile, isLoading: profileLoading, getProfile, changePassword, logout, setIsUseFaceId, isUseFaceId } = useUserStore(
    useShallow((state) => ({
      profile: userSelectors.selectProfile(state),
      isLoading: userSelectors.selectIsLoading(state),
      getProfile: userSelectors.selectGetProfile(state),
      changePassword: userSelectors.selectChangePassword(state),
      logout: userSelectors.selectLogout(state),
      setIsUseFaceId: userSelectors.selectSetIsUseFaceId(state),
      isUseFaceId: userSelectors.selectIsUseFaceId(state),
    }))
  );

  // Avatar store (existing)
  const { avatarUri, isLoading: avatarLoading } = useAvatarStore(
    useShallow((state) => ({
      avatarUri: avatarSelectors.selectAvatarUri(state),
      isLoading: avatarSelectors.selectIsLoading(state),
    }))
  );

  const { updateAvatar, restoreAvatar } = useAvatarStore(
    useShallow((state) => ({
      updateAvatar: state.updateAvatar,
      restoreAvatar: state.restoreAvatar,
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
  }, []);
  // Load profile data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Kiểm tra xem có data mới từ UpdateProfileScreen không
      const updatedProfile = (route.params as any)?.updatedProfile;
      if (updatedProfile) {
        useUserStore.setState({ profile: updatedProfile });
      }
      else{
        loadProfile();
      }
    }, [route.params, navigation])
  );

  
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
    >
      {/* Header with gradient background */}
      <LinearGradient
        colors={theme.colors.primaryGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ width: '100%', height: '25%', alignItems: 'center', justifyContent: 'center' }}
      >
        <XAvatar
          uri={avatarUri || undefined} 
          size={120}
          onPickImage={handlePickImage}
          editable={!avatarLoading}
        />
      </LinearGradient>
      
      {/* Content Section */}
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <TitleGroup titleIcon="Edit" title="Information" icon="pen" onPress={() => {
          navigate(ROUTES.UPDATE_PROFILE)
          }
        } type="edit"/>
        <RowInfo titleLeft="Name" titleRight={getDisplayName()} />
        <RowInfo titleLeft="Phone" titleRight={profile?.phone || 'Loading...'} />
        <RowInfo titleLeft="Email" titleRight={profile?.email || 'Loading...'} />
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
        <RowInfo titleLeft="Start Date" titleRight={profile?.startDate || 'Loading...'} />
        <RowInfo titleLeft="Income" titleRight={getFormattedIncome() || 'Loading...'} />
        <RowInfo titleLeft="Store" titleRight={profile?.storeName || 'Loading...'} />
        <XDivider />
        <TitleGroup title="Sign In With Face ID" onPress={() => {}} type="switch" switchValue={isUseFaceId} onToggleChange={() => {
        setIsUseFaceId(!isUseFaceId);
        }} />
        
        <XButton
          title="Log out"
            onPress={async () => {
              await logout();
              reset([{ name: ROUTES.LOGIN }], 0);
            }}
          useGradient={false}
          backgroundColor={theme.colors.primary}
          style={{ borderRadius: 8, marginTop: 16 }}
        />
        <XText variant="content300" style={{ textAlign: 'center', marginTop: 16}}>
          Version 1.0.0
        </XText>
      </View>
    </XScreen>
  );
}
