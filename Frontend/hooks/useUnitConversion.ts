import { useSettings } from "@/hooks/SettingsContext";

export const useUnitConversion = () => {
  const { temperatureUnit, distanceUnit } = useSettings(); // Access global units

  const convertTemperature = (temp: number): number => {
    // If the global unit is °C, do nothing
    if (temperatureUnit === "°C") {
      return temp;
    }
    // If the global unit is °F, convert °C to °F
    if (temperatureUnit === "°F") {
      return (temp * 9) / 5 + 32;
    }
    return temp; // Default fallback
  };

  const convertDistance = (distance: number): number => {
    // If the global unit is meters, do nothing
    if (distanceUnit === "m") {
      return distance;
    }
    // If the global unit is feet, convert meters to feet
    if (distanceUnit === "ft") {
      return parseFloat((distance * 3.28084).toFixed(2));
    }
    return distance; // Default fallback
  };

  return { convertTemperature, convertDistance };
};
