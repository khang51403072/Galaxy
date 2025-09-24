import XScreen from "@/shared/components/XScreen";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { userSelectors, useUserStore } from "../../stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import { avatarSelectors, useAvatarStore } from "../../stores/avatarStore";
import { HeaderProfile } from "../../components/HeaderProfile";
import { MECard, MECardItemProps } from "../../components/MECard";
import { XColumn } from "@/shared/components/XColumn";
import { navigate, reset } from "@/app/NavigationService";
import { ROUTES } from "@/app/routes";
import DeviceInfo from "react-native-device-info";
import { XRow } from "@/shared/components/XRow";
import XIcon from "@/shared/components/XIcon";
import { checkBiometricAvailable, simpleBiometricAuth } from "@/shared/services/BiometricService";
import { appConfig } from "@/shared/utils/appConfig";
import { useCallback, useEffect, useMemo } from "react";
import { useXAlert } from "@/shared/components/XAlertContext";
import { View } from "react-native";
import { BiometricSettingButton } from "../../components/BiometricSettingButton";


export default function ProfileScreenNew() {
  const accountListActions = useMemo(
    () => [
      { title: "Profile", leftIcon: "profile", onAction: () => { navigate(ROUTES.PROFILE) } } as MECardItemProps,
      { title: "Theme", leftIcon: "swatches", onAction: () => { navigate(ROUTES.CHANGE_THEME) } } as MECardItemProps,
    ], []
  )
  
  const financeListActions = useMemo(
    () => [
      { title: "Buy Credits", leftIcon: "buyCredits", onAction: () => { showAlert({ message: "This feature is not available yet" }) } } as MECardItemProps,
      { title: "Subscriptions", leftIcon: "subscriptions", onAction: () => { showAlert({ message: "This feature is not available yet" }) } } as MECardItemProps,
      { title: "Invoices", leftIcon: "invoices", onAction: () => { showAlert({ message: "This feature is not available yet" }) } } as MECardItemProps,
      { title: "Statements", leftIcon: "statements", onAction: () => { showAlert({ message: "This feature is not available yet" }) } } as MECardItemProps,
    ], [])

  const backOfficeActions = useMemo(() => [
    {
      title: "Employees", leftIcon: "group", onAction: () => {
        showAlert({ message: "This feature is not available yet" })
      }
    } as MECardItemProps,
  ], [])

  const theme = useTheme();
  const { showAlert } = useXAlert();

  const { 
    profile,
    isLoading,
    isUseFaceId,
    showTooltip,
    getProfile,
    logout,
    setIsUseFaceId,
    setShowTooltip,
  } = useUserStore(
    useShallow((state) => ({
      profile: userSelectors.selectProfile(state),
      isLoading: userSelectors.selectIsLoading(state),
      isUseFaceId: userSelectors.selectIsUseFaceId(state),
      showTooltip: userSelectors.selectShowTooltip(state),
      getProfile: userSelectors.selectGetProfile(state),
      logout: userSelectors.selectLogout(state),
      setIsUseFaceId: userSelectors.selectSetIsUseFaceId(state),
      setShowTooltip: userSelectors.selectSetShowTooltip(state),
    }))
  );

  const { avatarUri, } = useAvatarStore(
    useShallow((state) => ({
      avatarUri: avatarSelectors.selectAvatarUri(state),
    }))
  );
  // Load isUseFaceId from appConfig
  useEffect(
    () => {
      console.log("load profile")
      appConfig.getUseBiometric().then(isUseFaceId => {
        setIsUseFaceId(isUseFaceId ?? false);
      });
      getProfile()
    }
    , []
  )
  const handleToggle = useCallback(
    async (currentValue: boolean) => {
      try {
        const available = await checkBiometricAvailable();
        if (!available) {
          return;
        }
        const result = await simpleBiometricAuth();
        if (result) {
          appConfig.saveUseBiometric(currentValue);
          setIsUseFaceId(currentValue);
        }
        else {
          setIsUseFaceId(false);
        }
      } catch (error) {
        setIsUseFaceId(false);
        useUserStore.setState({ error: 'Authentication failed' });
      }
    }, [setIsUseFaceId]);
  
  const view = <View></View>
  const handleLogout = useCallback(
    async () => {
      await logout();
      reset([{ name: ROUTES.LOGIN }], 0);
    },[logout, reset]
  )
  const versionText = useMemo(
    () => <XRow justify="center" align="center" style={{ marginBottom: theme.spacing.md }}>
      <XIcon name="copyright" height={theme.spacing.md} width={theme.spacing.md}></XIcon>
      <XText variant="captionLight" style={{ textAlign: 'center', color: theme.colors.gray600 }}>
        2025 XSoftware - {DeviceInfo.getVersion()}
      </XText>
    </XRow>, [theme]
  )

  const faceIDActions = useMemo(() => [
    {
      title: "Sign In With Face ID",
      leftIcon: 'faceID',
      right: <BiometricSettingButton isShowTooltip={showTooltip} isUseFaceId={isUseFaceId} setShowTooltip={setShowTooltip} handleToggle={handleToggle}></BiometricSettingButton>
    } as MECardItemProps,
  ], [showTooltip, isUseFaceId, setShowTooltip, handleToggle]);
  const logoutAction = useMemo(() => [
    {
      title: "Log Out", leftIcon: "signOut", right: view, onAction: handleLogout,
     
    } as MECardItemProps
  ], []);
  return <XScreen padding={0} haveBottomTabBar={true} scrollable loading={isLoading}>
    <HeaderProfile avatarUri={avatarUri} profile={profile}></HeaderProfile>
    <XColumn style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md }} gap={theme.spacing.md}>
      <MECard title="Account"
        listActions={accountListActions} />
      <MECard title="Finance"
        listActions={financeListActions} />
      <MECard title="Back Office"
        listActions={backOfficeActions} />
      <MECard
        listActions={faceIDActions} />
      <MECard listActions={logoutAction} />
      {versionText}
    </XColumn>
  </XScreen>
}