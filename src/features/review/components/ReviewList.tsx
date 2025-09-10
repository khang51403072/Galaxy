import React, { useMemo } from "react";
import { View } from "react-native";
import XDropdown from "@/shared/components/XDropdown";
import XInput from "@/shared/components/XInput";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { XRow } from "@/shared/components/XRow";
import XButton from "@/shared/components/XButton";
import XIcon from "@/shared/components/XIcon";
import { XColumn } from "@/shared/components/XColumn";
import { FlatList } from "react-native-gesture-handler";
import { StaringBar } from "./staringBar";
import {XDivider} from "@/shared/components/XDivider";
import { SurveyItem } from "../types/ReviewResponse";



interface Props {
  options: SurveyItem[]
}

export default function ReviewList({
  options
}: Props) {
  const theme = useTheme();
  
  const renderItem =(item : SurveyItem) => {
    return <XColumn gap={8} style={{paddingVertical: theme.spacing.md}}>
        <XRow justify="space-between" align="center">
            <XText color={theme.colors.gray800} variant="titleRegular" >{item.customerInfo.firstName} {item.customerInfo.lastName}</XText>
            <XText color={theme.colors.gray600} variant="captionLight">#{item.ticketNum}</XText>
        </XRow>
        {item.customerInfo.phone&&<XText color={theme.colors.gray500} variant="captionLight">{item.customerInfo.phone}</XText>}
        <XRow justify="space-between" align="center">
            <StaringBar score={item.rating}/>
            <XText color={theme.colors.gray600} variant="captionLight">{item.createdAt.toDate()?.format('dd/MM/yyyy')} at {item.createdAt.toDate()?.format('HH:mm a')}</XText>
        </XRow>
        {item.comment&& <XText maxLines={10} color={theme.colors.gray700} variant="titleLight">{item.comment}</XText>}
    </XColumn>;
  }

  

  return <FlatList indicatorStyle="default"
        style= {{flex:1, marginBottom:50}}
        data={options} renderItem={({ item }) => renderItem(item)} // Truyền hàm renderItem
        ItemSeparatorComponent={XDivider}
        keyExtractor={(item) => item.customerInfo.phone+item.id} >
    </FlatList>
}
