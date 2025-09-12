import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { XRow } from "@/shared/components/XRow";
import XIcon from "@/shared/components/XIcon";
import { XColumn } from "@/shared/components/XColumn";
import { FlatList } from "react-native-gesture-handler";
import { StaringBar } from "./staringBar";
import { XDivider } from "@/shared/components/XDivider";
import { SurveyItem } from "../types/ReviewResponse";
import { useShallow } from "zustand/react/shallow";
import { useReviewStore } from "../stores/reviewStore";
import { Permissions } from "@/features/auth/types/AuthTypes";
import InlineReadMore from "./InlineReadMore";

interface Props {
  options: SurveyItem[];
  onGoToReplyScreen: (item: SurveyItem) => void;
}

export default function ReviewList({
  options,
  onGoToReplyScreen
}: Props) {
  const theme = useTheme();
  const getPermission = useReviewStore(useShallow((state) => state.getPermission));

  const renderItem = useCallback(
    (item: SurveyItem) => {
      const id = String(item.id);
      return (
        <XColumn gap={theme.spacing.sm} style={{ paddingVertical: theme.spacing.md }}>
          <XRow justify="space-between" align="center">
            <XText color={theme.colors.gray800} variant="titleRegular">
              {getPermission(Permissions.VIEW_CUSTOMER_NAME)
                ? `${item.customerInfo.firstName} ${item.customerInfo.lastName}`
                : "********"}
            </XText>
            <XText color={theme.colors.gray600} variant="captionLight">
              #{item.ticketNum}
            </XText>
          </XRow>

          {item.customerInfo.phone && (
            <XText color={theme.colors.gray500} variant="captionLight">
              {getPermission(Permissions.VIEW_PHONE_NUMBER_EMAIL) ? `${item.customerInfo.phone}` : "**********"}
            </XText>
          )}

          <XRow justify="space-between" align="center">
            <StaringBar score={item.rating} />
            <XText color={theme.colors.gray600} variant="captionLight">
              {item.createdAt.toDate()?.format("dd/MM/yyyy")} at {item.createdAt.toDate()?.format("HH:mm a")}
            </XText>
          </XRow>

          {item.comment && (
            <InlineReadMore
              text={item.comment}
            />
          )}

          <TouchableOpacity
            onPress={() => {onGoToReplyScreen(item)}}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.colors.primaryOpacity5,
              alignSelf: "flex-start",
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.spacing.sm,
            }}
          >
            <XIcon height={14} width={14} name="reply" />
            <XText variant="captionRegular"> Response</XText>
          </TouchableOpacity>
        </XColumn>
      );
    },
    [theme, getPermission]
  );

  return (
    <FlatList
      indicatorStyle="default"
      style={{ flex: 1, marginBottom: 50 }}
      data={options}
      renderItem={({ item }) => renderItem(item)}
      ItemSeparatorComponent={XDivider}
      keyExtractor={(item) => String((item.customerInfo.phone ?? "") + item.id)}
    />
  );
}
