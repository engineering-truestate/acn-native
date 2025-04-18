import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ChecklistIconProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}

const ChecklistIcon: React.FC<ChecklistIconProps> = ({ 
  width = 36, 
  height = 36, 
  backgroundColor = '#4A5B64', // Matching the background color from the image
  style 
}) => {
  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox="0 0 36 36" 
      fill="none"
      style={style}
    >
      <Rect 
        width={36} 
        height={36} 
        rx={8} 
        fill={backgroundColor}
      />
      <Path 
        d="M12.75 15.375H22.5" 
        stroke="white" 
        strokeWidth={2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M12.75 20.625H19.5" 
        stroke="white" 
        strokeWidth={2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M15.375 11.25H20.625C22.5 11.25 22.5 10.125 22.5 9.375C22.5 7.875 21.375 7.875 20.625 7.875H15.375C14.625 7.875 13.5 7.875 13.5 9.375C13.5 10.125 13.5 11.25 15.375 11.25Z" 
        stroke="white" 
        strokeWidth={2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M22.5 18V15.75C22.5 14.625 21.75 14.25 20.625 14.25H15.375C14.25 14.25 13.5 14.625 13.5 15.75V22.5C13.5 23.625 14.25 24 15.375 24H17.25" 
        stroke="white" 
        strokeWidth={2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M25.3125 21.9375L22.5 24.75L21.1875 23.4375" 
        stroke="white" 
        strokeWidth={2} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChecklistIcon;