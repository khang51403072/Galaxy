import { XColumn } from "@/shared/components/XColumn";
import {XDivider} from "@/shared/components/XDivider";
import XIcon, { iconMap } from "@/shared/components/XIcon";
import { XRow } from "@/shared/components/XRow";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme";
import { memo, ReactNode, useMemo } from "react";
import { TouchableOpacity } from "react-native";

export interface MECardItemProps{
    title: string;
    leftIcon: keyof typeof iconMap;
    right?: ReactNode;
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
            (e, index) => 
            <TouchableOpacity key={index} onPress={e.onAction}>
                <XRow  align="center">
                    <XRow align="center" gap={theme.spacing.sm} style={{flex:1}}>
                        <XIcon name={e.leftIcon} color={theme.colors.primaryMain}></XIcon>
                        <XText color={theme.colors.gray800} variant="titleRegular">{e.title}</XText>
                    </XRow>
                    {!e.right && <XIcon  width={18} name='caretRight' style={{justifyContent:'flex-end'}}></XIcon>}
                    {e.right}
                </XRow>
            </TouchableOpacity>
        ), [listActions, theme]
    )
    return <XColumn style={{...theme.shadows.sm, backgroundColor: theme.colors.white, borderRadius: theme.spacing.sm, padding: theme.spacing.lg, gap: theme.spacing.lg}} >
        {title&&header}
        {actions}
    </XColumn>
})

