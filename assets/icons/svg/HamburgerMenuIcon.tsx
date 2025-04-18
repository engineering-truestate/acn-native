import React from "react";
import { Svg, Rect, Path } from "react-native-svg";

interface HamburgerMenuIconProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  rectStrokeColor?: string;
  strokeWidth?: number;
}

const HamburgerMenuIcon: React.FC<HamburgerMenuIconProps> = ({
  width = 32,
  height = 33,
  strokeColor = "#292D32",
  rectStrokeColor = "#CCCBCB",
  strokeWidth = 1.5,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 33" fill="none">
      <Rect
        x="0.5"
        y="1"
        width="31"
        height="31"
        rx="3.5"
        stroke={rectStrokeColor}
      />
      <Path
        d="M7 11.5H25"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M7 16.5H25"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M7 21.5H25"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default HamburgerMenuIcon;
