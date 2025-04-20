import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
// import SensorModal from "@/components/SensorModal";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
} from "react-native-maps";
import { Stack } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const mapRef = useRef<MapView | null>(null); // Map reference

  const [droneLocation, setDroneLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [generalInfo, setGeneralInfo] = useState({
    date: "",
    time: "",
    altitude: "",
    internalTemp: "",
    internalRH: "",
    internalPres: "",
    airTemp: "",
    weatherRH: "",
  });

  const [mapRegion, setMapRegion] = useState({
    latitude: droneLocation.latitude,
    longitude: droneLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getDroneInfo();
  }, []);

  const getDroneInfo = async () => {
    try {
      const response = await axios.get("http://172.29.208.1:8000/ws_data");
      const {
        Date: date,
        Time: time,
        latitude: latitude,
        longitude: longitude,
        altitude: altitude,
        Internal_Temp: internalTemp,
        Internal_RH: internalRH,
        Internal_Pres: internalPres,
        Weather: { Air_Temperature: airTemp, RH: weatherRH },
      } = response.data;
      // console.log("Drone location fetched: ", latitude, longitude);
      setDroneLocation({ latitude, longitude });
      setGeneralInfo({
        date,
        time,
        altitude,
        internalTemp,
        internalRH,
        internalPres,
        airTemp,
        weatherRH,
      });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error("Error fetching drone location:", error);
    }
  };

  const centerMapOnDrone = () => {
    console.log("Centering map on drone location...");
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: droneLocation.latitude,
          longitude: droneLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500 // duration in ms
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={
          droneLocation.latitude !== 0 && droneLocation.longitude !== 0
            ? mapRegion
            : undefined
        }
        showsUserLocation={false} // Don't show device GPS location
        followsUserLocation={false} // Don't follow device
      >
        {/* Custom marker to act like "user location" */}
        <Marker coordinate={droneLocation}>
          {/* Alternate styles depending on likings: blue dot & drone icon */}
          {/* <View style={styles.fakeUserDotOuter}>
            <View style={styles.fakeUserDotInner} />
          </View> */}
          <Image
            source={require("./../assets/images/droneicon.png")}
            style={styles.droneLogo}
          ></Image>
        </Marker>
      </MapView>

      {/* Button to center map on drone */}
      <TouchableOpacity style={styles.button} onPress={centerMapOnDrone}>
        {/* <Text style={styles.buttonText}>Current Location (Drone)</Text> */}
        <View style={styles.innerCircle}>
          <Ionicons name="location-outline" size={28} color="white" />
        </View>
      </TouchableOpacity>

      <View style={styles.generalInfo}>
        <Text style={styles.infoText}>
          Date: {generalInfo.date}, Time: {generalInfo.time}
          {"\n"}
          Temp: {parseFloat(generalInfo.airTemp).toFixed(2)}°C, Humidity:{" "}
          {parseFloat(generalInfo.weatherRH).toFixed(2)}%, Alt:{" "}
          {parseFloat(generalInfo.altitude).toFixed(1)}m
        </Text>
      </View>

      {/* <SensorModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      /> */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  /* Map */
  mainContainer: {
    backgroundColor: "#EAEAEA",
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
  },

  /* Relocate button */
  button: {
    position: "absolute",
    top: 110,
    // left: "110%",
    right: "-25%",
    transform: [{ translateX: -100 }],
    padding: 10,
    borderRadius: 5,
  },
  recenterButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  innerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A20025", // iOS-style blue
    justifyContent: "center",
    alignItems: "center",
  },

  // buttonText: {
  //   color: "white",
  //   fontSize: 16,
  // },
  // Fake user (blue dot)

  /* Location logo */
  droneLogo: {
    height: 40,
    width: 40,
  },
  // fakeUserDotOuter: {
  //   height: 24,
  //   width: 24,
  //   borderRadius: 12,
  //   backgroundColor: "rgba(0,122,255,0.2)",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // fakeUserDotInner: {
  //   height: 12,
  //   width: 12,
  //   borderRadius: 6,
  //   backgroundColor: "#007AFF", // iOS-style blue dot
  // },

  /* General Information Board */
  generalInfo: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "rgba(162, 0, 37, 0.8)", // dark red transparent
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  infoText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
