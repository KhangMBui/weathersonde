import { Image, StyleSheet, View, Text } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("./../assets/images/WSULogo.png")}
        style={styles.headerLogo}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#A20025",
    width: "100%",
    height: 110,
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
  },
  headerLogo: {
    width: "20%",
    height: "40%",
    marginTop: 40,
  },
});
