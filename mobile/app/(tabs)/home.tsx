import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const colors = {
  background: "#0D1B2A",
  card: "#EAEAEA",
  accent: "#415A77",
  textPrimary: "#1B263B",
  buttonBg: "#415A77",
  buttonText: "#EAEAEA",
  divider: "#2C3E50",
};

export default function HomeScreen() {
  const router = useRouter();

  const quickStats = [
    { id: "1", label: "Students", value: "24", icon: "people-outline" },
    { id: "2", label: "Attendance", value: "93%", icon: "calendar-outline" },
    { id: "3", label: "Avg Grade", value: "88.5", icon: "bar-chart-outline" },
  ];

  const shortcuts: {
    id: string;
    title: string;
    icon: string;
    route:
      | "/(tabs)/students"
      | "/(tabs)/attendance"
      | "/(tabs)/grades"
      | "/(tabs)/reports";
  }[] = [
    {
      id: "1",
      title: "Manage Students",
      icon: "school-outline",
      route: "/(tabs)/students",
    },
    {
      id: "2",
      title: "Attendance",
      icon: "checkmark-done-outline",
      route: "/(tabs)/attendance",
    },
    {
      id: "3",
      title: "Grades",
      icon: "clipboard-outline",
      route: "/(tabs)/grades",
    },
    {
      id: "4",
      title: "Reports",
      icon: "analytics-outline",
      route: "/(tabs)/reports",
    },
  ];

  const recentUpdates = [
    {
      id: "1",
      title: "Attendance marked for October 10",
      time: "2h ago",
    },
    {
      id: "2",
      title: "Grades updated for midterm exams",
      time: "Yesterday",
    },
    {
      id: "3",
      title: "New student added: Sarah Kim",
      time: "2 days ago",
    },
  ];

  const renderUpdate = ({
    item,
  }: {
    item: { id: string; title: string; time: string };
  }) => (
    <View style={styles.updateCard}>
      <Text style={styles.updateTitle}>{item.title}</Text>
      <Text style={styles.updateTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Welcome back, Prof. Emily 👋</Text>
      <View style={styles.divider} />

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        {quickStats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={26} color={colors.accent} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Shortcuts */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.shortcutContainer}>
        {shortcuts.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.shortcutButton}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon as any} size={24} color={colors.accent} />
            <Text style={styles.shortcutText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Updates */}
      <Text style={styles.sectionTitle}>Recent Updates</Text>
      <FlatList
        data={recentUpdates}
        keyExtractor={(item) => item.id}
        renderItem={renderUpdate}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 13,
    color: colors.accent,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.card,
    marginBottom: 10,
  },
  shortcutContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  shortcutButton: {
    backgroundColor: colors.card,
    width: "48%",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  shortcutText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
  updateCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  updateTitle: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  updateTime: {
    fontSize: 12,
    color: colors.accent,
    marginTop: 4,
  },
});
