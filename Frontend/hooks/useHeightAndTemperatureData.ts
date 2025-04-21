import { useEffect, useState } from "react";
import axios from "axios";

const useHeightAndTemperatureData = (binSize = 2) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://172.29.208.1:8000/records/height_and_temperature?bin_size=${binSize}`
        );
        setData(response.data);
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
