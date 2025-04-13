import { View, StyleSheet, Text, Switch, TextInput } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import Footer from "@/components/footer";
import SensorModal from "@/components/SensorModal";
import { TouchableOpacity } from "react-native";

export default function Settings() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [dynamicSpeed, setDynamicSpeed] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState("°F");
  const [distanceUnit, setDistanceUnit] = useState("ft");
  const [speed, setSpeed] = useState("0.0");
  const [dataPoints, setDataPoints] = useState("10.0");

  const [tempOpen, setTempOpen] = useState(false);
  const [distOpen, setDistOpen] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);

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

  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  return (
    <>
      <View style={styles.mainContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <SensorModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
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
                setSpeedOpen(!open);
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
                setSpeedOpen(!open);
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
      <Footer
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
        onHeatMapPress={() => setModalVisible(true)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },

  switch: {
    marginTop: 10,
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
