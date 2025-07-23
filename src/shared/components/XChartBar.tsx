import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText, Line } from 'react-native-svg';
import { XSkeleton } from './XSkeleton';
import { useTheme } from '../theme';

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
  const theme = useTheme();
  // Responsive width/height
  const chartWidth = width || window.width -100;
  const chartHeight = height || Math.round(chartWidth * 2 / 3);

  // Responsive font size
  const fontSizeYTick = Math.max(10, Math.round(chartHeight * 0.05));
  const fontSizeBar = Math.max(10, Math.round(chartHeight * 0.055));
  const fontSizeLabel = Math.max(12, Math.round(chartHeight * 0.06));

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    value: number;
    color: string;
    label: string;
  } | null>(null);

  if (!data || data.length === 0) return null;

  const groupCount = data[0].value.length;
  // Giá trị lớn nhất cho trục Y là max(abs(max), abs(min)) + 10%
  const allValues = data.flatMap(d => d.value);
  const rawMax = Math.max(...allValues);
  const rawMin = Math.min(...allValues);
  const absMax = Math.max(Math.abs(rawMax), Math.abs(rawMin));
  const maxValue = absMax + Math.ceil(absMax * 0.1);

  // Không padding left, chỉ padding right 5%
  const percentPad = 0.06;
  const paddingLeft = chartWidth * percentPad*2;
  const paddingRight = chartWidth * (percentPad/2);

  const groupWidth = (chartWidth - paddingLeft - paddingRight) / data.length;
  const barWidth = groupWidth / (groupCount + 1);
  const innerChartHeight = chartHeight - fontSizeLabel * 2.2 - fontSizeYTick * 0.5; // padding top/bottom động
  const paddingTop = fontSizeYTick * 1.2;
  const paddingBottom = fontSizeLabel * 2.2;

  // Tính các mốc trục Y (chỉ dương)
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
      <Svg width={chartWidth} height={chartHeight} onPress={() => setTooltip(null)}>
        {/* Trục Y */}
        <Line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={chartHeight - paddingBottom}
          stroke="#bbb"
          strokeWidth={1}
        />
        {/* Trục X (dưới cùng) */}
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
        {/* Vẽ các cột */}
        {data.map((item, i) => {
          return (
            <G key={i}>
              {item.value.map((v, j) => {
                if (v === 0) return null;
                const isNegative = v < 0;
                const barHeight = Math.abs((v / maxValue) * innerChartHeight);
                const x = paddingLeft + i * groupWidth + j * barWidth + barWidth / 2;
                const y = chartHeight - paddingBottom - barHeight;
                const barColor = barColors[j % barColors.length];
                // Tooltip: chỉ hiển thị giá trị lớn nhất giữa v1 và v2
                let v1 = item.value[0] ?? 0;
                let v2 = item.value[1] ?? 0;
                v1 = Math.round(v1 * 100) / 100;
                v2 = Math.round(v2 * 100) / 100;
                const values = [v1, v2];
                const maxValueInGroup = Math.max(...values);
                const maxIdx = values.indexOf(maxValueInGroup);
                const tooltipColor = barColors[maxIdx % barColors.length];
                return (
                  <G key={j}>
                    <Rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={barColor}
                      rx={Math.max(2, barWidth * 0.2)}
                      onPress={() => setTooltip({
                        x: x + barWidth / 2,
                        y: y ,
                        value: maxValueInGroup,
                        color: tooltipColor,
                        label: item.label,
                      })}
                    />
                  </G>
                );
              })}
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
        {/* Tooltip */}
        {tooltip && (
          <G>
            <SvgText
              x={tooltip.x}
              y={tooltip.y-4}
              fontSize={8}
              fill={tooltip.color}
              textAnchor="middle"
              fontWeight="bold"
            >
              {tooltip.value}
            </SvgText>
            
          </G>
        )}
      </Svg>
    </View>
  );
};

export default XChart;