import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

interface LogoProp {
  style: object;
}
const Logo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/fxLogo.png")}
        style={[styles.logo]}
      />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
