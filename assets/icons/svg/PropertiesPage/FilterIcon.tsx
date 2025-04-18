import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface FilterIconProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

const FilterIcon: React.FC<FilterIconProps> = ({
  width = 20,
  height = 21,
  strokeColor = '#2B2928',
  strokeWidth = 1.58824
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 21" fill="none">
      <Path 
        d="M6.35547 10.5V4.14709M6.35547 16.853V13.6765M11.9143 6.52945V4.14709M11.9143 16.853V9.70592" 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
      <Path 
        d="M6.35386 13.6765C7.23102 13.6765 7.9421 12.9654 7.9421 12.0882C7.9421 11.2111 7.23102 10.5 6.35386 10.5C5.4767 10.5 4.76562 11.2111 4.76562 12.0882C4.76562 12.9654 5.4767 13.6765 6.35386 13.6765Z" 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
      <Path 
        d="M11.9125 9.70589C12.7896 9.70589 13.5007 8.99481 13.5007 8.11765C13.5007 7.2405 12.7896 6.52942 11.9125 6.52942C11.0353 6.52942 10.3242 7.2405 10.3242 8.11765C10.3242 8.99481 11.0353 9.70589 11.9125 9.70589Z" 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default FilterIcon;