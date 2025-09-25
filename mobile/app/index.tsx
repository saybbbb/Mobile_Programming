import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subText}>Log in to your account</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#6B4C3B" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9A7E6F"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6B4C3B" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9A7E6F"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6B4C3B"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        {/* Sign Up link */}
        <Text style={styles.subText}>
          Don’t have an account? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B2F2F", // dark academia brown
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 24,
  },
  logo: {
    marginTop: 80,
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F5F5DC", // beige card
    width: "100%",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C2C2C",
    marginBottom: 6,
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#5C4033",
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    color: "#8B5E3C", // vintage copper accent
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF9F6", // very light parchment
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 50,
    borderWidth: 1,
    borderColor: "#D2B48C", // muted tan border
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#2C2C2C",
  },
  forgotText: {
    alignSelf: "flex-end",
    color: "#8B5E3C",
    marginBottom: 20,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#8B5E3C", // coppery brown
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#F5F5DC", // beige text on button
    fontSize: 16,
    fontWeight: "600",
  },
});
