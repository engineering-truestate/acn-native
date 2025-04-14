import React from "react";
import { FlatList, View, Text, TouchableOpacity, ListRenderItem } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styled } from "nativewind";

const StyledFlatList = styled(FlatList<TabItem>); // Explicit typing for TabItem
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

type TabItem = {
  key: string;
  label: string;
  icon: string;
  count: number;
};

interface TabCarouselProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabData: TabItem[];
}

const TabCarousel: React.FC<TabCarouselProps> = ({ activeTab, setActiveTab, tabData }) => {
  const handleTabChange = (tab: string) => setActiveTab(tab);

  const renderTabItem: ListRenderItem<TabItem> = ({ item }) => {
    const isActive = activeTab === item.key;
    return (
      <StyledTouchableOpacity
        className={`mx-2 p-5 w-44 rounded-2xl ${
          isActive ? "bg-[#153E3B]" : "bg-white border border-gray-300"
        }`}
        onPress={() => handleTabChange(item.key)}
        activeOpacity={0.9}
      >
        <StyledView className="items-center space-y-2">
          <StyledView
            className={`p-4 rounded-full ${
              isActive ? "bg-[#0E2C2A]" : "bg-[#EAF8F6]"
            }`}
          >
            <MaterialCommunityIcons
              size={28}
              name={item.icon}
              color={isActive ? "#FFFFFF" : "#153E3B"}
            />
          </StyledView>
          <StyledText
            className={`text-sm font-medium ${
              isActive ? "text-white" : "text-gray-700"
            }`}
          >
            {item.label}
          </StyledText>
          <StyledText
            className={`text-xl font-bold mb-8 ${
              isActive ? "text-white" : "text-black"
            }`}
          >
            {item.count}
          </StyledText>
        </StyledView>
      </StyledTouchableOpacity>
    );
  };

  return (
    <StyledFlatList
      horizontal
      data={tabData}
      renderItem={renderTabItem}
      keyExtractor={(item) => item.key}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default TabCarousel;
