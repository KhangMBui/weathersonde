import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useSettings } from "@/contexts/SettingsContext";
import { Alert } from "react-native";

export default function Settings() {
  const {
    temperatureUnit: globalTempUnit,
    distanceUnit: globalDistUnit,
    setTemperatureUnit,
    setDistanceUnit,
  } = useSettings(); // Access global settings
  const [temperatureUnit, setTempUnit] = useState(globalTempUnit); // Initialize with global value
  const [distanceUnit, setDistUnit] = useState(globalDistUnit); // Initialize with global value
  const [tempOpen, setTempOpen] = useState(false);
  const [distOpen, setDistOpen] = useState(false);

  const tempUnits = [
    { label: "°C", value: "°C" },
    { label: "°F", value: "°F" },
  ];
  const distanceUnits = [
    { label: "m", value: "m" },
    { label: "ft", value: "ft" },
  ];

  // Sync local state with global state when the component mounts
  useEffect(() => {
    setTempUnit(globalTempUnit);
    setDistUnit(globalDistUnit);
  }, [globalTempUnit, globalDistUnit]);

  const handleApplyChanges = () => {
    setTemperatureUnit(temperatureUnit); // Update global temperature unit
    setDistanceUnit(distanceUnit); // Update global distance unit
    // Show confirmation popup
    Alert.alert(
      "Changes Applied",
      `Temperature Unit: ${temperatureUnit}\nDistance Unit: ${distanceUnit}`,
      [{ text: "OK", onPress: () => console.log("Settings applied") }]
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <Text style={styles.settingsTitle}>Settings</Text>
      <View style={styles.mainContainer}>
        {/* Temperature Unit */}
        <Text style={styles.sectionHeader}>Units</Text>
        <Text style={styles.label}>Temperature Unit</Text>
        <View style={{ zIndex: 3000 }}>
          <DropDownPicker
            open={tempOpen}
            value={temperatureUnit}
            items={tempUnits}
            setOpen={(open) => {
              if (open) {
                setTempOpen(open);
                setDistOpen(!open);
              } else {
                setTempOpen(false); // Close dropdown if it's already open
              }
            }}
            setValue={(callback) => {
              setTempUnit(callback); // Update local state
              setTempOpen(false); // Close dropdown immediately after selection
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
        {/* Distance Unit */}
        <Text style={styles.label}>Distance Unit</Text>
        <View style={{ zIndex: 2000 }}>
          <DropDownPicker
            open={distOpen}
            value={distanceUnit}
            items={distanceUnits}
            setOpen={(open) => {
              if (open) {
                setDistOpen(open);
                setTempOpen(!open);
              } else {
                setDistOpen(false); // Close dropdown if it's already open
              }
            }}
            setValue={(callback) => {
              setDistUnit(callback); // Update local state
              setDistOpen(false); // Close dropdown immediately after selection
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyChanges}
        >
          <Text style={styles.applyButtonText}>Apply Changes</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    marginTop: -15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
    paddingTop: 10,
  },
  applyButton: {
    backgroundColor: "#A20025", // Dark red color
    borderRadius: 8, // Rounded corners
    paddingVertical: 12, // Vertical padding for better height
    paddingHorizontal: 20, // Horizontal padding for better width
    marginTop: 20, // Add spacing from other elements
    alignItems: "center", // Center the button text
    justifyContent: "center", // Center the button text
    shadowColor: "#000", // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  applyButtonText: {
    color: "#fff", // White text for contrast
    fontSize: 16, // Font size for readability
    fontWeight: "bold", // Bold text for emphasis
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B0000",
    marginTop: 20,
  },
  dropdown: {
    marginTop: 5,
    marginBottom: 10,
  },
  dropdownContainer: {
    position: "absolute",
    top: 55,
    zIndex: 1000,
  },
});
