import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Card, Button } from "react-native-paper";
import { Stack } from "expo-router";
import Footer from "@/components/footer";

export default function Weather() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [range, setRange] = useState(5);
  const [selectedStation, setSelectedStation] = useState("PULLMAN 2 NW");

  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  interface WeatherData {
    airTemperature: number;
    relativeHumidity: string;
    dewPoint: string;
    soilTemperature: string;
    pressure: string;
    windSpeed: string;
    windGust: string;
    windDirection: string;
    solarRadiation: string;
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, [selectedStation]);

  const fetchWeatherData = async () => {
    // Replace with actual API call
    const data = {
      airTemperature: 30.0,
      relativeHumidity: "N/A",
      dewPoint: "N/A",
      soilTemperature: "N/A",
      pressure: "N/A",
      windSpeed: "N/A",
      windGust: "N/A",
      windDirection: "N/A",
      solarRadiation: "N/A",
    };
    setWeatherData(data);
  };

  const formatLabel = (label: string) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.title}>Weather</Text>

        <View style={styles.sliderContainer}>
          <Slider
            value={range}
            onValueChange={(newValue) => setRange(newValue)}
            minimumValue={1}
            maximumValue={20}
            style={styles.slider}
          />
          <Text style={styles.rangeText}>{range.toFixed(1)} miles</Text>
          <Button
            mode="contained"
            onPress={fetchWeatherData}
            style={styles.applyButton}
          >
            Apply
          </Button>
        </View>

        <Card style={styles.card}>
          <View>
            <Text style={styles.stationName}>{selectedStation}</Text>
            <Text style={styles.subText}>
              Selected Station: {selectedStation}
            </Text>
            <Text style={styles.subText}>Distance: 1.86 miles</Text>

            <View style={styles.weatherInfo}>
              {weatherData &&
                Object.entries(weatherData).map(([key, value]) => (
                  <Text key={key} style={styles.weatherText}>
                    {formatLabel(key)}: {value}
                  </Text>
                ))}
            </View>
          </View>
        </Card>
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
  container: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#f7f7f7",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  slider: {
    width: "50%",
  },
  rangeText: {
    marginLeft: 10,
    fontSize: 16,
  },
  applyButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    elevation: 3, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#fff",
  },
  stationName: {
    fontSize: 18,
    fontWeight: "600",
  },
  subText: {
    color: "gray",
    fontSize: 14,
  },
  weatherInfo: {
    marginTop: 12,
  },
  weatherText: {
    fontSize: 16,
    paddingVertical: 15,
  },
});
