import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText, Line } from 'react-native-svg';
import { XSkeleton } from './XSkeleton';

type XChartBarData = {
  label: string;
  value: number[];
};

type XChartProps = {
  data: XChartBarData[];
  width?: number;
  height?: number;
  barColors?: string[];
  labelColor?: string;
  style?: any;
  yTicks?: number; // số mốc trục Y
  isLoading?: boolean;
};

const XChart: React.FC<XChartProps> = ({
  data,
  width,
  height,
  barColors = ['#4f8cff', '#ffb347'],
  labelColor = '#222',
  style,
  yTicks = 5,
  isLoading = false,
}) => {
  const window = useWindowDimensions();
  // Responsive width/height
  const chartWidth = width || window.width - 32;
  const chartHeight = height || Math.round(chartWidth * 2 / 3);

  // Responsive font size
  const fontSizeYTick = Math.max(10, Math.round(chartHeight * 0.055));
  const fontSizeBar = Math.max(10, Math.round(chartHeight * 0.055));
  const fontSizeLabel = Math.max(12, Math.round(chartHeight * 0.07));

  if (!data || data.length === 0) return null;

  const groupCount = data[0].value.length;
  // Giá trị lớn nhất cho trục Y là maxValue + 10%
  const rawMax = Math.max(...data.flatMap(d => d.value));
  const maxValue = rawMax + Math.ceil(rawMax * 0.1);

  // Không padding left, chỉ padding right 5%
  const percentPad = 0.07;
  const paddingLeft = chartWidth * percentPad*2.5;
  const paddingRight = chartWidth * percentPad;

  const groupWidth = (chartWidth - paddingLeft - paddingRight) / data.length;
  const barWidth = groupWidth / (groupCount + 1);
  const innerChartHeight = chartHeight - fontSizeLabel * 2.2 - fontSizeYTick * 0.5; // padding top/bottom động
  const paddingTop = fontSizeYTick * 1.2;
  const paddingBottom = fontSizeLabel * 2.2;

  // Tính các mốc trục Y
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxValue * (yTicks - i)) / yTicks)
  );
  if (isLoading) {
    return (
      <XSkeleton width={chartWidth} height={chartHeight} borderRadius={8} />
    );
  }

  return (
    <View style={[{ width: chartWidth, height: chartHeight, alignSelf: 'center' }, style]}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Trục Y */}
        <Line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={chartHeight - paddingBottom}
          stroke="#bbb"
          strokeWidth={1}
        />
        {/* Trục X */}
        <Line
          x1={paddingLeft}
          y1={chartHeight - paddingBottom}
          x2={chartWidth - paddingRight}
          y2={chartHeight - paddingBottom}
          stroke="#bbb"
          strokeWidth={1}
        />
        {/* Các mốc trục Y */}
        {yTickValues.map((v, i) => {
          const y = paddingTop + (innerChartHeight * i) / yTicks;
          return (
            <G key={i}>
              {/* Đường kẻ ngang */}
              <Line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="#eee"
                strokeWidth={1}
              />
              {/* Nhãn mốc */}
              <SvgText
                x={paddingLeft - 8}
                y={y + fontSizeYTick / 2 - 2}
                fontSize={fontSizeYTick}
                fill={labelColor}
                textAnchor="end"
              >
                {v}
              </SvgText>
            </G>
          );
        })}
        {/* Vẽ các cột và nhãn giá trị lớn nhất */}
        {data.map((item, i) => {
          // Tìm giá trị lớn nhất trong nhóm
          const maxInGroup = Math.max(...item.value);
          // Tính vị trí x giữa group bar
          const groupCenterX = paddingLeft + i * groupWidth + (groupWidth * groupCount) / (2 * (groupCount + 1));
          // Tính vị trí y cho nhãn giá trị lớn nhất
          const maxBarIndex = item.value.indexOf(maxInGroup);
          const barHeight = (maxInGroup / maxValue) * innerChartHeight;
          const y = chartHeight - paddingBottom - barHeight;
          const valueColor = barColors[maxBarIndex % barColors.length];
          return (
            <G key={i}>
              {/* Vẽ các cột */}
              {item.value.map((v, j) => {
                const barHeight = (v / maxValue) * innerChartHeight;
                const x = paddingLeft + i * groupWidth + j * barWidth + barWidth / 2;
                const y = chartHeight - paddingBottom - barHeight;
                return (
                  <Rect
                    key={j}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={barColors[j % barColors.length]}
                    rx={Math.max(2, barWidth * 0.2)}
                  />
                );
              })}
              {/* Nhãn giá trị lớn nhất, căn giữa group */}
              <SvgText
                x={groupCenterX + barWidth / 2}
                y={y - 4}
                fontSize={fontSizeBar}
                fill={valueColor}
                textAnchor="middle"
                fontWeight="bold"
              >
                {maxInGroup}
              </SvgText>
              {/* Label trục X */}
              {(() => {
                let labelX = paddingLeft + i * groupWidth + (barWidth * groupCount) / 2;
                let textAnchor: 'start' | 'middle' | 'end' = 'middle';
                const labelPadding = fontSizeLabel * 0.5;
                if (i === 0) {
                  labelX = Math.max(paddingLeft + labelPadding);
                  textAnchor = 'start';
                } else if (i === data.length - 1) {
                  labelX = Math.min(chartWidth - paddingRight - labelPadding);
                  textAnchor = 'end';
                }
                return (
                  <SvgText
                    x={labelX}
                    y={chartHeight - paddingBottom + fontSizeLabel + 6}
                    fontSize={fontSizeLabel}
                    fill={labelColor}
                    textAnchor={textAnchor}
                  >
                    {item.label}
                  </SvgText>
                );
              })()}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

export default XChart;