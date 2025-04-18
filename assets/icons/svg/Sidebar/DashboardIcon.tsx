import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface GridIconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
}

const GridIcon: React.FC<GridIconProps> = ({ 
  width = 18, 
  height = 19, 
  color = '#292D32',
  style 
}) => {
  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox="0 0 18 19" 
      fill="none"
      style={style}
    >
      <Path
        d="M16.5 6.89V3.485C16.5 2.4275 16.02 2 14.8275 2H11.7975C10.605 2 10.125 2.4275 10.125 3.485V6.8825C10.125 7.9475 10.605 8.3675 11.7975 8.3675H14.8275C16.02 8.375 16.5 7.9475 16.5 6.89Z"
        stroke={color}
        strokeWidth={1.125}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.5 15.3275V12.2975C16.5 11.105 16.02 10.625 14.8275 10.625H11.7975C10.605 10.625 10.125 11.105 10.125 12.2975V15.3275C10.125 16.52 10.605 17 11.7975 17H14.8275C16.02 17 16.5 16.52 16.5 15.3275Z"
        stroke={color}
        strokeWidth={1.125}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.875 6.89V3.485C7.875 2.4275 7.395 2 6.2025 2H3.1725C1.98 2 1.5 2.4275 1.5 3.485V6.8825C1.5 7.9475 1.98 8.3675 3.1725 8.3675H6.2025C7.395 8.375 7.875 7.9475 7.875 6.89Z"
        stroke={color}
        strokeWidth={1.125}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.875 15.3275V12.2975C7.875 11.105 7.395 10.625 6.2025 10.625H3.1725C1.98 10.625 1.5 11.105 1.5 12.2975V15.3275C1.5 16.52 1.98 17 3.1725 17H6.2025C7.395 17 7.875 16.52 7.875 15.3275Z"
        stroke={color}
        strokeWidth={1.125}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default GridIcon;