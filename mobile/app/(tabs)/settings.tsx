import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../../services/api";

const colors = {
  background: "#EAEAEA",
  card: "#FFFFFF",
  accent: "#415A77",
  textPrimary: "#1B263B",
  buttonBg: "#415A77",
  buttonText: "#EAEAEA",
  divider: "#D6DEE6",
};

type StoredUser = {
  fullName: string;
  email: string;
  profileImage?: string;
};

export default function SettingsScreen() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [user, setUser] = useState<StoredUser | null>(null);

  /* CHANGE PASSWORD */
  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* SHOW / HIDE PASSWORD */
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* LOAD USER */
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  /* LOGOUT */
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(["token", "user"]);
          delete API.defaults.headers.common["Authorization"];
          router.replace("/login");
        },
      },
    ]);
  };

  /* CHANGE PASSWORD */
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "All fields are required");
    }

    if (newPassword.length < 6) {
      return Alert.alert(
        "Error",
        "New password must be at least 6 characters"
      );
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      Alert.alert("Success", "Password updated successfully");
      setPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to change password"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* BACK */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Ionicons name="arrow-back" size={24} color={colors.accent} />
      </TouchableOpacity>

      {/* HEADER */}
      <Text style={styles.header}>Settings</Text>
      <View style={styles.divider} />

      {/* PROFILE */}
      <View style={styles.profileCard}>
        <Image
          source={
            user?.profileImage
              ? { uri: user.profileImage }
              : require("../../assets/images/profile-placeholder.jpg")
          }
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.profileName}>{user?.fullName}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* ACCOUNT */}
      <Text style={styles.sectionTitle}>Account</Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => setPasswordModal(true)}
      >
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

      {/* PREFERENCES */}
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

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* CHANGE PASSWORD MODAL */}
      <Modal visible={passwordModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Change Password</Text>

            {/* CURRENT */}
            <View style={styles.passwordRow}>
              <TextInput
                placeholder="Current Password"
                secureTextEntry={!showCurrent}
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Ionicons
                  name={showCurrent ? "eye-off" : "eye"}
                  size={22}
                  color={colors.accent}
                />
              </TouchableOpacity>
            </View>

            {/* NEW */}
            <View style={styles.passwordRow}>
              <TextInput
                placeholder="New Password"
                secureTextEntry={!showNew}
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Ionicons
                  name={showNew ? "eye-off" : "eye"}
                  size={22}
                  color={colors.accent}
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRM */}
            <View style={styles.passwordRow}>
              <TextInput
                placeholder="Confirm New Password"
                secureTextEntry={!showConfirm}
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <Ionicons
                  name={showConfirm ? "eye-off" : "eye"}
                  size={22}
                  color={colors.accent}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#aaa" }]}
                onPress={() => setPasswordModal(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.accent }]}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 16,
  },
  backBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 8,
    borderRadius: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.textPrimary,
    marginBottom: 16,
    opacity: 0.7,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  profileName: { fontSize: 18, fontWeight: "700" },
  profileEmail: { fontSize: 14, color: colors.accent },

  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  option: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionText: { flex: 1, marginLeft: 10 },

  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#B91C1C",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 30,
  },
  logoutText: { color: "#fff", fontWeight: "600", marginLeft: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "600" },
});
