import { View, Text, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { router } from 'expo-router';

export default function HomeScreen() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-4xl font-bold text-black dark:text-white mb-8">rajan</Text>
      
      <TouchableOpacity
        className="bg-red-500 px-6 py-3 rounded-lg"
        onPress={handleSignOut}
      >
        <Text className="text-white font-bold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
