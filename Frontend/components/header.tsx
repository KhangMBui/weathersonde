import { Image, StyleSheet, View, Text, Platform } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.contentContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#A60F2D",
    width: "100%",
    height: 108,
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 10,
  },
  combinedLogo: {
    width: "38%",
    height: "500%",
    marginTop: 9,
    borderRadius: 5,
  },
  appTitle: {
    // fontSize: 20,
    // // color: "#A60F2D",
    // color: "#ffffff",
    // fontWeight: "700",
    // textTransform: "uppercase",
    // letterSpacing: 1,
    fontSize: 24,
    marginTop: 16,
    color: "#ffffff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 4,
    fontFamily: Platform.select({ ios: "Helvetica", android: "sans-serif" }),
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "center",
    width: "100%",
    marginTop: -6,
  },
  contentContainer: {
    marginTop: -50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
});
