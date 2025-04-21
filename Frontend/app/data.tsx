import Footer from "@/components/footer";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import OptionHeader from "@/components/optionHeader";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/SettingsContext";
import { useUnitConversion } from "@/hooks/useUnitConversion";
// import SensorModal from "@/components/SensorModal";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Data() {
  // For testing purpose
  const [expandedItem, setExpandedItem] = useState<string | null>(null); // Track expanded item by unique identifier
  const [selectedTab, setSelectedTab] = useState("Real-Time");
  const [message, setMessage] = useState("Loading...");
  // const [isModalVisible, setModalVisible] = useState(false);
  const { convertTemperature, convertDistance } = useUnitConversion();

  const [generalInfo, setGeneralInfo] = useState({
    date: "",
    time: "",
    altitude: "",
    internalTemp: "",
    internalRH: "",
    internalPres: "",
    airTemp: "",
    weatherRH: "",
    inversionIntensity: "",
    inversionHeight: "",
    inversionRate: "",
    totalSamples: "",
  });

  // For constant data fetching on the historical page
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data at regular intervals
    const interval = setInterval(() => {
      getDroneInfo();
      getInversionData();
    }, 10000); // Fetch every 2 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    // Append new historical data whenever generalInfo changes
    if (generalInfo.date && generalInfo.time) {
      const newEntry = {
        date: generalInfo.date,
        time: generalInfo.time,
        altitude: generalInfo.altitude,
        internalTemp: generalInfo.internalTemp,
        internalRH: generalInfo.internalRH,
        internalPres: generalInfo.internalPres,
        airTemp: generalInfo.airTemp,
        weatherRH: generalInfo.weatherRH,
        inversionIntensity: generalInfo.inversionIntensity,
        inversionHeight: generalInfo.inversionHeight,
        inversionRate: generalInfo.inversionRate,
      };

      setHistoricalData((prevData) => {
        // Check if the new entry is already in the historical data
        if (
          prevData.length > 0 &&
          JSON.stringify(prevData[0]) === JSON.stringify(newEntry)
        ) {
          return prevData; // Avoid adding duplicate entries
        }
        const updatedData = [newEntry, ...prevData];
        return updatedData.slice(0, 20); // Keep only the latest 20 entries
      });
    }
  }, [generalInfo]);

  const getDroneInfo = async () => {
    try {
      const response = await axios.get("http://172.29.208.1:8000/ws_data");
      const {
        Date: date,
        Time: time,
        latitude: latitude,
        longitude: longitude,
        altitude: altitude,
        Internal_Temp: internalTemp,
        Internal_RH: internalRH,
        Internal_Pres: internalPres,
        Weather: { Air_Temperature: airTemp, RH: weatherRH },
      } = response.data;

      // Convert values based on global units
      const convertedAltitude = convertDistance(altitude);
      const convertedInternalTemp = convertTemperature(internalTemp);
      const convertedAirTemp = convertTemperature(airTemp);

      const snapshot = {
        date,
        time,
        latitude,
        longitude,
        altitude: convertedAltitude,
        internalTemp: convertedInternalTemp,
        internalRH,
        internalPres,
        airTemp: convertedAirTemp,
        weatherRH,
      };

      // Update live data
      setGeneralInfo((prev) => ({
        ...prev,
        ...snapshot,
      }));

      // Add snapshot to the top of the history
      // setHistoricalData((prev) => [snapshot, ...prev]);
    } catch (error) {
      setMessage("Failed to fetch data");
      console.error("Error fetching drone location:", error);
    }
  };

  const getInversionData = async () => {
    try {
      const response = await axios.get("http://172.29.208.1:8000/inversion");
      const data = response.data;

      const inversionData = {
        inversionIntensity: data.inversion_intensity ?? NaN,
        inversionHeight: data.inversion_height ?? NaN,
        inversionRate: data.inversion_rate ?? NaN,
        totalSamples: data.total_samples ?? 0,
      };

      // Update generalInfo with inversion data
      setGeneralInfo((prev) => ({
        ...prev,
        ...inversionData,
      }));
    } catch (error) {
      console.error("Error fetching inversion data:", error);
    }
  };

  const { temperatureUnit, distanceUnit } = useSettings();

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* <OptionHeader /> */}
      <OptionHeader selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {selectedTab === "Real-Time" ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Real-Time Drone Data</Text>

          <View style={styles.infoCard}>
            <Text style={styles.label}>🔢 Number of data record:</Text>
            <Text style={styles.value}>{generalInfo.totalSamples}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>📅 Date:</Text>
            <Text style={styles.value}>{generalInfo.date}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>🕒 Time:</Text>
            <Text style={styles.value}>{generalInfo.time}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>⛰️ Altitude:</Text>
            <Text style={styles.value}>{generalInfo.altitude}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>🌤️ Air Temp:</Text>
            <Text style={styles.value}>{generalInfo.airTemp}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>💦 Weather RH:</Text>
            <Text style={styles.value}>{generalInfo.weatherRH}</Text>
          </View>

          <View style={styles.infoCardGroup}>
            <Text style={styles.label}>🌪️ Inversion Data: </Text>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>{"\t"}🔥 Inversion Intensity: </Text>
              <Text style={styles.value}>{generalInfo.inversionIntensity}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>{"\t"}📏 Inversion height:</Text>
              <Text style={styles.value}>{generalInfo.inversionHeight}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>{"\t"}📉 Inversion rate:</Text>
              <Text style={styles.value}>{generalInfo.inversionRate}</Text>
            </View>
          </View>
          <View style={styles.infoCardGroup}>
            <Text style={styles.label}>🚁 Internal Drone Data: </Text>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>{"\t"}🌡️ Temp: </Text>
              <Text style={styles.value}>{generalInfo.internalTemp}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>{"\t"}💧 RH:</Text>
              <Text style={styles.value}>{generalInfo.internalRH}</Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>{"\t"}📊 Pressure:</Text>
              <Text style={styles.value}>{generalInfo.internalPres}</Text>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView
          style={{ padding: 10 }}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <Text style={styles.infoTitle}>Historical Drone Data</Text>
          {historicalData.map((item) => {
            const uniqueId = `${item.date}-${item.time}`; // Create a unique identifier for each item
            return (
              <View key={uniqueId} style={styles.infoCard}>
                <TouchableOpacity
                  onPress={() =>
                    setExpandedItem(expandedItem === uniqueId ? null : uniqueId)
                  }
                >
                  <Text style={styles.value}>
                    📅 Date: {item.date} 🕒 Time: {item.time}
                    {"\n"}
                    ⛰️ Altitude: {item.altitude}
                    {expandedItem === uniqueId && (
                      <>
                        {"\n"}
                        🌡️ Internal Temp: {item.internalTemp}
                        {"\n"}
                        💧 Internal RH: {item.internalRH}
                        {"\n"}
                        📊 Internal Pressure: {item.internalPres}
                        {"\n"}
                        🌤️ Air Temp: {item.airTemp}
                        {"\n"}
                        💦 Weather RH: {item.weatherRH}
                        {"\n"}
                        🔥 Inversion Intensity: {item.inversionIntensity ?? NaN}
                        {"\n"}
                        📏 Inversion Height: {item.inversionHeight ?? NaN}
                        {"\n"}
                        📉 Inversion Rate: {item.inversionRate ?? NaN}
                      </>
                    )}
                  </Text>
                  <Text style={styles.expandText}>
                    {expandedItem === uniqueId ? "Show Less ▲" : "Show More ▼"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
      {/* 
      <SensorModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      /> */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  infoContainer: {
    marginTop: 10,
    padding: 10,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  infoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCardGroup: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#111",
  },
  infoGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expandText: {
    fontSize: 14,
    color: "#007BFF",
    marginTop: 5,
    textAlign: "right",
  },
});
