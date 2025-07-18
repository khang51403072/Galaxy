import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../../../shared/theme/ThemeProvider";
import { ColorScheme } from "../../../shared/theme/colors";
import XIcon, { iconMap } from "../../../shared/components/XIcon";
import XText from "../../../shared/components/XText";
import { Fonts } from "../../../shared/constants/fonts";

export default function CategoryCard({
    title,
    icon,
    onPress,
    color = 'white',
    textColor = 'white',
    style
}: {
    title: string;
    icon: keyof typeof iconMap;
    onPress: () => void;
    color: string;
    textColor: string;
    style?: StyleProp<ViewStyle>;
}) {
    const theme = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[
        {
    flexDirection: 'column',
    alignItems: 'flex-start',


    backgroundColor: color,
    borderRadius: theme.borderRadius.lg,
    }, style as object]}>
        <View style={
            {
        flexDirection: 'column',
        alignItems: 'flex-start',

        padding: theme.spacing.md,
        backgroundColor: color,
        borderRadius: theme.borderRadius.lg,
        }}>
            <XIcon name={icon}  width={40} height={40} color={textColor} />
            <XText variant='helloText400' style={{ marginTop: 10, color: textColor }}>{title}</XText>
        </View>
        <XIcon
            name="iconCategory"
            width={48}
            height={48}
            color="#FFFFFF"
            style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            opacity: 0.8,
           
            }}
        />
    </TouchableOpacity>
  );
}