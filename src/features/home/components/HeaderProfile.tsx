import XAvatar from "@/shared/components/XAvatar";
import { Theme, useTheme } from "@/shared/theme";
import { memo, useMemo } from "react";
import LinearGradient from "react-native-linear-gradient";
import { useShallow } from "zustand/react/shallow";
import { avatarSelectors, useAvatarStore } from "../stores/avatarStore";
import XText from "@/shared/components/XText";
import { useUserStore } from "../stores/profileStore";
import { ProfileEntity } from "../types/ProfileResponse";
import { StyleSheet } from "react-native";
interface HeaderProps {
    avatarUri?: string|null;
    profile?: ProfileEntity|null
}
export const HeaderProfile = memo(
    ({avatarUri, profile}:HeaderProps)=>{
        const theme = useTheme()
        const style = useMemo(() => StyleSheet.create(
            {
                gradientStyle: {
                    gap: theme.spacing.sm,
                    flexDirection: 'column',
                    width: '100%',
                    height: '20%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }
        ), [theme]);
        return <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                locations={[0, 1]}
                style={style.gradientStyle}
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
)
