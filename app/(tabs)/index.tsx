import { View, Text } from 'react-native';
import PropertiesScreen from './properties';
import LandmarkDropdownFilters from '../components/LandmarkDropdownFilters';

export default function TabOneScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PropertiesScreen />
    </View>
  );
}



