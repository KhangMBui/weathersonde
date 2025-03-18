import Footer from "@/components/footer";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import OptionHeader from "@/components/optionHeader";

export default function Settings() {
  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <OptionHeader />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});
