import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Footer() {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => router.push("/")}
      >
        <Ionicons name="analytics-outline" size={28} color="white" />
        <Text style={styles.iconText}>Data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => router.push("/analytics")}
      >
        <Ionicons name="bar-chart-outline" size={28} color="white" />
        <Text style={styles.iconText}>Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="map-outline" size={28} color="white" />
        <Text style={styles.iconText}>Heat Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="partly-sunny-outline" size={28} color="white" />
        <Text style={styles.iconText}>Weather</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="settings-sharp" size={28} color="white" />
        <Text style={styles.iconText}>Setting</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#A20025",
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    bottom: 0,
    position: "absolute",
  },
  iconContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
  iconText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
