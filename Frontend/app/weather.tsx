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
      const response = await axios.get("http://192.168.56.1:8000/ws_data");
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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <Text style={styles.title}>Weather Information</Text>
      <View style={styles.container}>
        {weatherData ? (
          <View style={styles.card}>
            <Text style={styles.info}>
              📍 Location: {droneLocation.latitude}, {droneLocation.longitude}
            </Text>
            <Text style={styles.weatherText}>
              🕒 Time: {weatherData.hourly.time[0].toISOString()}
            </Text>
            <Text style={styles.weatherText}>
              🌡️ Temperature (80m): {weatherData.hourly.temperature80m[0]}°C
            </Text>
            <Text style={styles.weatherText}>
              💧 Relative Humidity (2m):{" "}
              {weatherData.hourly.relativeHumidity2m[0]}%
            </Text>
            <Text style={styles.weatherText}>
              ❄️ Dew Point (2m): {weatherData.hourly.dewPoint2m[0]}°C
            </Text>
            <Text style={styles.weatherText}>
              🌬️ Wind Speed (80m): {weatherData.hourly.windSpeed80m[0]} m/s
            </Text>
            <Text style={styles.weatherText}>
              🌱 Soil Temperature (0cm):{" "}
              {weatherData.hourly.soilTemperature0cm[0]}°C
            </Text>
          </View>
        ) : (
          <Text>No weather data available.</Text>
        )}
        <Footer />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
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
});
