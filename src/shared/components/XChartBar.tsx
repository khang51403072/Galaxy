import React from 'react';
import { View } from 'react-native';
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
  width = 300,
  height = 200,
  barColors = ['#4f8cff', '#ffb347'],
  labelColor = '#222',
  style,
  yTicks = 5,
  isLoading = false,
}) => {
  if (!data || data.length === 0) return null;

  const groupCount = data[0].value.length;
  const maxValue = Math.max(...data.flatMap(d => d.value));
  const groupWidth = (width - 40) / data.length; // chừa 40px cho trục Y
  const barWidth = groupWidth / (groupCount + 1);
  const chartHeight = height - 40; // chừa 40px cho label X và padding

  // Tính các mốc trục Y
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxValue * (yTicks - i)) / yTicks)
  );
  if ( isLoading) {
    return (
      <XSkeleton width={width} height={height} borderRadius={8} />
    );
  }
  return (
    <View style={style}>
      <Svg width={width} height={height}>
        {/* Trục Y */}
        <Line
          x1={30}
          y1={20}
          x2={30}
          y2={chartHeight + 20}
          stroke="#bbb"
          strokeWidth={1}
        />
        {/* Trục X */}
        <Line
          x1={30}
          y1={chartHeight +20}
          x2={width - 5}
          y2={chartHeight + 20}
          stroke="#bbb"
          strokeWidth={1}
        />
        {/* Các mốc trục Y */}
        {yTickValues.map((v, i) => {
          const y = 20 + (chartHeight * i) / yTicks;
          return (
            <G key={i}>
              {/* Đường kẻ ngang */}
              <Line
                x1={30}
                y1={y}
                x2={width - 5}
                y2={y}
                stroke="#eee"
                strokeWidth={1}
              />
              {/* Nhãn mốc */}
              <SvgText
                x={0}
                y={y + 4}
                fontSize="11"
                fill={labelColor}
                textAnchor="start"
              >
                {v}
              </SvgText>
            </G>
          );
        })}
        {/* Vẽ các cột */}
        {data.map((item, i) =>
          item.value.map((v, j) => {
            const barHeight = (v / maxValue) * chartHeight;
            const x = 30 + i * groupWidth + j * barWidth + barWidth / 2;
            const y = chartHeight + 20 - barHeight;
            return (
              <G key={`${i}-${j}`}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={barColors[j % barColors.length]}
                  rx={3}
                />
                {/* Value label trên đầu cột */}
                <SvgText
                  x=  {x+(barWidth*(j%data.length))}
                  y={y - 6}
                  fontSize="11"
                  fill={labelColor}
                  textAnchor="middle"
                >
                  {v}
                </SvgText>
                {/* Label trục X (chỉ vẽ 1 lần cho mỗi nhóm) */}
                {j === 0 && (
                  <SvgText
                    x={x + (barWidth * groupCount) / 2 }
                    y={height }
                    fontSize="12"
                    fill={labelColor}
                    textAnchor="middle"
                  >
                    {item.label}
                  </SvgText>
                )}
              </G>
            );
          })
        )}
      </Svg>
    </View>
  );
};

export default XChart;