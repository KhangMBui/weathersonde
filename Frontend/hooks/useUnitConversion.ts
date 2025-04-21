import { useSettings } from "@/hooks/SettingsContext";

export const useUnitConversion = () => {
  const { temperatureUnit, distanceUnit } = useSettings(); // Access global units

  const convertTemperature = (temp: string): string => {
    const numericValue = parseFloat(temp); // Extract numeric value
    if (temperatureUnit === "°F" && temp.includes("°C")) {
      // Convert °C to °F
      const converted = (numericValue * 9) / 5 + 32;
      return `${converted.toFixed(1)} °F`;
    } else if (temperatureUnit === "°C" && temp.includes("°F")) {
      // Convert °F to °C
      const converted = ((numericValue - 32) * 5) / 9;
      return `${converted.toFixed(1)} °C`;
    }
    return temp; // No conversion needed
  };

  const convertDistance = (distance: string): string => {
    const numericValue = parseFloat(distance); // Extract numeric value
    if (distanceUnit === "ft" && distance.includes("m")) {
      // Convert meters to feet
      const converted = numericValue * 3.28084;
      return `${converted.toFixed(1)} ft`;
    } else if (distanceUnit === "m" && distance.includes("ft")) {
      // Convert feet to meters
      const converted = numericValue / 3.28084;
      return `${converted.toFixed(1)} m`;
    }
    return distance; // No conversion needed
  };

  return { convertTemperature, convertDistance };
};
