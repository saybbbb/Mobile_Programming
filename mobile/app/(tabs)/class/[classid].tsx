import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const colors = {
  background: "#0D1B2A",
  card: "#EAEAEA",
  accent: "#415A77",
  textPrimary: "#1B263B",
  tabActive: "#EAEAEA",
  tabInactive: "#7F8C99",
};

const tabs = ["Bulletin", "Task", "People"];

export default function ClassDetails() {
  const { classid, course, section, user } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Bulletin");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Bulletin":
        return <Text style={styles.tabContent}>[Bulletin Content]</Text>;
      case "Task":
        return <Text style={styles.tabContent}>[Task Content]</Text>;
      case "People":
        return <Text style={styles.tabContent}>[People Content]</Text>;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/class")}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={24} color={colors.accent} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.courseTitle}>{course}</Text>
        <Text style={styles.sectionText}>{section}</Text>
        <Text style={styles.userText}>{user}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            <View
              style={[styles.underline, activeTab !== tab && { opacity: 0 }]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.contentCard}>{renderTabContent()}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 12,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 16,
  },
  backBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  courseTitle: {
    color: colors.card,
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionText: { color: colors.card, fontSize: 14, marginTop: 4 },
  userText: { color: colors.card, fontSize: 13, marginTop: 6 },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tabButton: { alignItems: "center", paddingVertical: 10 },
  tabText: { color: colors.accent, fontWeight: "600" },
  tabTextActive: { color: colors.background, fontWeight: "700" },
  underline: {
    marginTop: 4,
    width: 64,
    height: 3,
    backgroundColor: colors.background,
    borderRadius: 2,
    alignSelf: "center",
  },
  contentCard: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 20,
    minHeight: 200,
  },
  tabContent: {
    color: colors.textPrimary,
    textAlign: "center",
    fontSize: 16,
  },
});
