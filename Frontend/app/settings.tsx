import {
  View,
  StyleSheet,
  Text,
  // Switch,
  // TextInput,
  // Button,
} from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import Footer from "@/components/footer";
import Header from "@/components/header";
// import SensorModal from "@/components/SensorModal";
import { TouchableOpacity } from "react-native";

export default function Settings() {
  // const [isModalVisible, setModalVisible] = useState(false);
  const [dynamicSpeed, setDynamicSpeed] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState("°F");
  const [distanceUnit, setDistanceUnit] = useState("ft");
  const [tempOpen, setTempOpen] = useState(false);
  const [distOpen, setDistOpen] = useState(false);

  // const [speed, setSpeed] = useState("0.0");
  // const [dataPoints, setDataPoints] = useState("10.0");
  // const [speedOpen, setSpeedOpen] = useState(false);

  const tempUnits = [
    { label: "°C", value: "°C" },
    { label: "°F", value: "°F" },
  ];
  const distanceUnits = [
    { label: "m", value: "m" },
    { label: "ft", value: "ft" },
  ];
  const speedUnits = [
    { label: "m/s", value: "m/s" },
    { label: "km/h", value: "km/h" },
    { label: "mph", value: "mph" },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <Text style={styles.settingsTitle}>Settings</Text>
      <View style={styles.mainContainer}>
        {/* <SensorModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        /> */}
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
                // setSpeedOpen(!open);
              } else {
                setTempOpen(false); // Close dropdown if it's already open
              }
            }}
            setValue={(callback) => {
              setTemperatureUnit(callback);
              setTempOpen(false); // Close dropdown immediately after selection
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer} // Ensure it's above other views
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
                // setSpeedOpen(!open);
                setTempOpen(!open);
              } else {
                setDistOpen(false); // Close dropdown if it's already open
              }
            }}
            setValue={(callback) => {
              setDistanceUnit(callback);
              setDistOpen(false); // Close dropdown immediately after selection
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
        <TouchableOpacity style={styles.applyButton} onPress={() => {}}>
          <Text style={styles.applyButtonText}>Apply Changes</Text>
        </TouchableOpacity>
        {/* Data Collection */}
        {/* <Text style={styles.sectionHeader}>Data Collection</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Dynamic Speed</Text>
          <Switch
            style={styles.switch}
            value={dynamicSpeed}
            onValueChange={setDynamicSpeed}
          />
        </View> */}
        {/* Cruise Control */}
        {/* <Text style={styles.label}>Cruise Control</Text>
        <Text style={styles.subLabel}>Speed</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={speed}
            onChangeText={setSpeed}
          />
          <DropDownPicker
            open={speedOpen}
            value={speed}
            items={speedUnits}
            setOpen={(open) => {
              if (open) {
                setSpeedOpen(open);
                setTempOpen(!open);
                setDistOpen(!open);
              } else {
                setSpeedOpen(false); // Close dropdown if it's already open
              }
            }}
            setValue={(callback) => {
              setSpeed(callback);
              setSpeedOpen(false); // Close dropdown immediately after selection
            }}
            style={styles.dropdownSmall}
            dropDownContainerStyle={styles.dropdownSmallContainer}
          />
        </View> */}
        {/* Data Points */}
        {/* <Text style={styles.label}>Data points per 10 meter/feet</Text>
        <Text style={styles.subLabel}>Data Points</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={dataPoints}
          onChangeText={setDataPoints}
        /> */}
        {/* Data Interval */}
        {/* <Text style={styles.label}>Data Interval</Text>
        <Text style={styles.input}>Infinity s</Text> */}
        {/* Devices Section */}
        {/* <Text style={styles.sectionHeader}>Devices</Text> */}
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
  switch: {
    marginTop: 10,
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
  subLabel: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  dropdown: {
    marginTop: 5,
    marginBottom: 10,
  },

  dropdownContainer: {
    position: "absolute",
    top: 55, // Adjust this value based on layout
    zIndex: 1000, // Ensure it's above other elements
  },

  dropdownSmall: {
    width: 100,
    marginLeft: 10,
    marginBottom: 20,
  },

  dropdownSmallContainer: {
    position: "absolute",
    top: 48,
    maxWidth: 200,
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    // color: "blue",
    color: "#8B0000",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    fontSize: 16,
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: "blue",
    marginTop: 20,
  },
});
