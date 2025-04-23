import { Image, StyleSheet, View, Text } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.appTitle}>WSU WeatherSonde</Text>
      <View style={styles.logoContainer}>
        <Image
          source={require("./../assets/images/final-logo-2.png")}
          style={styles.combinedLogo}
        ></Image>
        {/* <Image
          source={require("./../assets/images/AGAID-logo.png")}
          style={styles.agaidLogo}
        ></Image> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#A60F2D",
    width: "100%",
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  combinedLogo: {
    width: "38%",
    height: "500%",
    marginTop: 8,
    borderRadius: 5,
  },
  appTitle: {
    // fontSize: 20,
    // // color: "#A60F2D",
    // color: "#ffffff",
    // fontWeight: "700",
    // textTransform: "uppercase",
    // letterSpacing: 1,
    fontSize: 24, // Slightly larger font for better emphasis
    color: "#ffffff", // Keep white for contrast against the crimson background
    fontWeight: "bold", // Use "bold" for a stronger emphasis
    textTransform: "uppercase", // Keep uppercase for a formal style
    letterSpacing: 2, // Increase letter spacing for a modern look
    textAlign: "center", // Center-align the text
    textShadowColor: "rgba(0, 0, 0, 0.3)", // Add a subtle shadow for better readability
    textShadowOffset: { width: 1, height: 1 },
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});
