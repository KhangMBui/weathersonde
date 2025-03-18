import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useState } from "react";

export default function OptionHeader() {
  const [activeTab, setActiveTab] = useState("Historical");

  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        onPress={() => setActiveTab("Real-time")}
        style={styles.tab}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "Real-time" && styles.activeTabText,
          ]}
        >
          Real-time
        </Text>
        {activeTab === "Real-time" && <View style={styles.indicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab("Historical")}
        style={styles.tab}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "Historical" && styles.activeTabText,
          ]}
        >
          Historical
        </Text>
        {activeTab === "Historical" && <View style={styles.indicator} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {},
  topBar: {
    height: 100,
    backgroundColor: "#EAEAEA",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
  },
  tab: {
    alignItems: "center",
    paddingTop: 55,
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    width: "170%",
    height: 3,
    backgroundColor: "#007AFF", // Blue indicator
    borderRadius: 2,
  },
});
