import XAvatar from "@/shared/components/XAvatar";
import XScreen from "@/shared/components/XScreen";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { LinearGradient } from "react-native-linear-gradient";
import { userSelectors, useUserStore } from "../../stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import { avatarSelectors, useAvatarStore } from "../../stores/avatarStore";
import HeaderProfile from "../../components/HeaderProfile";
import { MECard, MECardItemProps } from "../../components/MECard";
import { XColumn } from "@/shared/components/XColumn";
import { navigate } from "@/app/NavigationService";
import { ROUTES } from "@/app/routes";

export default function ProfileScreenNew(){
    const theme = useTheme();
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
    const { avatarUri, isLoading: avatarLoading } = useAvatarStore(
        useShallow((state) => ({
          avatarUri: avatarSelectors.selectAvatarUri(state),
          isLoading: avatarSelectors.selectIsLoading(state),
        }))
      );
    return <XScreen title="Profile" padding={0} >
       <HeaderProfile></HeaderProfile>
        <XColumn style={{paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md}} gap={theme.spacing.sm}>
            <MECard title="Account" 
                listActions={[
                    {title: "Profile", icon: "profile", onAction:()=>{navigate(ROUTES.PROFILE)}} as MECardItemProps,
                    {title: "Theme", icon: "swatches"} as MECardItemProps]}/>
            <MECard title="Account" 
                listActions={[
                    {title: "Profile", icon: "profile"} as MECardItemProps,
                    {title: "Theme", icon: "swatches"} as MECardItemProps]}/>
            <MECard  
                listActions={[
                    {title: "Profile", icon: "profile"} as MECardItemProps,
                    ]}/>
            <MECard  
                listActions={[
                    {title: "Profile", icon: "profile"} as MECardItemProps,
                    ]}/>
       </XColumn>
       
    </XScreen>
}