// OptionHeader.tsx (example)
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";

interface Props {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export default function OptionHeader({ selectedTab, onTabChange }: Props) {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity onPress={() => onTabChange("Real-Time")}>
        <Text
          style={selectedTab === "Real-Time" ? styles.activeTab : styles.tab}
        >
          Real Time
        </Text>
        {selectedTab === "Real-Time" && <View style={styles.indicator} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTabChange("Historical")}>
        <Text
          style={selectedTab === "Historical" ? styles.activeTab : styles.tab}
        >
          Historical
        </Text>
        {selectedTab === "Historical" && <View style={styles.indicator} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    height: 100,
    backgroundColor: "#A20025",
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
