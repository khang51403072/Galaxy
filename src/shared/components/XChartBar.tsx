import React, { useState, useMemo } from 'react';
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
  
  // Responsive width/height với fallback values để tránh height = 0
  const chartWidth = width || Math.max(320, window.width - 100) || 320;
  const chartHeight = height || Math.round(chartWidth * 2 / 3) || 200;

  // Responsive font size
  const fontSizeYTick = Math.max(10, Math.round(chartHeight * 0.05));
  const fontSizeBar = Math.max(10, Math.round(chartHeight * 0.055));
  const fontSizeLabel = Math.max(10, Math.round(chartHeight * 0.055));

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    values: number[];
    colors: string[];
    label: string;
    groupIndex: number;
  } | null>(null);

  // Kiểm tra data và dimensions để quyết định có render chart không
  const shouldRenderChart = !isLoading && data && data.length > 0 && chartWidth > 0 && chartHeight > 0;

  // Nếu không có data hoặc đang loading, hiển thị skeleton
  if (isLoading || !data || data.length === 0) {
    return (
      <View style={{ width: chartWidth, height: chartHeight, 
      alignSelf: 'center', flexDirection: 'row', paddingHorizontal: chartWidth * 0.03,
      paddingTop: fontSizeYTick * 1,
      paddingBottom: fontSizeLabel * 2.2,
      }}>
       
        <View style={{ width: Math.ceil('999'.length * fontSizeYTick * 0.6) + 8, height: chartHeight, justifyContent: 'space-between', paddingTop: fontSizeYTick * 1, paddingBottom: fontSizeLabel * 2.2 }}>
          {Array.from({ length: yTicks + 1 }, (_, i) => (
            <XSkeleton key={i} width={Math.ceil('999'.length * fontSizeYTick * 0.6)} height={fontSizeYTick} borderRadius={2} style={{ marginBottom: 2 }} />
          ))}
        </View>
      
        <XSkeleton width={chartWidth - (Math.ceil('999'.length * fontSizeYTick * 0.6) + 8) - 2*(chartWidth * 0.03)} height={chartHeight} borderRadius={8} />
      </View>
    );
  }

  const groupCount = data[0].value.length;
  // Giá trị lớn nhất cho trục Y là max(abs(max), abs(min)) + 20%
  const allValues = data.flatMap(d => d.value);
  const rawMax = Math.max(...allValues);
  const rawMin = Math.min(...allValues);
  const absMax = Math.max(Math.abs(rawMax), Math.abs(rawMin));
  const maxValue = absMax + Math.ceil(absMax * 0.22);

  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxValue * (yTicks - i)) / yTicks)
  );

  const maxYLabel = Math.max(...yTickValues).toString();
  const yLabelWidth = Math.ceil(maxYLabel.length * fontSizeYTick * 0.6) + 8; 
  const paddingHorizontal = chartWidth * 0.03;
  const chartPaddingLeft = yLabelWidth + paddingHorizontal;
  
  const groupWidth = (chartWidth - chartPaddingLeft - paddingHorizontal) / data.length;
  const barWidth = groupWidth / (groupCount + 1);
  const innerChartHeight = chartHeight - fontSizeLabel * 2.2 - fontSizeYTick * 0.5;
  const paddingTop = fontSizeYTick * 1;
  const paddingBottom = fontSizeLabel * 2.2;

  return (
    <View style={[{ width: chartWidth, height: chartHeight, alignSelf: 'center' }, style]}>
      <Svg width={chartWidth} height={chartHeight} onPress={() => setTooltip(null)}>
       
        <Line
          x1={chartPaddingLeft}
          y1={paddingTop}
          x2={chartPaddingLeft}
          y2={chartHeight - paddingBottom}
          stroke="#bbb"
          strokeWidth={1}
        />
 
        <Line
          x1={chartPaddingLeft}
          y1={chartHeight - paddingBottom}
          x2={chartWidth - paddingHorizontal}
          y2={chartHeight - paddingBottom}
          stroke="#bbb"
          strokeWidth={1}
        />
  
        {yTickValues.map((v, i) => {
          const y = paddingTop + (innerChartHeight * i) / yTicks;
          return (
            <G key={i}>
           
              <Line
                x1={chartPaddingLeft}
                y1={y}
                x2={chartWidth - paddingHorizontal}
                y2={y}
                stroke="#eee"
                strokeWidth={1}
              />
      
              <SvgText
                x={chartPaddingLeft - 8}
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

        {data.map((item, i) => {
          const totalX = chartPaddingLeft + i * groupWidth + (barWidth * groupCount) / 2;
        
          const maxBarHeight = Math.max(...item.value.map(v => Math.abs((v / maxValue) * innerChartHeight)));
          const tooltipY = chartHeight - paddingBottom - maxBarHeight - 8;
          return (
            <G key={i}>
              {item.value.map((v, j) => {
                if (v === 0) return null;
                const barHeight = Math.abs((v / maxValue) * innerChartHeight);
                const x = chartPaddingLeft + i * groupWidth + j * barWidth + barWidth / 2;
                const y = chartHeight - paddingBottom - barHeight;
                const barColor = barColors[j % barColors.length];
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
                        x: totalX,
                        y: tooltipY,
                        values: item.value.map(val => Math.round(val * 100) / 100),
                        colors: item.value.map((_, idx) => barColors[idx % barColors.length]),
                        label: item.label,
                        groupIndex: i,
                      })}
                    />
                  </G>
                );
              })}
         
              {(() => {
                let labelX = chartPaddingLeft + i * groupWidth + (barWidth * groupCount) / 2;
                let textAnchor: 'start' | 'middle' | 'end' = 'middle';
                const labelPadding = fontSizeLabel * 0.5;
                if (i === 0) {
                  labelX = Math.max(chartPaddingLeft + labelPadding);
                  textAnchor = 'start';
                } else if (i === data.length - 1) {
                  labelX = Math.min(chartWidth - paddingHorizontal - labelPadding);
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
              {tooltip && tooltip.groupIndex === i && (
                <G>
                  {tooltip.values.map((val, idx) => (
                    <SvgText
                      key={idx}
                      x={tooltip.x}
                      y={tooltip.y - 10 + idx * (fontSizeLabel + 2)}
                      fontSize={fontSizeLabel}
                      fill={tooltip.colors[idx]}
                      textAnchor="middle"
                      fontWeight="bold"
                      stroke="#fff"
                      strokeWidth={0.5}
                    >
                      {data[0].value.length === 2
                        ? `${val}`
                        : val}
                    </SvgText>
                  ))}
                </G>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

export default XChart;