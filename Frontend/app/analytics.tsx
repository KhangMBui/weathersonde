/**
 * @jest-environment @shopify/react-native-skia/jestEnv.mjs
 */
import Footer from "@/components/footer";
import { View, StyleSheet } from "react-native";
// import SensorModal from "@/components/SensorModal";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import { Stack } from "expo-router";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import LineGraph from "@/components/LineGraph";

export default function Analytics() {
  const [message, setMessage] = useState("Loading...");
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
      const response = await axios.get("http://192.168.56.1:8000/inversion");
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

  // const width = 256;
  // const height = 256;
  // const r = width * 0.33;

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      {/* <Canvas style={{ width, height }}>
        <Group blendMode="multiply">
          <Circle cx={r} cy={r} r={r} color="cyan" />
          <Circle cx={width - r} cy={r} r={r} color="magenta" />
          <Circle cx={width / 2} cy={width - r} r={r} color="yellow" />
        </Group>
      </Canvas> */}
      <LineGraph />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
