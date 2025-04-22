import { useSettings } from "@/hooks/SettingsContext";

export const useUnitConversion = () => {
  const { temperatureUnit, distanceUnit } = useSettings(); // Access global units

  const parseNumericValue = (value: string | number): number => {
    if (typeof value === "number") return value; // Already a number
    if (typeof value === "string") {
      const numericValue = parseFloat(value.replace(/[^\d.-]/g, "")); // Remove non-numeric characters
      if (!isNaN(numericValue)) return numericValue;
    }
    console.error("Invalid input:", value);
    return NaN; // Return NaN for invalid input
  };

  const convertTemperature = (temp: number): number => {
    const numericTemp = parseNumericValue(temp); // Ensure the input is a number
    // If the global unit is °C, do nothing
    if (temperatureUnit === "°C") {
      return numericTemp;
    }
    // If the global unit is °F, convert °C to °F
    if (temperatureUnit === "°F") {
      return (numericTemp * 9) / 5 + 32;
    }
    return numericTemp; // Default fallback
  };

  const convertDistance = (distance: number): number => {
    const numericDistance = parseNumericValue(distance); // Ensure the input is a number
    // If the global unit is meters, do nothing
    if (distanceUnit === "m") {
      return numericDistance;
    }
    // If the global unit is feet, convert meters to feet
    if (distanceUnit === "ft") {
      return parseFloat((numericDistance * 3.28084).toFixed(2));
    }
    return numericDistance; // Default fallback
  };

  return { convertTemperature, convertDistance };
};
