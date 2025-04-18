import Footer from "@/components/footer";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Stack } from "expo-router";
import OptionHeader from "@/components/optionHeader";
import SensorModal from "@/components/SensorModal";
import axios from "axios";
import { useEffect, useState } from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Analytics() {
  // For testing purpose
  const [selectedTab, setSelectedTab] = useState("Real-Time");
  const [message, setMessage] = useState("Loading...");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const [generalInfo, setGeneralInfo] = useState({
    date: "",
    time: "",
    altitude: "",
    internalTemp: "",
    internalRH: "",
    internalPres: "",
    airTemp: "",
    weatherRH: "",
  });

  // For constant data fetching on the historical page
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data at regular intervals
    const interval = setInterval(() => {
      getDroneInfo();
    }, 2000); // Fetch every 2 seconds

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
      };
      setHistoricalData((prevData) => {
        const updatedData = [newEntry, ...prevData];
        return updatedData.slice(0, 20); // Keep only the latest 50 entries
      });
    }
  }, [generalInfo]);

  const getDroneInfo = async () => {
    try {
      const response = await axios.get("http://192.168.56.1:8000/ws_data");
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
      // console.log("Drone location fetched: ", latitude, longitude);
      const snapshot = {
        date,
        time,
        latitude,
        longitude,
        altitude,
        internalTemp,
        internalRH,
        internalPres,
        airTemp,
        weatherRH,
      };

      // Update live data
      setGeneralInfo(snapshot);

      // Add snapshot to the top of the history
      setHistoricalData((prev) => [snapshot, ...prev]);
    } catch (error) {
      setMessage("Failed to fetch data");
      console.error("Error fetching drone location:", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* <OptionHeader /> */}
      <OptionHeader selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {selectedTab === "Real-Time" ? (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Real-Time Drone Data</Text>

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
            <Text style={styles.label}>🌡️ Internal Temp:</Text>
            <Text style={styles.value}>{generalInfo.internalTemp}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>💧 Internal RH:</Text>
            <Text style={styles.value}>{generalInfo.internalRH}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>📊 Internal Pressure:</Text>
            <Text style={styles.value}>{generalInfo.internalPres}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>🌤️ Air Temp:</Text>
            <Text style={styles.value}>{generalInfo.airTemp}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>💦 Weather RH:</Text>
            <Text style={styles.value}>{generalInfo.weatherRH}</Text>
          </View>
        </View>
      ) : (
        // <View style={styles.infoContainer}>
        //   <Text style={styles.infoTitle}>Historical Data</Text>
        //   {historicalData.map((entry, index) => (
        //     <View key={index} style={styles.infoCard}>
        //       <Text style={styles.value}>{entry}</Text>
        //     </View>
        //   ))}
        // </View>
        <ScrollView
          style={{ padding: 10 }}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {historicalData.map((item, index) => (
            <View key={index} style={styles.infoCard}>
              <Text style={styles.value}>
                📅 Date: {item.date} 🕒 Time: {item.time}
                {"\n"}
                ⛰️ Altitude: {item.altitude}
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
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      <SensorModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Footer
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
        onHeatMapPress={() => setModalVisible(true)}
      />
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
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#111",
  },
});
