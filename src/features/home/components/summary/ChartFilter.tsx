import XDropdown, { DropdownOption } from "@/shared/components/XDropdown";
import XInput from "@/shared/components/XInput";
import { memo, useMemo } from "react";
import { dropdownOptions } from "../../stores/chartExploreStore";
import { useTheme } from "@/shared/theme";
import { StyleSheet } from "react-native";

interface ChartFilterProps {
    onSelect: (option: DropdownOption) => void;
    selectedOption?: DropdownOption
}
export const ChartFilter = memo(
    ({onSelect,selectedOption}:ChartFilterProps) => {
        const theme = useTheme()
        const data = useMemo(() => dropdownOptions.map((e)=>{return{label: e, value: e}}), [dropdownOptions])
        const style = useMemo(
            () => StyleSheet.create({
                container: { width: '100%' },
                displaySelectedItem: { 
                    backgroundColor: theme.colors.white, 
                    borderColor: theme.colors.primaryMain, 
                    borderRadius: theme.spacing.sm, 
                },
                displayTextStyle: { 
                    ...theme.typography.titleRegular, 
                    color: theme.colors.gray700, 
                    paddingVertical: theme.spacing.sm, 
                    paddingHorizontal: 0 
                }
            }),
            [theme]
        )
        return <XDropdown style={style.container}
          value={selectedOption}
          options={data}
          onSelect= {onSelect}
          renderLabel={(value)=>{
            return <XInput
                value={value?.label}
                iconRight="downArrowBlack"
                editable={false}
                pointerEvents="none"
                containerStyle={style.displaySelectedItem}
                textInputStyle={style.displayTextStyle}
              />
              
          }}
        >
        </XDropdown>
    }
)