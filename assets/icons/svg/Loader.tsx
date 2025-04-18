import React, { useEffect, useRef } from 'react';
import Svg, { Path, G, ClipPath, Defs, Rect } from 'react-native-svg';
import { Animated, Easing } from 'react-native';

interface AnimatedLoaderProps {
  width?: number;
  height?: number;
  size?: number;
  color?: string;
}

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  width = 64,
  height = 64,
  size = 64,
  color = '#808080'
}) => {
  // Create animated value for rotation
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create continuous rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [rotateAnim]);

  // Interpolate rotation
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View 
      style={{ 
        width: size, 
        height: size, 
        transform: [{ rotate }] 
      }}
    >
      <Svg 
        width={width} 
        height={height} 
        viewBox="0 0 64 64" 
        fill="none"
      >
        <G clipPath="url(#clip0_3336_39709)">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32.0003 48.0013C29.7913 48.0013 28.0003 49.7913 28.0003 52.0003V60.0003C28.0003 62.2103 29.7913 64.0013 32.0003 64.0013C34.2093 64.0013 36.0003 62.2103 36.0003 60.0003V52.0003C36.0003 49.7913 34.2093 48.0013 32.0003 48.0013ZM58.2493 42.5363L51.3203 38.5363C49.4073 37.4323 46.9613 38.0873 45.8563 40.0013C44.7523 41.9133 45.4073 44.3603 47.3203 45.4643L54.2483 49.4643C56.1623 50.5693 58.6083 49.9133 59.7133 48.0013C60.8173 46.0873 60.1623 43.6413 58.2493 42.5363ZM24.0003 45.8563C22.0873 44.7523 19.6413 45.4073 18.5363 47.3213L14.5363 54.2493C13.4323 56.1623 14.0873 58.6083 16.0003 59.7133C17.9133 60.8183 20.3593 60.1623 21.4643 58.2493L25.4643 51.3213C26.5683 49.4073 25.9133 46.9623 24.0003 45.8563ZM45.4643 47.3213C44.3603 45.4073 41.9133 44.7523 40.0003 45.8563C38.0873 46.9613 37.4323 49.4073 38.5363 51.3213L42.5353 58.2493C43.6403 60.1623 46.0873 60.8173 48.0003 59.7133C49.9133 58.6093 50.5683 56.1623 49.4643 54.2493L45.4643 47.3213Z"
            fill="#E6E6E6"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 36.001C14.209 36.001 16 34.21 16 32C16 29.791 14.209 28 12 28H4C1.791 28 0 29.791 0 32C0 34.21 1.791 36.001 4 36.001H12ZM18.144 40.001C17.04 38.087 14.593 37.432 12.68 38.536L5.751 42.536C3.838 43.64 3.183 46.087 4.287 48.001C5.391 49.913 7.838 50.569 9.751 49.464L16.68 45.464C18.593 44.36 19.248 41.913 18.144 40.001Z"
            fill="#CCCCCC"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.6793 18.536L9.7503 14.536C7.8373 13.432 5.3913 14.087 4.2863 16.001C3.1823 17.913 3.8373 20.359 5.7503 21.464L12.6793 25.464C14.5923 26.569 17.0383 25.913 18.1433 24C19.2483 22.087 18.5923 19.641 16.6793 18.536ZM25.4633 12.68L21.4633 5.75202C20.3583 3.83902 17.9123 3.18302 15.9993 4.28702C14.0863 5.39102 13.4313 7.83902 14.5353 9.75202L18.5353 16.68C19.6393 18.593 22.0863 19.248 23.9993 18.144C25.9123 17.04 26.5673 14.593 25.4633 12.68Z"
            fill="#B3B3B3"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32 0C29.791 0 28 1.791 28 4.001V12.001C28 14.209 29.791 16.001 32 16.001C34.209 16.001 36 14.209 36 12.001V4.001C36 1.791 34.209 0 32 0ZM48 4.287C46.087 3.183 43.641 3.839 42.535 5.752L38.536 12.68C37.432 14.593 38.087 17.04 40 18.144C41.913 19.248 44.359 18.593 45.464 16.68L49.464 9.752C50.568 7.839 49.913 5.392 48 4.287Z"
            fill="#999999"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M60.0006 28.0003H52.0006C49.7916 28.0003 48.0006 29.7913 48.0006 32.0003C48.0006 34.2103 49.7916 36.0013 52.0006 36.0013H60.0006C62.2096 36.0013 64.0006 34.2103 64.0006 32.0003C64.0006 29.7913 62.2096 28.0003 60.0006 28.0003ZM51.3206 25.4643L58.2496 21.4643C60.1626 20.3603 60.8176 17.9133 59.7136 16.0013C58.6096 14.0873 56.1626 13.4323 54.2486 14.5363L47.3206 18.5363C45.4076 19.6403 44.7526 22.0873 45.8566 24.0003C46.9606 25.9133 49.4076 26.5693 51.3206 25.4643Z"
            fill="#808080"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_3336_39709">
            <Rect width="64" height="64.001" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </Animated.View>
  );
};

export default AnimatedLoader;

// Usage examples:
// <AnimatedLoader />
// or with custom props
// <AnimatedLoader 
//   width={48} 
//   height={48} 
//   size={64} 
//   color="#FF0000" 
// />