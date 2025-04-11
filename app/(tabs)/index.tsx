import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import PropertiesScreen from './properties';
import LandmarkDropdownFilters from '../components/LandmarkDropdownFilters';

export default function HomeScreen() {
  return (
    <View className="p-4 bg-white dark:bg-black">
      <PropertiesScreen />
    </View>
  );
}



