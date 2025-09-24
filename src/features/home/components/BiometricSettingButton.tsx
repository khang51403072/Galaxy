import XSwitch from "@/shared/components/XSwitch";
import XText from "@/shared/components/XText";
import { memo } from "react";
import Tooltip from "react-native-walkthrough-tooltip";

interface BiometricButtonProps {
    isShowTooltip: boolean;
    isUseFaceId: boolean;
    setShowTooltip: (v:boolean) => void;
    handleToggle: (v:boolean) => void;
}
export const BiometricSettingButton = memo(
    ({isShowTooltip, setShowTooltip, isUseFaceId, handleToggle}:BiometricButtonProps) => (
      <Tooltip
        isVisible={isShowTooltip}
        content={<XText variant="captionLight">Click here to enable FaceID/TouchID for next login!</XText>}
        placement="bottom"
        onClose={() => setShowTooltip(false)}
        showChildInTooltip={true}
        childContentSpacing={0}
        contentStyle={{ padding: 12 }}
      >
        <XSwitch value={isUseFaceId} onValueChange={handleToggle} />
      </Tooltip>
    ) 
  );