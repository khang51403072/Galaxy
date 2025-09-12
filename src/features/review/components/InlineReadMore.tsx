import React, { useMemo } from "react";
import { Text, TextStyle, NativeSyntheticEvent, TextLayoutEventData, TouchableOpacity } from "react-native";
import XText from "@/shared/components/XText"; // nếu muốn dùng XText thay Text, thay ở dưới
import { useTheme } from "@/shared/theme/ThemeProvider";

type Props = {
  text: string;
  maxLines?: number; // số dòng hiển thị khi chưa expand
  seeMoreText?: string;
  seeLessText?: string;
  textStyle?: TextStyle | TextStyle[];
  // nếu bạn muốn quản lý expand từ parent, có thể thêm prop isExpanded/onToggleExpand
  initiallyExpanded?: boolean;
};

export default function InlineReadMore({
  text,
  textStyle,
  initiallyExpanded = false,
  maxLines = 2,
  seeMoreText = " See more",
  seeLessText = " See less",
}: Props) {
    const theme = useTheme();
    
  const [isExpanded, setIsExpanded] = React.useState(initiallyExpanded);
  const [measuredLines, setMeasuredLines] = React.useState<string[] | null>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);
    var isFirst = true
  // onTextLayout được gọi mỗi lần Text layout -> nhận lines array
  const onTextLayout = React.useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
   
    console.log("isFirst",isFirst)
    if(!isFirst) {
        return
    }
    isFirst = false;
    const nativeLines = e.nativeEvent.lines || [];
    // lines là mảng object; mỗi phần tử có .text (tùy RN version)
    const linesText:string[] = nativeLines.map((l: any) => l.text);
    
        
    setMeasuredLines(linesText);
    // nếu số dòng thực tế lớn hơn maxLines -> truncated
    if (linesText.length > maxLines ) {
      setIsTruncated(true);
    } 
  }, [maxLines]);

  // Build display text when not expanded and truncated: use measuredLines
  const getTruncatedText = React.useCallback(() => {
    if (!measuredLines || measuredLines.length <= maxLines) return text;

    // take first maxLines lines
    const linesToShow = measuredLines.slice(0, maxLines);
    const lastLineIndex = linesToShow.length - 1;
    let lastLine = linesToShow[lastLineIndex] ?? "";

    // remove some chars from last line to "make space" for "... "
    // heuristic: remove 8 characters (tweakable). We'll remove until lastLine has length > 0.
    // This is a heuristic; it's simple and often good enough.
    const reserveChars = 8;
    if (lastLine.length > reserveChars) {
      lastLine = lastLine.slice(0, Math.max(0, lastLine.length - reserveChars));
    } else {
      lastLine = lastLine.slice(0, Math.max(0, Math.floor(lastLine.length * 0.6)));
    }

    linesToShow[lastLineIndex] = lastLine.trimEnd();

    const joined = linesToShow.join("\n");

    // append ellipsis before See more
    return joined + "…";
  }, [measuredLines, maxLines, text]);

  // If no measuredLines yet (first render), we still render Text normally to trigger onTextLayout
  // When truncated & not expanded, we render truncated text + inline See more (nested Text)
  if (!isTruncated) {
    // not truncated: normal rendering (but keep onTextLayout to detect future)
    return (
      <XText
        // Nếu XText hỗ trợ numberOfLines, không set để full; khi isTruncated false, fine.
        onTextLayout={onTextLayout}
        variant="titleLight"
        color={theme.colors.gray700}
        style={textStyle}
      >
        {text}
      </XText>
    );
  }

  // truncated === true
  if (!isExpanded) {
    const truncated = getTruncatedText();

    return (
      <XText
        onTextLayout={onTextLayout} // vẫn cần để cập nhật measured lines khi orientation/font change
        variant="titleLight"
        color={theme.colors.gray700}
        style={textStyle}
      >
        {/* main truncated text */}
        {truncated}
        {/* inline See more as nested Text with onPress */}
        <Text
          onPress={() => setIsExpanded(true)}
          style={[
            { textDecorationLine: "underline", textDecorationColor: theme.colors.primaryMain },
            { color: theme.colors.primaryMain },
          ]}
        >
          {seeMoreText}
        </Text>
      </XText>
    );
  }

  // expanded: show full text + See less
  return (
    <XText variant="titleLight" color={theme.colors.gray700} style={textStyle}>
      {text}
      <Text
        onPress={() => setIsExpanded(false)}
        style={[
          { textDecorationLine: "underline", textDecorationColor: theme.colors.primaryMain },
          { color: theme.colors.primaryMain },
        ]}
      >
        {seeLessText}
      </Text>
    </XText>
  );
}
