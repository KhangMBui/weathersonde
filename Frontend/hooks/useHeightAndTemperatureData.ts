import { useEffect, useState } from "react";
import axios from "axios";

interface DataPoint {
  average_temperature: number;
  average_humidity: number;
  altitude: number;
}

const useHeightAndTemperatureData = (binSize = 2) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.246:8000/records/height_and_temperature?bin_size=${binSize}`
        );

        // Map the data to extract altitude and average_temperature
        const parsedData = response.data.map((item: any) => {
          const altitude = parseFloat(item.altitude_bin.split("-")[0]); // Extract lower bound of altitude
          return {
            average_temperature: item.average_temperature,
            average_humidity: item.average_humidity,
            altitude,
          };
        });
        console.log("parsed Data:", parsedData);
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching height and temperature data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [binSize]);

  return { data, loading };
};

export default useHeightAndTemperatureData;
