import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface FooterProps {
  selectedButton: string | null;
  setSelectedButton: (button: string) => void;
  onHeatMapPress: () => void;
}

export default function Footer({
  selectedButton,
  setSelectedButton,
  onHeatMapPress,
}: FooterProps) {
  // Helper function to handle button press and highlight the selected one
  const handlePress = (button: string, onPress: () => void) => {
    setSelectedButton(button); // Set the selected button
    onPress(); // Call the respective press function
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          selectedButton === "data" && styles.selectedButton, // Highlight selected button
        ]}
        onPress={() => handlePress("data", () => router.push("/"))}
      >
        <Ionicons name="analytics-outline" size={28} color="white" />
        <Text style={styles.iconText}>Data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          selectedButton === "analytics" && styles.selectedButton, // Highlight selected button
        ]}
        onPress={() =>
          handlePress("analytics", () => router.push("/analytics"))
        }
      >
        <Ionicons name="bar-chart-outline" size={28} color="white" />
        <Text style={styles.iconText}>Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          selectedButton === "heatmap" && styles.selectedButton, // Highlight selected button
        ]}
        onPress={() => handlePress("heatmap", onHeatMapPress)}
      >
        <Ionicons name="map-outline" size={28} color="white" />
        <Text style={styles.iconText}>Heat Map</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          selectedButton === "weather" && styles.selectedButton, // Highlight selected button
        ]}
        onPress={() => handlePress("weather", () => router.push("/settings"))}
      >
        <Ionicons name="partly-sunny-outline" size={28} color="white" />
        <Text style={styles.iconText}>Weather</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          selectedButton === "settings" && styles.selectedButton, // Highlight selected button
        ]}
        onPress={() => handlePress("settings", () => router.push("/settings"))}
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
  // Style for the selected button (darker shade of red)
  selectedButton: {
    backgroundColor: "#8B0000", // Darker red
    borderRadius: 8,
    padding: 5,
  },
});
