import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const colors = {
  background: "#EAEAEA",
  card: "#FFFFFF",
  accent: "#415A77",
  textPrimary: "#1B263B",
  buttonBg: "#415A77",
  buttonText: "#EAEAEA",
  divider: "#D6DEE6",
};

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        onPress: () => {
          // Navigate to login screen
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Ionicons name="arrow-back" size={24} color={colors.accent} />
      </TouchableOpacity>

      {/* 🧾 Header */}
      <Text style={styles.header}>Settings</Text>
      <View style={styles.divider} />

      {/* 👩‍🏫 Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={require("../../assets/images/profile-placeholder.jpg")}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.profileName}>User-01</Text>
          <Text style={styles.profileEmail}>test@email.com</Text>
        </View>
      </View>

      {/* ⚙️ Account Section */}
      <Text style={styles.sectionTitle}>Account</Text>
      <TouchableOpacity style={styles.option}>
        <Ionicons name="key-outline" size={22} color={colors.accent} />
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color={colors.accent}
        />
        <Text style={styles.optionText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          thumbColor={notificationsEnabled ? colors.accent : "#ccc"}
        />
      </TouchableOpacity>

      {/* 🌙 Preferences Section */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <TouchableOpacity style={styles.option}>
        <Ionicons name="moon-outline" size={22} color={colors.accent} />
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? colors.accent : "#ccc"}
        />
      </TouchableOpacity>

      {/* 🚪 Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 16,
  },

  /** HEADER **/
  backBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 8,
    borderRadius: 12,
    // marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.textPrimary,
    marginBottom: 16,
    opacity: 0.7,
  },

  /** PROFILE **/
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.accent,
    marginTop: 4,
  },

  /** SECTIONS **/
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  option: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },

  /** LOGOUT **/
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B91C1C",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
});
