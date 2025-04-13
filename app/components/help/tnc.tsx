import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Linking, Platform } from "react-native";
import { useFonts } from 'expo-font';
import Markdown from 'react-native-markdown-display';
import * as FileSystem from 'expo-file-system';

interface TnCProps {}

const TnC: React.FC<TnCProps> = () => {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  
  // Load custom fonts - assuming you're using Expo
//   const [fontsLoaded] = useFonts({
//     'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
//     'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
//     'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
//     'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
//   });

  useEffect(() => {
    // In React Native, we'll need to handle file loading differently
    const loadMarkdownContent = async () => {
      try {
        // Option 1: If the file is bundled with the app
        const fileUri = require('../assets/docs/tnc.md');
        const content = await FileSystem.readAsStringAsync(fileUri);
        setMarkdownContent(content);
      } catch (error) {
        // Option 2: If the file is hosted remotely
        try {
          const response = await fetch('https://yourapp.com/docs/tnc.md');
          const text = await response.text();
          setMarkdownContent(text);
        } catch (fetchError) {
          console.error('Failed to load markdown content:', fetchError);
          setMarkdownContent('# Terms and Conditions\n\nUnable to load content. Please check your connection.');
        }
      }
    };

    loadMarkdownContent();
  }, []);

  // Wait for fonts to load
//   if (!fontsLoaded) {
//     return null;
//   }

  // Custom styling for Markdown components
  const markdownStyles = {
    body: {
      color: '#4B5563', // text-gray-500
      fontFamily: 'Lato-Regular',
    },
    heading1: {
      fontSize: 24,
      fontFamily: 'Montserrat-Bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    heading2: {
      fontSize: 20,
      fontFamily: 'Montserrat-Bold',
      marginTop: 32,
      marginBottom: 16,
      textAlign: 'center',
    },
    heading3: {
      fontSize: 18,
      fontFamily: 'Montserrat-SemiBold',
      marginBottom: 16,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 12,
      textAlign: 'justify',
      fontFamily: 'Lato-Regular',
    },
    list_item: {
      marginBottom: 8,
      textAlign: 'justify',
      fontFamily: 'Lato-Regular',
    },
    bullet_list: {
      marginLeft: Platform.OS === 'ios' ? 20 : 16,
      marginBottom: 12,
    },
    link: {
      color: '#3B82F6', // text-blue-500
      textDecorationLine: 'underline',
    },
  };

  // Function to handle link presses
  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Markdown
          style={markdownStyles}
          onLinkPress={(url) => handleLinkPress(url)}
        >
          {markdownContent}
        </Markdown>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    maxWidth: 840, // Approximate equivalent to max-w-[84rem]
    alignSelf: 'center',
    width: '100%',
  },
});

export default TnC;