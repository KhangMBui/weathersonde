import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SensorModal from "@/components/SensorModal";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location"; // Importing expo-location for getting current location
import { Stack } from "expo-router";
import axios from "axios";

export default function HomeScreen() {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location denied.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    };

    getLocation();
  }, []);

  // If location is not fetched yet, show a loading message
  // if (!location) {
  //   return (
  //     <View style={styles.mainContainer}>
  //       <Header />
  //       <Text>Loading...</Text>
  //       <Footer />
  //     </View>
  //   );
  // }
  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <MapView
        style={styles.map} // Apply styles to ensure it fills the space
        provider={PROVIDER_GOOGLE} // Use Google Maps provider
        initialRegion={{
          latitude: location ? location.latitude : 37.7749, // Default to San Francisco (change as needed)
          longitude: location ? location.longitude : -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true} // Show the user's location on the map
        followsUserLocation={true} // Follow the user's location on the map
      />
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
    backgroundColor: "#EAEAEA",
    flex: 1,
  },
  map: {
    flex: 1, // Ensures map takes up available space
    width: "100%", // Full width
  },
});
