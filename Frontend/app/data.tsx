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
import { useUnitConversion } from "@/hooks/useUnitConversion";
import { useHistoricalData } from "@/contexts/HistoricalDataContext";
import { useSettings } from "@/contexts/SettingsContext";
import Constants from "expo-constants";

export default function Data() {
  const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL || "";

  const { historicalData, setHistoricalData } = useHistoricalData();

  const [expandedItem, setExpandedItem] = useState<string | null>(null); // Track expanded item by unique identifier
  const [selectedTab, setSelectedTab] = useState("Real-Time");

  const { temperatureUnit, distanceUnit } = useSettings();
  const { convertTemperature, convertDistance } = useUnitConversion();

  const [generalInfo, setGeneralInfo] = useState<{
    date: string;
    time: string;
    altitude: number | null;
    internalTemp: number | null;
    internalRH: string;
    internalPres: string;
    airTemp: number | null;
    weatherRH: string;
    inversionIntensity: string;
    inversionHeight: string;
    inversionRate: string;
    totalSamples: string;
  }>({
    date: "",
    time: "",
    altitude: null,
    internalTemp: null,
    internalRH: "",
    internalPres: "",
    airTemp: null,
    weatherRH: "",
    inversionIntensity: "",
    inversionHeight: "",
    inversionRate: "",
    totalSamples: "",
  });

  // // For constant data fetching on the historical page
  // const [historicalData, setHistoricalData] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted components

    const fetchData = async () => {
      try {
        await getDroneInfo();
        await getInversionData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (isMounted) {
        setTimeout(fetchData, 3000); // Schedule the next fetch after 3 seconds
      }
    };

    fetchData(); // Start the first fetch

    return () => {
      isMounted = false; // Cleanup on component unmount
    };
  }, []);

  useEffect(() => {
    if (generalInfo.date && generalInfo.time) {
      const newEntry = {
        date: generalInfo.date,
        time: generalInfo.time,
        altitude: generalInfo.altitude, // store raw
        internalTemp: generalInfo.internalTemp, // store raw
        internalRH: generalInfo.internalRH,
        internalPres: generalInfo.internalPres,
        airTemp: generalInfo.airTemp, // store raw
        weatherRH: generalInfo.weatherRH,
        inversionIntensity: generalInfo.inversionIntensity,
        inversionHeight: generalInfo.inversionHeight,
        inversionRate: generalInfo.inversionRate,
      };

      setHistoricalData((prevData) => {
        const isDuplicate = prevData.some(
          (entry) =>
            entry.date === newEntry.date && entry.time === newEntry.time
        );
        if (isDuplicate) {
          return prevData;
        }
        const updatedData = [newEntry, ...prevData];
        return updatedData.slice(0, 20);
      });
    }
  }, [generalInfo]);

  const getDroneInfo = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/ws_data`);
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
      console.error("Error fetching drone location:", error);
    }
  };

  const getInversionData = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/inversion`);
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* <OptionHeader /> */}
      <OptionHeader
        tabs={["Real-Time", "Historical"]}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <View style={styles.mainContainer}>
        {selectedTab === "Real-Time" ? (
          <View style={styles.infoContainer}>
            {/* <Text style={styles.infoTitle}>WeatherSonde Real-Time</Text> */}
            <View style={styles.infoCard}>
              <Text style={styles.label}>🔢 Number of record:</Text>
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
              <Text style={styles.value}>
                {generalInfo.altitude} {distanceUnit}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.label}>🌤️ Air Temp:</Text>
              <Text style={styles.value}>
                {generalInfo.airTemp !== null
                  ? parseFloat(generalInfo.airTemp.toString()).toFixed(2)
                  : "N/A"}{" "}
                {temperatureUnit}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.label}>💦 Humidity:</Text>
              <Text style={styles.value}>{generalInfo.weatherRH} %</Text>
            </View>

            <View style={styles.infoCardGroup}>
              <Text style={styles.label}>🌪️ Inversion Data: </Text>
              <View style={styles.infoGroup}>
                <Text style={styles.label}>{"\t"}🔥 Intensity: </Text>
                <Text style={styles.value}>
                  {parseFloat(generalInfo.inversionIntensity).toFixed(3)} {"°C"}
                </Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.label}>{"\t"}📏 Height:</Text>
                <Text style={styles.value}>
                  {parseFloat(generalInfo.inversionHeight).toFixed(3)} {"m"}
                </Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.label}>{"\t"}📉 Rate:</Text>
                <Text style={styles.value}>
                  {parseFloat(generalInfo.inversionRate).toFixed(3)} {"°C/m"}
                </Text>
              </View>
            </View>
            <View style={styles.infoCardGroup}>
              <Text style={styles.label}>🚁 WeatherSonde internal data: </Text>
              <View style={styles.infoGroup}>
                <Text style={styles.label}>{"\t"}🌡️ Temp: </Text>
                <Text style={styles.value}>
                  {generalInfo.internalTemp !== null
                    ? parseFloat(generalInfo.internalTemp.toString()).toFixed(2)
                    : "N/A"}{" "}
                  {temperatureUnit}
                </Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.label}>{"\t"}💧 RH:</Text>
                <Text style={styles.value}>{generalInfo.internalRH} %</Text>
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
            {/* <Text style={styles.infoTitle}>WeatherSonde Historical</Text> */}
            {historicalData.map((item, index) => {
              const uniqueId = `${item.date}-${item.time}`;
              return (
                <View key={uniqueId} style={styles.infoCard}>
                  <TouchableOpacity
                    onPress={() =>
                      setExpandedItem(
                        expandedItem === uniqueId ? null : uniqueId
                      )
                    }
                  >
                    <Text style={styles.value}>
                      📅 Date: {item.date} 🕒 Time: {item.time}
                      {"\n"}
                      ⛰️ Altitude:{" "}
                      {item.altitude !== null
                        ? convertDistance(item.altitude)
                        : "N/A"}{" "}
                      {distanceUnit}
                      {expandedItem === uniqueId && (
                        <>
                          {"\n"}
                          🌡️ Internal Temp:{" "}
                          {item.internalTemp !== null
                            ? convertTemperature(item.internalTemp)
                            : "N/A"}{" "}
                          {temperatureUnit}
                          {"\n"}
                          💧 Internal RH: {item.internalRH} %{"\n"}
                          📊 Internal Pressure: {item.internalPres}
                          {"\n"}
                          🌤️ Air Temp:{" "}
                          {item.airTemp !== null
                            ? convertTemperature(item.airTemp)
                            : "N/A"}{" "}
                          {temperatureUnit}
                          {"\n"}
                          💦 RH: {item.weatherRH} %{"\n"}
                          🔥 Inversion Intensity:{" "}
                          {parseFloat(item.inversionIntensity).toFixed(2) ??
                            NaN}{" "}
                          {"°C"}
                          {"\n"}
                          📏 Inversion Height:{" "}
                          {parseFloat(item.inversionHeight).toFixed(2) ??
                            NaN}{" "}
                          {"m"}
                          {"\n"}
                          📉 Inversion Rate:{" "}
                          {parseFloat(item.inversionRate).toFixed(2) ??
                            NaN}{" "}
                          {"°C/m"}
                        </>
                      )}
                    </Text>
                    <Text style={styles.expandText}>
                      {expandedItem === uniqueId
                        ? "Show Less ▲"
                        : "Show More ▼"}
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
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  infoContainer: {
    marginTop: 50,
    padding: 10,
  },
  // infoTitle: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   marginBottom: 15,
  //   textAlign: "center",
  //   color: "#333",
  // },
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
