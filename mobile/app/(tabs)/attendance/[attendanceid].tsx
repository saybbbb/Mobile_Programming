import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const colors = {
  background: "#EAEAEA",
  card: "#FFFFFF",
  darkHeader: "#0D1B2A",
  accent: "#415A77",
  textPrimary: "#1B263B",
  buttonBg: "#415A77",
  buttonText: "#EAEAEA",
  tableHeader: "#F5F7FA",
  absent: "#B91C1C",
  present: "#16A34A",
  divider: "#D6DEE6",
};

interface AttendanceRecord {
  id: string;
  name: string;
  status: "Present" | "Absent";
}

export default function AttendanceScreen() {
  const { attendanceid, course, section } = useLocalSearchParams();
  const router = useRouter();

  const [records, setRecords] = useState<AttendanceRecord[]>([
    { id: "1", name: "Alice Johnson", status: "Present" },
    { id: "2", name: "Mark Lee", status: "Absent" },
    { id: "3", name: "Sophia Chen", status: "Present" },
    { id: "4", name: "David Cruz", status: "Absent" },
  ]);

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

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* 🔙 Back Button */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/attendance")}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={24} color={colors.accent} />
      </TouchableOpacity>

      {/* 🧾 HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Tracking</Text>
        <Text style={styles.courseTitle}>
          {course || "Mobile Programming - USTP"}
        </Text>
        <Text style={styles.sectionText}>{section || "IT3R11 - BSIT"}</Text>
      </View>

      {/* 📋 TABLE CONTENT */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 4, textAlign: "left" }]}>
            Student
          </Text>
          <Text style={[styles.headerText, { flex: 2 }]}>Status</Text>
          <Text style={[styles.headerText, { flex: 3 }]}>Action</Text>
        </View>

        {/* Table Rows */}
        {records.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.cellText, { flex: 4, textAlign: "left" }]}>
              {item.name}
            </Text>

            <Text
              style={[
                styles.cellText,
                {
                  flex: 2,
                  textAlign: "center",
                  color:
                    item.status === "Present" ? colors.present : colors.absent,
                },
              ]}
            >
              {item.status}
            </Text>

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
        ))}
      </ScrollView>

      {/* ✅ Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={markAllPresent}>
        <Ionicons name="checkmark-done" size={28} color={colors.buttonText} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 16,
  },

  /** HEADER **/
  backBtn: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 8,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  header: {
    backgroundColor: colors.darkHeader,
    padding: 20,
    borderRadius: 16,
    margin: 16,
  },
  headerTitle: {
    color: colors.card,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  courseTitle: {
    color: colors.card,
    fontSize: 18,
    fontWeight: "600",
  },
  sectionText: {
    color: colors.card,
    fontSize: 14,
    marginTop: 4,
  },

  /** TABLE **/
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.tableHeader,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderColor: colors.divider,
  },
  headerText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  cellText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },

  /** BUTTONS **/
  statusButton: {
    flex: 3,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonLabel: {
    color: colors.buttonText,
    fontSize: 13,
    fontWeight: "600",
  },

  /** FLOATING BUTTON **/
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
