import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import useHeightAndTemperatureData from "@/hooks/useHeightAndTemperatureData";

const LineGraph = () => {
  const { data, loading } = useHeightAndTemperatureData();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A20025" />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No data available to display.</Text>
      </View>
    );
  }

  // Parse data into x (altitude) and y (temperature) points
  const points = data.map((item, index) => ({
    x: index * 40 + 20, // Scale x-axis with padding
    y: 250 - Number(item.average_temperature) * 5, // Scale y-axis with padding
  }));

  // Create a path for the line graph
  const path = Skia.Path.Make();
  if (points.length > 0) {
    path.moveTo(points[0].x, points[0].y);
    points.forEach((point) => {
      path.lineTo(point.x, point.y);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Altitude vs Temperature</Text>
      <Canvas style={styles.canvas}>
        {/* Draw the line */}
        <Path path={path} color="#A20025" style="stroke" strokeWidth={3} />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  canvas: {
    width: 350,
    height: 300,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#A20025",
  },
});

export default LineGraph;
