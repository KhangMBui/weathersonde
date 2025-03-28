import Footer from "@/components/footer";
import { View, StyleSheet, Text } from "react-native";
import { Stack } from "expo-router";
import OptionHeader from "@/components/optionHeader";
import SensorModal from "@/components/SensorModal";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Analytics() {
  // For testing purpose
  const [message, setMessage] = useState("Loading...");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://10.0.1.41:8000/test")
      .then((response) => {
        console.log(response.data);
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage("Failed to fetch data");
        console.error("Error: ", error);
      });
  });

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <OptionHeader />

      {/* Testing Purpose: */}
      <Text>{message}</Text>

      <SensorModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
      <Footer
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
        onHeatMapPress={() => setModalVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
