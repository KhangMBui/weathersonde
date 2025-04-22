import NetInfo from "@react-native-community/netinfo";
import { useState, useEffect } from "react";

export const useLocalIPv4 = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        // Check the network state
        const state = await NetInfo.fetch();
        console.log("Network state:", state);

        if (state.type === "wifi" && state.details?.ipAddress) {
          // If connected to Wi-Fi, get the local IP address
          console.log("Fetched IP address:", state.details.ipAddress);
          setIpAddress(state.details.ipAddress);
        } else {
          throw new Error(
            "Not connected to Wi-Fi or unable to fetch IP address."
          );
        }
      } catch (err: any) {
        console.error("Error fetching IP address:", err.message);
        setError(err.message || "Error fetching IP address");
      }
    };

    fetchIP();
  }, []);

  return { ipAddress, error };
};
