import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

interface AuthorsModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function AuthorsModal({
  modalVisible,
  setModalVisible,
}: AuthorsModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Credits & Authors</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Keshawa Dadallage</Text>
              <Text style={styles.role}>Hardware Engineer & Mentor</Text>
              <Text style={styles.value}>
                Built the WeatherSonde device. Provided technical guidance,
                project mentorship, and domain expertise throughout the
                development process.
              </Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Khang Bui</Text>
              <Text style={styles.role}>
                Full Stack Engineer (Frontend Lead)
              </Text>
              <Text style={styles.value}>
                Designed and developed the WeatherSonde app and APIs, integrated
                the frontend with the backend, and set up the database.
              </Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Rishabh Goyal</Text>
              <Text style={styles.role}>Backend Engineer</Text>
              <Text style={styles.value}>
                Developed the server and API endpoints, handling data from the
                WeatherSonde sensor.
              </Text>
            </View>
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Special Thanks</Text>
              <Text style={styles.value}>
                This project was made possible by the support of our mentors,
                peers, and the AgWeatherNet community.
              </Text>
            </View>
          </ScrollView>
          {/* <Image
            source={require("./../assets/images/final-logo-2.png")}
            style={styles.combinedLogo}
          ></Image> */}
          <View style={styles.logoContainer}>
            <Image
              source={require("./../assets/images/AGAID-logo.png")}
              style={styles.agaidLogo}
            ></Image>
            <Image
              source={require("./../assets/images/AgWeather-logo.png")}
              style={styles.agwnLogo}
            ></Image>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#A20025",
    marginBottom: 15,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
  },
  infoGroup: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    // borderRadius: 8,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // padding: 10,
    // elevation: 2,
    // width: "100%",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  role: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: "#A20025",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  agaidLogo: {
    width: 130,
    height: 65,
    resizeMode: "contain",
    marginTop: 10,
  },
  agwnLogo: {
    width: 120,
    height: 70,
    resizeMode: "contain",
    marginTop: 10,
  },
});
