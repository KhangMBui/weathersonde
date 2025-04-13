import Footer from "@/components/footer";
import { View, StyleSheet, Text } from "react-native";
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

  useEffect(() => {
    getDroneInfo();
  });

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
      console.log("Drone location fetched: ", latitude, longitude);
      setGeneralInfo({
        date,
        time,
        altitude,
        internalTemp,
        internalRH,
        internalPres,
        airTemp,
        weatherRH,
      });
    } catch (error) {
      setMessage("Failed to fetch data");
      console.error("Error fetching drone location:", error);
    }
  };

  // const renderDataRow = (
  //   icon: React.ReactNode,
  //   label: string,
  //   value: string
  // ) => (
  //   <View style={styles.dataRow}>
  //     <View style={styles.iconLabel}>
  //       {icon}
  //       <Text style={styles.label}>{label}</Text>
  //     </View>
  //     <Text style={styles.value}>{value}</Text>
  //   </View>
  // );

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
        <View>
          <Text style={{ fontSize: 18, margin: 10 }}>Historical Data</Text>
          {/* Replace with actual historical content */}
          <Text>This will be historical analytics.</Text>
          <Text>{message}</Text>
        </View>
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
