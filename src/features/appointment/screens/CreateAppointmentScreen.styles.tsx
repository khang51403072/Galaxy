import { Theme } from "@/shared/theme";
import { StyleSheet } from "react-native";

export const stylesMemoize = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            gap: theme.spacing.md,
            paddingTop: theme.spacing.md,
            flex: 1,
        },
        customerDetailsContainer: {
            gap: 4,
            flexDirection: 'row',
            alignItems: 'center',
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.gray200,
        },
        menuHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        mask: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Thêm độ trong suốt
            zIndex: 10,
        },
        deleteApptChildren: {
            backgroundColor: theme.colors.primaryOpacity5,
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.xs
        },

    })
}