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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const colors = {
  background: "#0D1B2A",
  card: "#EAEAEA",
  accent: "#415A77",
  textPrimary: "#1B263B",
  buttonBg: "#415A77",
  buttonText: "#EAEAEA",
  divider: "#2C3E50",
};

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", onPress: () => console.log("Logged out") },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.divider} />

      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={require("../../assets/images/profile-placeholder.jpg")}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.profileName}>Prof. Emily Carter</Text>
          <Text style={styles.profileEmail}>emily.carter@college.edu</Text>
        </View>
      </View>

      {/* Account Section */}
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

      {/* Preferences Section */}
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

      <TouchableOpacity style={styles.option}>
        <Ionicons name="language-outline" size={22} color={colors.accent} />
        <Text style={styles.optionText}>Language</Text>
        <Text style={styles.optionValue}>English</Text>
      </TouchableOpacity>

      {/* Logout Button */}
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
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.card,
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 16,
    opacity: 0.4,
  },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.card,
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
  optionValue: {
    fontSize: 14,
    color: colors.accent,
  },
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
