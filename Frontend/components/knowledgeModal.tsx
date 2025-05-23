import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

interface KnowledgeModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export default function KnowledgeModal({
  modalVisible,
  setModalVisible,
}: KnowledgeModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Knowledge Center</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Inversion Strength */}
            <View style={styles.infoGroup}>
              <Text style={styles.label}>🌡️ Inversion Strength</Text>
              <Text style={styles.unit}>Unit: °C or °C/100 meters</Text>
              <Text style={styles.value}>
                The total temperature increase (or temperature difference)
                between two vertical points during an inversion. It measures how
                much warmer the air is higher above the ground compared to near
                the surface.
              </Text>
            </View>

            {/* Inversion Intensity */}
            <View style={styles.infoGroup}>
              <Text style={styles.label}>🔥 Inversion Intensity</Text>
              <Text style={styles.unit}>Unit: °C</Text>
              <Text style={styles.value}>
                The magnitude of temperature difference at a given time.
                Stronger intensity means a larger temperature gap between ground
                level and higher elevations.
              </Text>
            </View>

            {/* Inversion Rate */}
            <View style={styles.infoGroup}>
              <Text style={styles.label}>📏 Inversion Rate</Text>
              <Text style={styles.unit}>
                Unit: °C per 10 meters or °C/meter
              </Text>
              <Text style={styles.value}>
                How quickly temperature increases with height during an
                inversion. It shows the steepness of the temperature gradient; a
                higher rate indicates a sharper temperature increase per unit of
                height.
              </Text>
            </View>
          </ScrollView>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%", // Prevent overflow
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
    color: "#A20025", // WSU Crimson
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
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  unit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22, // Improve readability for multi-line text
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
});
