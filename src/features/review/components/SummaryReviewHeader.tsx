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

interface Props {
  averageScore: number;
  totalReview: number
}

const COMMON_HEIGHT = 44
export default function SummaryReviewHeader({
  averageScore,
  totalReview,
}: Props) {
  const theme = useTheme();
  
  const MemoizedDropdown = useMemo(() => {
    return (
      <XColumn align='center' justify="center" 
      gap={theme.spacing.sm}  
      style={{
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.white, 
        borderRadius: theme.spacing.md,
        ...theme.shadows.sm
        }}>
        <XRow align="center" justify="center" gap={theme.spacing.xs} style={{
          alignContent:"center",
          justifyContent: "center"}}>
            <XIcon height={18} width={18} name='starFilled' color={theme.colors.yellow}></XIcon>
            <XText style={{textAlign: 'center', lineHeight: 24}} variant="headingMedium">{averageScore}</XText>
        </XRow>
        <XText variant="bodyLight">{totalReview>0? `${totalReview} reviews`: 'There are no reviews'}</XText>
      </XColumn>
      
    );
  }, [averageScore, totalReview, theme]);

  return MemoizedDropdown;
}
