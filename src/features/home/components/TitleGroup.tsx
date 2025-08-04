import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import XText from '../../../shared/components/XText';
import ActionGroup from './ActionGroup';
import XSwitch from '../../../shared/components/XSwitch';
import { iconMap } from '../../../shared/components/XIcon';
import Tooltip from 'react-native-walkthrough-tooltip';

type TitleGroupType = 'text' | 'edit' | 'switch';

type TitleGroupProps = {
  title: string;
  type?: TitleGroupType;
  titleIcon?: string; // áp dụng khi type = "edit"
  icon?: keyof typeof iconMap; // áp dụng khi type = "edit"
  onPress?: () => void; // dùng cho edit
  switchValue?: boolean; // dùng cho switch
  onToggleChange?: (val: boolean) => void; // dùng cho switch
  isShowTooltip?: boolean;
  onCloseTooltip?: () => void;
};

export default function TitleGroup({
  title,
  type = 'text',
  titleIcon,
  icon = 'pen',
  onPress,
  switchValue = false,
  onToggleChange,
  isShowTooltip = false,
  onCloseTooltip,
}: TitleGroupProps) {
  const [internalValue, setInternalValue] = useState(switchValue);

  const handleToggle = (val: boolean) => {
    setInternalValue(val);
    onToggleChange?.(val);
  };

  return (
    <View style={styles.container}>
      <XText variant="titleMedium">{title}</XText>

      {type === 'edit' && titleIcon && (
        <ActionGroup title={titleIcon} icon={icon} onPress={onPress!} />
      )}

      {type === 'switch' && (
        <Tooltip
          isVisible={isShowTooltip}
          content={<XText variant="captionLight">Click here to enable FaceID/TouchID for next login!</XText>}
          placement="bottom"
          onClose={onCloseTooltip}
          showChildInTooltip={true}
          childContentSpacing={0}
          contentStyle={{ padding: 12 }}
        >
          <XSwitch value={internalValue} onValueChange={handleToggle} />
        </Tooltip>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
