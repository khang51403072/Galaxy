import { XColumn } from "@/shared/components/XColumn";
import XDivider from "@/shared/components/XDivider";
import XIcon, { iconMap } from "@/shared/components/XIcon";
import { XRow } from "@/shared/components/XRow";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme";
import { memo, ReactNode, useMemo } from "react";
import { TouchableOpacity } from "react-native";

export interface MECardItemProps{
    title: string;
    icon: keyof typeof iconMap;
    actionButton?: ReactNode;
    onAction?: ()=> void
}

export interface MECardProps{
    title?: string;
    listActions: MECardItemProps[]
}

export const  MECard = memo(
    ({
    title,
    listActions
}:MECardProps) => 
{
    const theme  = useTheme();
    const header = useMemo(
        () => <XColumn gap={theme.spacing.xs}>
            <XText variant="bodyLight">{title}</XText>
            <XDivider></XDivider>
        </XColumn>, [title, theme]
    )
    const actions = useMemo(
        () => listActions.map(
            (e, index) => <XRow key={index} align="center">
                <XRow align="center" gap={theme.spacing.sm} style={{flex:1}}>
                    <XIcon name={e.icon}></XIcon>
                    <XText color={theme.colors.gray800} variant="titleRegular">{e.title}</XText>
                </XRow>
                {e.onAction && <TouchableOpacity onPress={e.onAction} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} >
                    <XIcon  width={18} name='caretRight' style={{justifyContent:'flex-end'}}></XIcon>
                </TouchableOpacity>}
                {e.actionButton}
            </XRow>
        ), [listActions, theme]
    )
    return <XColumn style={{...theme.shadows.sm, backgroundColor: theme.colors.white, borderRadius: theme.spacing.sm, padding: theme.spacing.lg, gap: theme.spacing.lg}} >
        {title&&header}
        {actions}
    </XColumn>
})

