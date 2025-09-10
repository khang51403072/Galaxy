import React, { useMemo } from 'react';
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
  yTicks?: number; 
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
  
  const chartWidth = width || Math.max(320, window.width - 100) || 320;
  const chartHeight = height || Math.round(chartWidth * 2 / 3) || 200;

  const fontSizeYTick = Math.max(10, Math.round(chartWidth * 0.03));
  const fontSizeBar = Math.max(10, Math.round(chartWidth * 0.03));
  const fontSizeLabel = Math.max(8, Math.round(chartWidth * 0.03) - 2); 
  
  const maxLabelLines = useMemo(() => {
    if (isLoading || !data || data.length === 0) return 2;
    return Math.max(...data.map(item => item.label.split('\n').length));
  }, [data, isLoading]);

  const singleLabelLineHeight = fontSizeLabel * 1.4;
  const paddingBottom = singleLabelLineHeight * maxLabelLines + 6;
  const paddingTop = fontSizeYTick * 1.5;
  const innerChartHeight = chartHeight - paddingTop - paddingBottom;
  
  if (isLoading || !data || data.length === 0) {
    const skeletonYAxisHeight = chartHeight - paddingBottom + singleLabelLineHeight;
    return (
      <View style={{ width: chartWidth, height: chartHeight, alignSelf: 'center', flexDirection: 'row', paddingHorizontal: chartWidth * 0.03 }}>
        <View style={{ width: Math.ceil('999'.length * fontSizeYTick * 0.6) + 8, height: skeletonYAxisHeight, justifyContent: 'space-between', paddingTop: paddingTop }}>
          {Array.from({ length: yTicks + 1 }, (_, i) => (
            <XSkeleton key={i} width={Math.ceil('999'.length * fontSizeYTick * 0.6)} height={fontSizeYTick} borderRadius={2} />
          ))}
        </View>
        <View style={{ flex: 1, height: chartHeight, justifyContent: 'flex-end' }}>
            <XSkeleton width="100%" height={innerChartHeight} borderRadius={8} style={{ marginBottom: paddingBottom }} />
        </View>
      </View>
    );
  }
  
  const groupCount = data[0].value.length;
  const allValues = data.flatMap(d => d.value);
  const rawMax = Math.max(0, ...allValues);
  const rawMin = Math.min(0, ...allValues);
  const absMax = Math.max(Math.abs(rawMax), Math.abs(rawMin));
  
  const topPaddingForValue = absMax * 0.25 + fontSizeBar * 2;
  const maxValue = absMax === 0 ? 100 : absMax + topPaddingForValue;

  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxValue * (yTicks - i)) / yTicks)
  );

  const maxYLabel = Math.max(...yTickValues).toString();
  const yLabelWidth = Math.ceil(maxYLabel.length * fontSizeYTick * 0.6) + 8; 
  const paddingHorizontal = chartWidth * 0.03;
  const chartPaddingLeft = yLabelWidth + paddingHorizontal;
  
  const groupWidth = (chartWidth - chartPaddingLeft - paddingHorizontal) / data.length;
  const barWidth = groupWidth / (groupCount + 1.5);

  return (
    <View style={[{ width: chartWidth, height: chartHeight, alignSelf: 'center' }, style]}>
      <Svg width={chartWidth} height={chartHeight}>
        {yTickValues.map((v, i) => {
          const y = paddingTop + (innerChartHeight * i) / yTicks;
          return (
            <G key={i}>
              <Line x1={chartPaddingLeft} y1={y} x2={chartWidth - paddingHorizontal} y2={y} stroke="#eee" strokeWidth={1} />
              <SvgText x={chartPaddingLeft - 8} y={y + fontSizeYTick / 2 - 2} fontSize={fontSizeYTick} fill={labelColor} textAnchor="end">
                {v}
              </SvgText>
            </G>
          );
        })}

        <Line x1={chartPaddingLeft} y1={chartHeight - paddingBottom} x2={chartWidth - paddingHorizontal} y2={chartHeight - paddingBottom} stroke="#bbb" strokeWidth={1} />
  
        {data.map((item, i) => {
          const groupStartX = chartPaddingLeft + i * groupWidth + (groupWidth - (barWidth * groupCount)) / 2;
          
          // --- BẮT ĐẦU LOGIC RENDER MỚI ---
          // Tạo ra các component cột TRƯỚC
          const bars = item.value.map((v, j) => {
            if (v === 0) return null;
            const barHeight = Math.abs((v / maxValue) * innerChartHeight);
            const x = groupStartX + j * barWidth;
            const y = chartHeight - paddingBottom - barHeight;
            const barColor = barColors[j % barColors.length];
            
            return (
              <Rect
                key={`bar-${j}`}
                x={x} y={y} width={barWidth} height={barHeight}
                fill={barColor} rx={Math.max(2, barWidth * 0.2)}
              />
            );
          });

          // Tạo ra các component text giá trị SAU
          const valueTexts = item.value.map((v, j) => {
            if (v === 0) return null;
            
            const barHeight = Math.abs((v / maxValue) * innerChartHeight);
            const x = groupStartX + j * barWidth;
            const y = chartHeight - paddingBottom - barHeight;
            const barColor = barColors[j % barColors.length];

            // Logic chống chồng chéo
            let yOffset = -5; // Mặc định là 5px phía trên cột
            if (groupCount > 1 && j > 0) {
              const prevValue = item.value[j - 1];
              const prevBarHeight = Math.abs((prevValue / maxValue) * innerChartHeight);
              // Nếu chiều cao của cột này và cột trước đó gần bằng nhau
              if (Math.abs(barHeight - prevBarHeight) < (fontSizeBar * 1.5)) {
                // Đẩy text của cột thấp hơn xuống dưới một chút
                if (barHeight < prevBarHeight) {
                  yOffset = fontSizeBar * 1.2;
                }
              }
            }

            return (
              <SvgText
                key={`text-${j}`}
                x={x + barWidth / 2}
                y={y + yOffset}
                fontSize={fontSizeBar}
                fill={barColor}
                textAnchor="middle"
                fontWeight="500"
              >
                {Math.round(v)}
              </SvgText>
            );
          });
          // --- KẾT THÚC LOGIC RENDER MỚI ---

          return (
            <G key={i}>
              {/* Render cột trước */}
              {bars}
              {/* Render text giá trị sau để nó luôn nằm trên */}
              {valueTexts}
         
              {(() => {
                let labelX = groupStartX + (barWidth * groupCount) / 2;
                let textAnchor: 'start' | 'middle' | 'end' = 'middle';
                
                if (i === 0 && data.length > 1) { 
                  labelX = Math.max(chartPaddingLeft, groupStartX);
                  textAnchor = 'start';
                } else if (i === data.length - 1 && data.length > 1) {
                  labelX = Math.min(chartWidth - paddingHorizontal, groupStartX + barWidth * groupCount);
                  textAnchor = 'end';
                }
                
                const labelLines = item.label.split('\n');
                const startY = chartHeight - paddingBottom + singleLabelLineHeight - 2; 

                return (
                  <G> 
                    {labelLines.map((line, lineIndex) => {
                      const yPosition = startY + (lineIndex * fontSizeLabel * 1.2);
                      return (
                        <SvgText key={lineIndex} x={labelX} y={yPosition} fontSize={fontSizeLabel} fill={labelColor} textAnchor={textAnchor}>
                          {line}
                        </SvgText>
                      );
                    })}
                  </G>
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