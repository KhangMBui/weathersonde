import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
} from "react-native";
import {
  Canvas,
  Path,
  Skia,
  Circle,
  Text as SkiaText,
  Line,
  matchFont,
} from "@shopify/react-native-skia";
import useHeightAndTemperatureData from "@/hooks/useHeightAndTemperatureData";
import axios from "axios";

const fontFamily = Platform.select({ ios: "helvetia", default: "sans-serif" });
const font = matchFont({ fontFamily, fontSize: 14 });

// Utility function to generate tick marks
// const generateTicks = (min: number, max: number, numTicks: number) => {
//   if (numTicks <= 1) return [min]; // Handle edge case for 1 tick
//   const step = (max - min) / (numTicks - 1);
//   return Array.from({ length: numTicks }, (_, i) =>
//     parseFloat((min + i * step).toFixed(6))
//   );
// };
const generateTicks = (min: number, max: number, desiredStepSize: number) => {
  const range = max - min;
  const numTicks = Math.max(2, Math.ceil(range / desiredStepSize)); // Ensure at least 2 ticks
  const step = range / (numTicks - 1);
  return Array.from({ length: numTicks }, (_, i) =>
    parseFloat((min + i * step).toFixed(6))
  );
};

const LineGraph = ({ selectedTab }: { selectedTab: string }) => {
  const { data, loading } = useHeightAndTemperatureData();
  const [generalInfo, setGeneralInfo] = useState<{
    inversionIntensity: string;
    inversionHeight: string;
    inversionRate: string;
  }>({
    inversionIntensity: "",
    inversionHeight: "",
    inversionRate: "",
  });

  const getInversionData = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:8000/inversion");
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

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted components

    const fetchData = async () => {
      try {
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

  const isTemperatureGraph = selectedTab === "Altitude - Temperature";
  const xAxisLabel = isTemperatureGraph ? "Temperature (°C)" : "Humidity (%)";
  const xAxisDataKey = isTemperatureGraph
    ? "average_temperature"
    : "average_humidity";

  // // Determine the min and max values for temperature/humidity and altitude
  // const minAltitude = Math.min(...data.map((item) => item.altitude));
  // const maxAltitude = Math.max(...data.map((item) => item.altitude));
  // let minX = Math.min(...data.map((item) => item[xAxisDataKey]));
  // let maxX = Math.max(...data.map((item) => item[xAxisDataKey]));

  // // Normalize the data to fit within the graph dimensions
  // const points = data.map((item) => ({
  //   x: 50 + ((item[xAxisDataKey] - minX) / (maxX - minX)) * 300, // Scale x-axis to fit between 50 and 350
  //   y:
  //     300 - ((item.altitude - minAltitude) / (maxAltitude - minAltitude)) * 250, // Scale y-axis to fit between 300 and 50
  // }));

  // // Determine the desired step size for x-axis and y-axis
  // const xStepSize = (maxX - minX) / 5; // Divide the range into 5 steps
  // const yStepSize = (maxAltitude - minAltitude) / 5;

  // // Generate dynamic tick marks with better precision
  // const xTicks = generateTicks(minX, maxX, xStepSize).map((tick) =>
  //   parseFloat(tick.toFixed(3))
  // ); // Format to 3 decimal places
  // const yTicks = generateTicks(minAltitude, maxAltitude, yStepSize).map(
  //   (tick) => parseFloat(tick.toFixed(1))
  // ); // Format to 1 decimal place

  // // Create a path for the line graph
  // const path = Skia.Path.Make();
  // if (points.length > 0) {
  //   path.moveTo(points[0].x, points[0].y);
  //   points.forEach((point) => {
  //     // Handle case where all x-axis values are the same
  //     if (minX === maxX) {
  //       console.warn("All x-axis values are the same. Adjusting range...");
  //       minX -= 1; // Add a small range to avoid identical x values
  //       maxX += 1;
  //     }
  //     path.lineTo(point.x, point.y);
  //   });
  // }

  // Sort data by altitude
  const sortedData = data
    .filter((item) => item[xAxisDataKey] !== null && item.altitude !== null) // Filter out invalid data
    .sort((a, b) => a.altitude - b.altitude); // Sort by altitude

  // Determine the min and max values for temperature/humidity and altitude
  const minAltitude = Math.min(...sortedData.map((item) => item.altitude));
  const maxAltitude = Math.max(...sortedData.map((item) => item.altitude));
  let minX = Math.min(...sortedData.map((item) => item[xAxisDataKey]));
  let maxX = Math.max(...sortedData.map((item) => item[xAxisDataKey]));

  // Normalize the data to fit within the graph dimensions
  const points = sortedData.map((item) => ({
    x: 50 + ((item[xAxisDataKey] - minX) / (maxX - minX)) * 300, // Scale x-axis to fit between 50 and 350
    y:
      300 - ((item.altitude - minAltitude) / (maxAltitude - minAltitude)) * 250, // Scale y-axis to fit between 300 and 50
  }));

  // Create a path for the line graph
  const path = Skia.Path.Make();
  if (points.length > 0) {
    path.moveTo(points[0].x, points[0].y); // Start at the first point
    points.forEach((point) => {
      path.lineTo(point.x, point.y); // Draw a line to the next point
    });
  }

  const xStepSize = (maxX - minX) / 5; // Divide the range into 5 steps
  const xTicks = generateTicks(minX, maxX, xStepSize).map((tick) =>
    parseFloat(tick.toFixed(3))
  ); // Format to 3 decimal places

  const yStepSize = (maxAltitude - minAltitude) / 5; // Divide the range into 5 steps
  const yTicks = generateTicks(minAltitude, maxAltitude, yStepSize).map(
    (tick) => parseFloat(tick.toFixed(1))
  ); // Format to 1 decimal place

  return (
    <>
      <View style={styles.inversionContainer}>
        <View style={styles.infoCardGroup}>
          <Text style={styles.titleLabel}>🌪️ Inversion Data: </Text>
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
      </View>
      <Text style={styles.title}>Inversion Graph</Text>
      <View style={styles.graphContainer}>
        <Canvas style={styles.canvas}>
          {/* Draw x-axis */}
          <Line
            p1={{ x: 50, y: 300 }}
            p2={{ x: 350, y: 300 }}
            color="#000"
            strokeWidth={1}
          />
          {/* Draw y-axis */}
          <Line
            p1={{ x: 50, y: 50 }}
            p2={{ x: 50, y: 300 }}
            color="#000"
            strokeWidth={1}
          />

          {/* Add x-axis label */}
          <SkiaText x={150} y={340} text={xAxisLabel} font={font} />
          {/* Add y-axis label */}
          <SkiaText
            x={-210}
            y={14}
            text="Altitude (m)"
            font={font}
            transform={[{ rotate: -Math.PI / 2 }]} // Rotate text for vertical alignment
          />

          {/* Draw tick marks and labels for x-axis */}
          {xTicks.map((value, index) => {
            const label = value.toFixed(3); // Format to 3 decimal place
            const textWidth = font?.measureText(label).width ?? 0;

            return (
              <React.Fragment key={`x-tick-${index}`}>
                <Line
                  p1={{
                    x: 50 + ((value - minX) / (maxX - minX)) * 300,
                    y: 296,
                  }}
                  p2={{
                    x: 50 + ((value - minX) / (maxX - minX)) * 300,
                    y: 305,
                  }}
                  color="#000"
                  strokeWidth={1}
                />
                <SkiaText
                  x={
                    50 + ((value - minX) / (maxX - minX)) * 300 - textWidth / 2
                  } // Center-align the label
                  y={320}
                  text={label}
                  font={font}
                />
              </React.Fragment>
            );
          })}

          {/* Draw tick marks and labels for y-axis */}
          {yTicks.map((value, index) => {
            const label = value.toFixed(1); // Format to 1 decimal place
            const textWidth = font?.measureText(label).width ?? 0;

            return (
              <React.Fragment key={`y-tick-${index}`}>
                <Line
                  p1={{
                    x: 54,
                    y:
                      300 -
                      ((value - minAltitude) / (maxAltitude - minAltitude)) *
                        250,
                  }}
                  p2={{
                    x: 46,
                    y:
                      300 -
                      ((value - minAltitude) / (maxAltitude - minAltitude)) *
                        250,
                  }}
                  color="#000"
                  strokeWidth={1}
                />
                <SkiaText
                  x={45 - textWidth - 5} // Right-align the label
                  y={
                    300 -
                    ((value - minAltitude) / (maxAltitude - minAltitude)) *
                      250 +
                    5
                  }
                  text={label}
                  font={font}
                />
              </React.Fragment>
            );
          })}

          {/* Draw the line graph */}
          <Path path={path} color="#A20025" style="stroke" strokeWidth={3} />

          {/* Draw data points */}
          {points.map((point, index) => (
            <Circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={4}
              color="#007BFF"
            />
          ))}
        </Canvas>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  graphContainer: {
    flex: 1,
    // justifyContent: "center",
    // marginTop: 100,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  canvas: {
    width: 400,
    height: 350,
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
    alignSelf: "center",
    marginTop: 10,
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

  inversionContainer: {
    marginTop: 10,
    padding: 10,
  },
  infoCardGroup: {
    marginTop: 2,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 0,
    paddingHorizontal: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  titleLabel: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  infoGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Align items vertically
    marginBottom: 10, // Add spacing between rows
    marginTop: 30,
    gap: 5,
  },
  label: {
    fontSize: 16.5,
    color: "#555", // Medium gray for labels
    fontWeight: "600",
    paddingRight: 20, // Add space between label and value
    marginLeft: -50,
  },
  value: {
    marginTop: 5,
    fontSize: 15,
    color: "#007BFF", // Blue for emphasis
    fontWeight: "bold",
    marginRight: -45,
  },
});

export default LineGraph;
