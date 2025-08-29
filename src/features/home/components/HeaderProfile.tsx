import XAvatar from "@/shared/components/XAvatar";
import { Theme, useTheme } from "@/shared/theme";
import { useMemo } from "react";
import LinearGradient from "react-native-linear-gradient";
import { useShallow } from "zustand/react/shallow";
import { avatarSelectors, useAvatarStore } from "../stores/avatarStore";
import XText from "@/shared/components/XText";
import { useUserStore } from "../stores/profileStore";

export default function HeaderProfile()
{
    const theme = useMemo<Theme>(()=> useTheme(),[])
     const { avatarUri, isLoading: avatarLoading } = useAvatarStore(
        useShallow((state) => ({
            avatarUri: avatarSelectors.selectAvatarUri(state),
            isLoading: avatarSelectors.selectIsLoading(state),
        }))
    );

    const profile = useUserStore(useShallow((state)=>state.profile))
    return <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                locations={[0, 1]}
                style={{gap: theme.spacing.sm, flexDirection: 'column', width: '100%', height: '25%', alignItems: 'center', justifyContent: 'center' }}
            >
            <XAvatar
                uri={avatarUri || undefined} 
                size={100}
                editable={false}
            />
            <XText variant='titleMedium' style={{ color: theme.colors.white }}>
                {`${profile?.firstName} ${profile?.lastName}`}
            </XText>
            </LinearGradient>
}