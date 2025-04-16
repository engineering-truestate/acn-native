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
        className={`mx-2 p-5 rounded-2xl ${
          isActive ? "bg-[#153E3B]" : "bg-white border border-gray-300"
        }`}
        onPress={() => handleTabChange(item.key)}
        activeOpacity={0.9}
        style={{width:200}}
      >
        <StyledView className="flex-row items-center gap-[16]">
          <StyledView
            className={`p-[9.3] rounded-full ${
              isActive ? "bg-[#0E2C2A]" : "bg-[#EAF8F6]"
            }`}
          >
            <MaterialCommunityIcons
              size={21.33}
              name={item.icon}
              color={isActive ? "#FFFFFF" : "#153E3B"}
            />
          </StyledView>
          <StyledView className="flex-col items-start space-y-2 gap-[3.5]">
          <StyledText
            className={`text-xs font-semibold ${
              isActive ? "text-white" : "text-gray-700"
            }`}
          >
            {item.label}
          </StyledText>
          <StyledText
            className={`text-xl font-bold ${
              isActive ? "text-white" : "text-black"
            }`}
          >
            {item.count}
          </StyledText>
          </StyledView>
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
      style={{flexGrow:0,flexShrink:0}}
    />
  );
};

export default TabCarousel;
