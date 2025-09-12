import { useTheme } from "@/shared/theme";
import React, { forwardRef, useMemo, useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";

interface Props {
    text: string,
    setText?: (text: string) => void
}
export const MultiLineInput = forwardRef<TextInput, Props>(
    (
        { text, setText },
        ref
    ) => {
        const theme = useTheme()
        const styles = useMemo(() => StyleSheet.create({
            container: {  },
            input: {
                borderWidth: 1,
                borderColor: theme.colors.primaryOpacity50,
                borderRadius: theme.spacing.sm,
                padding: theme.spacing.sm,
                minHeight: 100, // 👈 có thể fix chiều cao tối thiểu
            },
        }), [theme]);

        return (
            <View style={styles.container}>
                <TextInput
                    ref={ref}
                    value={text}
                    onChangeText={setText}
                    multiline   // 👈 Cho phép nhiều dòng
                    numberOfLines={4} // 👈 chiều cao mặc định (4 dòng)
                    textAlignVertical="top" // 👈 căn chữ lên trên cùng (Android)
                    placeholder="Nhập nội dung..."
                    style={styles.input}
                />
            </View>
        );
    }
);

