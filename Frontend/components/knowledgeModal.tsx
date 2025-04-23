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
            <Text style={styles.infoLabel}>🌪️ Inversion Information</Text>
            <View>
              <View style={styles.infoGroup}>
                <Text style={styles.label}>🔥 Intensity:</Text>
                <Text style={styles.value}>
                  Explanation about intensity. This can be one or multiple lines
                  of text.
                </Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.label}>📏 Height:</Text>
                <Text style={styles.value}>
                  Explanation about height. This can be one or multiple lines of
                  text.
                </Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.label}>📉 Rate:</Text>
                <Text style={styles.value}>
                  Explanation about rate. This can be one or multiple lines of
                  text.
                </Text>
              </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    minHeight: "60%",
    maxHeight: "75%",
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
    color: "#A20025", // WSU Crimson for a bold look
    marginBottom: 15,
    textAlign: "center",
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
  },
  infoGroup: {
    flexDirection: "column", // Stack label and value vertically
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
    marginBottom: 5,
    alignSelf: "center",
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
