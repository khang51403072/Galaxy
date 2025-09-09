import XScreen from "@/shared/components/XScreen";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { userSelectors, useUserStore } from "../../stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import { avatarSelectors, useAvatarStore } from "../../stores/avatarStore";
import {HeaderProfile} from "../../components/HeaderProfile";
import { MECard, MECardItemProps } from "../../components/MECard";
import { XColumn } from "@/shared/components/XColumn";
import { navigate, reset } from "@/app/NavigationService";
import { ROUTES } from "@/app/routes";
import DeviceInfo from "react-native-device-info";
import { XRow } from "@/shared/components/XRow";
import XIcon from "@/shared/components/XIcon";
import Tooltip from "react-native-walkthrough-tooltip";
import { checkBiometricAvailable, simpleBiometricAuth } from "@/shared/services/BiometricService";
import { appConfig } from "@/shared/utils/appConfig";
import XSwitch from "@/shared/components/XSwitch";
import { TouchableOpacity } from "react-native";
import { useCallback, useEffect, useMemo } from "react";

const accountListActions = [
  {title: "Profile", icon: "profile", onAction:()=>{navigate(ROUTES.PROFILE)}} as MECardItemProps,
  {title: "Theme", icon: "swatches", onAction:()=>{navigate(ROUTES.CHANGE_THEME)}} as MECardItemProps,
]

const financeListActions = [
  {title: "Buy Credits", icon: "buyCredits", onAction:()=>{navigate(ROUTES.REVIEW)}} as MECardItemProps,
  {title: "Subscriptions", icon: "subscriptions", onAction:()=>{navigate(ROUTES.CHANGE_THEME)}} as MECardItemProps,
  {title: "Invoices", icon: "invoices", onAction:()=>{navigate(ROUTES.CHANGE_THEME)}} as MECardItemProps,
  {title: "Statements", icon: "statements", onAction:()=>{navigate(ROUTES.CHANGE_THEME)}} as MECardItemProps,
]
export default function ProfileScreenNew(){
    const theme = useTheme();
    const { profile, 
        isLoading, 
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
    
    const { avatarUri, } = useAvatarStore(
        useShallow((state) => ({
          avatarUri: avatarSelectors.selectAvatarUri(state),
          
        }))
      );

   
    // Load isUseFaceId from appConfig
    useEffect(
      () =>  {
        console.log("load profile")
        appConfig.getUseBiometric().then(isUseFaceId => {
          setIsUseFaceId(isUseFaceId??false);
        });
        getProfile()
      }
      ,[]
    )
    const handleToggle = useCallback(
      async (currentValue:boolean) => {
      try{
        const  available = await checkBiometricAvailable();
        if (!available) {
          return;
        }
        const result = await simpleBiometricAuth();
        if(result) {        
          appConfig.saveUseBiometric(currentValue);
          setIsUseFaceId(currentValue);
        }
        else{
          setIsUseFaceId(false);
        }
      }catch(error){
        setIsUseFaceId(false);
        useUserStore.setState({ error: 'Authentication failed' });
      }
    },[setIsUseFaceId]) 
    

    const actionButton = useMemo(
      () => (
        <Tooltip
          isVisible={showTooltip}
          content={<XText variant="captionLight">Click here to enable FaceID/TouchID for next login!</XText>}
          placement="bottom"
          onClose={()=>setShowTooltip(false)}
          showChildInTooltip={true}
          childContentSpacing={0}
          contentStyle={{ padding: 12 }}
        >
          <XSwitch value={isUseFaceId} onValueChange={handleToggle} />
        </Tooltip>
      ), 
      [showTooltip,isUseFaceId,setShowTooltip,handleToggle] // Thêm dependency
    );

    const logOutCard = useMemo( // Dùng useMemo ở đây cũng tốt
      () => (
        <TouchableOpacity onPress={async () => {
            await logout();
            reset([{ name: ROUTES.LOGIN }], 0);
        }}>
            <MECard listActions={[{ title: "Log Out", icon: "signOut" }]}/>
        </TouchableOpacity>
      ), 
      [logout] // Thêm dependency
    );


    const versionText = useMemo(
      ()=><XRow justify="center" align="center" style={{marginBottom:theme.spacing.md}}> 
          <XIcon name="copyright" height={theme.spacing.md} width={theme.spacing.md}></XIcon>
          <XText variant="captionLight" style={{ textAlign: 'center', color: theme.colors.gray600}}>
            2025 XSoftware - {DeviceInfo.getVersion()}
          </XText>
        </XRow>,[theme]
    )
    console.log("profileLoading", isLoading)
    return <XScreen padding={0} haveBottomTabBar={true} scrollable loading={isLoading}>
      <HeaderProfile avatarUri={avatarUri} profile={profile}></HeaderProfile>
      <XColumn style={{paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md}} gap={theme.spacing.md}>
        <MECard title="Account" 
          listActions={accountListActions}/>
        <MECard title="Finance" 
          listActions={financeListActions}/>
        <MECard  
          listActions={[
            {
              title: "Sign In With Face ID", 
              icon:'faceID',
              actionButton: actionButton} as MECardItemProps,
          ]}/>
        {logOutCard}
        {versionText}
      </XColumn>
       
    </XScreen>
}