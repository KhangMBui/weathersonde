import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import Footer from "@/components/footer";
import Header from "@/components/header";
import axios from "axios";
import { fetchWeatherApi } from "openmeteo";

export default function Weather() {
  const [droneLocation, setDroneLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDroneInfo = async () => {
    try {
      const response = await axios.get("http://10.0.2.246:8000/ws_data");
      const { latitude, longitude } = response.data;
      setDroneLocation({ latitude, longitude });
    } catch (error) {
      console.error("Error fetching drone location:", error);
      setError("Failed to fetch drone location.");
    }
  };

  const fetchWeather = async (latitude: number, longitude: number) => {
    const params = {
      latitude,
      longitude,
      hourly: [
        "relative_humidity_2m",
        "dew_point_2m",
        "temperature_80m",
        "wind_speed_80m",
        "soil_temperature_0cm",
      ],
    };
    const url = "https://api.open-meteo.com/v1/forecast";

    try {
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];

      // Process weather data
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const hourly = response.hourly()!;
      const weatherData = {
        hourly: {
          time: [
            ...Array(
              (Number(hourly.timeEnd()) - Number(hourly.time())) /
                hourly.interval()
            ),
          ].map(
            (_, i) =>
              new Date(
                (Number(hourly.time()) +
                  i * hourly.interval() +
                  utcOffsetSeconds) *
                  1000
              )
          ),
          relativeHumidity2m: hourly.variables(0)!.valuesArray()!,
          dewPoint2m: hourly.variables(1)!.valuesArray()!,
          temperature80m: hourly.variables(2)!.valuesArray()!,
          windSpeed80m: hourly.variables(3)!.valuesArray()!,
          soilTemperature0cm: hourly.variables(4)!.valuesArray()!,
        },
      };

      setWeatherData(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Failed to fetch weather data.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getDroneInfo();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (droneLocation.latitude && droneLocation.longitude) {
      fetchWeather(droneLocation.latitude, droneLocation.longitude);
    }
  }, [droneLocation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium", // Formats the date (e.g., Apr 22, 2025)
      timeStyle: "short", // Formats the time (e.g., 12:00 AM)
    }).format(date);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <Text style={styles.title}>Weather Information</Text>
      <View style={styles.container}>
        {weatherData ? (
          <View style={styles.card}>
            {/* <Text style={styles.info}>
              <Text style={styles.boldText}>📍 Location: </Text>
              {droneLocation.latitude}, {droneLocation.longitude}
            </Text>
            <Text style={styles.weatherText}>
              <Text style={styles.boldText}>🕒 Time: </Text>
              {formatTime(weatherData.hourly.time[0])}
            </Text>
            <Text style={styles.weatherText}>
              <Text style={styles.boldText}>🌡️ Temperature (80 m): </Text>
              {parseFloat(weatherData.hourly.temperature80m[0]).toFixed(2)}°C
            </Text>
            <Text style={styles.weatherText}>
              <Text style={styles.boldText}>💧 Relative Humidity (2 m): </Text>
              {weatherData.hourly.relativeHumidity2m[0]}%
            </Text>
            <Text style={styles.weatherText}>
              <Text style={styles.boldText}>❄️ Dew Point (2 m): </Text>
              {parseFloat(weatherData.hourly.dewPoint2m[0]).toFixed(2)}°C
            </Text>
            <Text style={styles.weatherText}>
              <Text style={styles.boldText}>🌬️ Wind Speed (80 m): </Text>
              {parseFloat(weatherData.hourly.windSpeed80m[0]).toFixed(2)} m/s
            </Text>
            <Text style={styles.weatherText}>
              <Text style={styles.boldText}>🌱 Soil Temperature: </Text>
              {parseFloat(weatherData.hourly.soilTemperature0cm[0]).toFixed(2)}
              °C
            </Text> */}
            <View style={styles.row}>
              <Text style={styles.boldText}>📍 Location: </Text>
              <Text style={styles.valueText}>
                {droneLocation.latitude}, {droneLocation.longitude}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.boldText}>🕒 Time:</Text>
              <Text style={styles.valueText}>
                {formatTime(weatherData.hourly.time[0])}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.boldText}>🌡️ Temperature (80 m):</Text>
              <Text style={styles.valueText}>
                {parseFloat(weatherData.hourly.temperature80m[0]).toFixed(2)}°C
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.boldText}>💧 Relative Humidity (2 m):</Text>
              <Text style={styles.valueText}>
                {weatherData.hourly.relativeHumidity2m[0]}%
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.boldText}>❄️ Dew Point (2 m):</Text>
              <Text style={styles.valueText}>
                {parseFloat(weatherData.hourly.dewPoint2m[0]).toFixed(2)}°C
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.boldText}>🌬️ Wind Speed (80 m):</Text>
              <Text style={styles.valueText}>
                {parseFloat(weatherData.hourly.windSpeed80m[0]).toFixed(2)} m/s
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.boldText}>🌱 Soil Temperature:</Text>
              <Text style={styles.valueText}>
                {parseFloat(weatherData.hourly.soilTemperature0cm[0]).toFixed(
                  2
                )}
                °C
              </Text>
            </View>
          </View>
        ) : (
          <Text>No weather data available.</Text>
        )}
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
    flex: 1,
    paddingTop: 10,
  },
  title: {
    backgroundColor: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#A20025", // WSU Crimson for a bold look
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  weatherText: {
    fontSize: 16,
    paddingVertical: 5,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    fontSize: 18,
    color: "red",
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  valueText: {
    fontSize: 16,
    textAlign: "right",
    color: "#007BFF",
    // fontWeight: "bold",
  },
});
