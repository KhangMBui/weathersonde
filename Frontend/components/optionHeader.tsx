import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";

interface Props {
  tabs: string[]; // Array of tab names
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export default function OptionHeader({
  tabs,
  selectedTab,
  onTabChange,
}: Props) {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab} onPress={() => onTabChange(tab)}>
          <Text style={selectedTab === tab ? styles.activeTab : styles.tab}>
            {tab}
          </Text>
          {selectedTab === tab && <View style={styles.indicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    height: 100,
    backgroundColor: "#A60F2D",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  tab: {
    fontSize: 16,
    alignItems: "center",
    paddingTop: 55,
    color: "white",
  },
  activeTab: {
    fontSize: 16,
    paddingTop: 55,
    color: "white",
    fontWeight: "bold",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 3,
    backgroundColor: "white",
    borderRadius: 2,
  },
});
