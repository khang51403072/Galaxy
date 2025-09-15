import React, { useMemo } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import XDropdown from "@/shared/components/XDropdown";
import XInput from "@/shared/components/XInput";
import XText from "@/shared/components/XText";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { XRow } from "@/shared/components/XRow";
import XButton from "@/shared/components/XButton";
import XIcon from "@/shared/components/XIcon";

interface Props {
  starTotal5: number,
  starTotal4: number
  starTotal3: number
  starTotal2: number
  starTotal1: number
  selectedStar?: string[]
  onItemSelected: (v?: string[]) => void
}

export default function StarFilter({
    starTotal5,
    starTotal4,
    starTotal3,
    starTotal2,
    starTotal1,
    selectedStar,
    onItemSelected
}: Props) {
  const theme = useTheme();
  
  const starFilter = (label:string, value:number) => {
    let isSelected =  selectedStar?.includes(label)
    return <TouchableOpacity onPress={()=>{
      if(isSelected)
      {
        let tmpList = selectedStar?.filter(v=> v!=label)
        onItemSelected(tmpList)
      }
      else{
        let tmpList = [...selectedStar??[], label]
        onItemSelected(tmpList)
      }
    }}>
      <XRow justify="center" align="center" style={{            
        backgroundColor: isSelected? theme.colors.primaryMain : theme.colors.primaryOpacity5,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
        marginHorizontal:theme.spacing.xs
      }}>
        <XIcon name="starFilled" height={14} width={14} color={isSelected? theme.colors.white: theme.colors.primaryMain}></XIcon>
        <XText variant="captionMedium"> {label} ({value})</XText>
      </XRow>
    </TouchableOpacity>
  }
    
        

  const MemoizedDropdown = useMemo(() => {
    return (
      <ScrollView horizontal={true} contentContainerStyle={{justifyContent: "center"}}>
        {starFilter("5",starTotal5)}
        {starFilter("4",starTotal4)}
        {starFilter("3",starTotal3)}
        {starFilter("2",starTotal2)}
        {starFilter("1",starTotal1)}
      </ScrollView>
      
    );
  }, [ starTotal5, starTotal4, starTotal3, starTotal2, starTotal1,selectedStar, theme]);

  return MemoizedDropdown;
}
