import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const colors = {
  background: "#0D1B2A",
  card: "#EAEAEA",
  accent: "#415A77",
  textPrimary: "#1B263B",
  buttonBg: "#415A77",
  buttonText: "#EAEAEA",
  absent: "#B91C1C",
  present: "#16A34A",
};

interface AttendanceRecord {
  id: string;
  name: string;
  status: "Present" | "Absent";
}

export default function AttendanceScreen() {
  const [records, setRecords] = useState<AttendanceRecord[]>([
    { id: "1", name: "Alice Johnson", status: "Present" },
    { id: "2", name: "Mark Lee", status: "Absent" },
    { id: "3", name: "Sophia Chen", status: "Present" },
    { id: "4", name: "David Cruz", status: "Absent" },
  ]);

  // toggle attendance (UI only)
  const toggleStatus = (id: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Present" ? "Absent" : "Present" }
          : r
      )
    );
  };

  const markAllPresent = () => {
    setRecords((prev) => prev.map((r) => ({ ...r, status: "Present" })));
  };

  const renderItem = ({ item }: { item: AttendanceRecord }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text
          style={[
            styles.statusText,
            {
              color: item.status === "Present" ? colors.present : colors.absent,
            },
          ]}
        >
          {item.status}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.statusButton,
          {
            backgroundColor:
              item.status === "Present" ? colors.present : colors.absent,
          },
        ]}
        onPress={() => toggleStatus(item.id)}
      >
        <Text style={styles.buttonLabel}>
          {item.status === "Present" ? "Mark Absent" : "Mark Present"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Attendance Tracking</Text>
      <View style={styles.divider} />

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.markAllButton} onPress={markAllPresent}>
        <Ionicons name="checkmark-done" size={22} color={colors.buttonText} />
        <Text style={styles.markAllText}>Mark All Present</Text>
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
    backgroundColor: "#2C3E50",
    marginBottom: 16,
    opacity: 0.4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  statusText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonLabel: {
    color: colors.buttonText,
    fontWeight: "600",
    fontSize: 13,
  },
  markAllButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttonBg,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  markAllText: {
    color: colors.buttonText,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
});
