import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SensorModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SensorModal: React.FC<SensorModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      backdropOpacity={0.5}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.swipeIndicator} />
        <View style={styles.buttonsContainer}>
          <SensorButton icon="water" label="Humidity" />
          <SensorButton icon="gauge" label="Pressure" />
          <SensorButton icon="weather-windy" label="Gas" />
          <SensorButton icon="thermometer" label="Temperature" />
        </View>
      </View>
    </Modal>
  );
};

interface SensorButtonProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}

const SensorButton: React.FC<SensorButtonProps> = ({ icon, label }) => (
  <TouchableOpacity style={styles.sensorButton}>
    <MaterialCommunityIcons name={icon} size={24} color="black" />
    <Text style={styles.sensorLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#EAF0F6",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  swipeIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  sensorButton: {
    width: 120,
    height: 80,
    backgroundColor: "#DCE7F2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#B0C4DE",
  },
  sensorLabel: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default SensorModal;
