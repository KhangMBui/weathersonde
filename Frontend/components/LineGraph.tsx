import React from "react";
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

  // Determine the min and max values for temperature/humidity and altitude
  const minAltitude = Math.min(...data.map((item) => item.altitude));
  const maxAltitude = Math.max(...data.map((item) => item.altitude));
  let minX = Math.min(...data.map((item) => item[xAxisDataKey]));
  let maxX = Math.max(...data.map((item) => item[xAxisDataKey]));

  // Normalize the data to fit within the graph dimensions
  const points = data.map((item) => ({
    x: 50 + ((item[xAxisDataKey] - minX) / (maxX - minX)) * 300, // Scale x-axis to fit between 50 and 350
    y:
      300 - ((item.altitude - minAltitude) / (maxAltitude - minAltitude)) * 250, // Scale y-axis to fit between 300 and 50
  }));

  // Determine the desired step size for x-axis and y-axis
  const xStepSize = (maxX - minX) / 5; // Divide the range into 5 steps
  const yStepSize = (maxAltitude - minAltitude) / 5;

  // Generate dynamic tick marks with better precision
  const xTicks = generateTicks(minX, maxX, xStepSize).map((tick) =>
    parseFloat(tick.toFixed(3))
  ); // Format to 3 decimal places
  const yTicks = generateTicks(minAltitude, maxAltitude, yStepSize).map(
    (tick) => parseFloat(tick.toFixed(1))
  ); // Format to 1 decimal place

  // Create a path for the line graph
  const path = Skia.Path.Make();
  if (points.length > 0) {
    path.moveTo(points[0].x, points[0].y);
    points.forEach((point) => {
      // Handle case where all x-axis values are the same
      if (minX === maxX) {
        console.warn("All x-axis values are the same. Adjusting range...");
        minX -= 1; // Add a small range to avoid identical x values
        maxX += 1;
      }
      path.lineTo(point.x, point.y);
    });
  }

  return (
    <>
      <Text style={styles.title}>Inversion Graph</Text>
      <View style={styles.container}>
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
  container: {
    flex: 1,
    // justifyContent: "center",
    marginTop: 100,
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
});

export default LineGraph;
