import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 24, color = 'white' }) => {
  const spinAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          style={styles.marginRight}
        >
          <Circle
            cx="12"
            cy="12"
            r="10"
            stroke={color}
            strokeWidth="4"
            opacity={0.25}
          />
          <Path
            fill={color}
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            opacity={0.75}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: 8,
  },
});

export default Spinner;
