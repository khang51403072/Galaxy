import { XColumn } from "@/shared/components/XColumn";
import XDivider from "@/shared/components/XDivider";
import XIcon, { iconMap } from "@/shared/components/XIcon";
import { XRow } from "@/shared/components/XRow";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme";
import { useMemo } from "react";
import { TouchableOpacity } from "react-native";

export interface MECardItemProps{
    title: string;
    icon: keyof typeof iconMap
    onAction?: () => void;
}

export interface MECardProps{
    title?: string;
    listActions: MECardItemProps[]
}

export function MECard({
    title,
    listActions
}:MECardProps)
{
    const theme  = useTheme();
    const header = useMemo(
        () => <XColumn gap={theme.spacing.xs}>
            <XText variant="bodyLight">{title}</XText>
            <XDivider></XDivider>
        </XColumn>, [title]
    )
    const actions = useMemo(
        () => listActions.map(
            e => <XRow align="center">
                <XRow align="center" gap={theme.spacing.sm} style={{flex:1}}>
                    <XIcon name={e.icon}></XIcon>
                    <XText color={theme.colors.gray800} variant="titleRegular">{e.title}</XText>
                </XRow>
                <TouchableOpacity onPress={e.onAction}>
                    <XIcon name='caretRight' style={{justifyContent:'flex-end'}}></XIcon>
                </TouchableOpacity>
            </XRow>
        ), [listActions]
    )
    return <XColumn style={{...theme.shadows.sm, backgroundColor: theme.colors.white, borderRadius: theme.spacing.sm, padding: theme.spacing.lg, gap: theme.spacing.md}} >
        {title&&header}
        {actions}
    </XColumn>
}