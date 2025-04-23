import { Image, StyleSheet, View, Text } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.appTitle}>WSU WeatherSonde</Text>
      <View style={styles.logoContainer}>
        <Image
          source={require("./../assets/images/combined-logo.png")}
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
    //backgroundColor: "#A60F2D",
    backgroundColor: "#ffffff",
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
    marginTop: -25,
    fontSize: 20,
    color: "#A60F2D",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});
