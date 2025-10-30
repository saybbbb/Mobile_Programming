import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
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
  gradeHigh: "#16A34A",
  gradeLow: "#B91C1C",
  divider: "#D6DEE6",
  tableHeader: "#F5F7FA",
};

interface StudentReport {
  id: string;
  name: string;
  grade: number;
  attendance: number;
}

export default function ReportsScreen() {
  const { gradeid, course, section } = useLocalSearchParams();
  const router = useRouter();

  const [reports] = useState<StudentReport[]>([
    { id: "1", name: "Student 1", grade: 94, attendance: 96 },
    { id: "2", name: "Student 2", grade: 88, attendance: 92 },
    { id: "3", name: "Student 3", grade: 91, attendance: 98 },
    { id: "4", name: "Student 4", grade: 76, attendance: 85 },
  ]);

  const summary = useMemo(() => {
    const avgGrade = (
      reports.reduce((sum, s) => sum + s.grade, 0) / reports.length
    ).toFixed(1);
    const avgAttendance = (
      reports.reduce((sum, s) => sum + s.attendance, 0) / reports.length
    ).toFixed(1);
    return {
      avgGrade,
      avgAttendance,
      totalStudents: reports.length,
    };
  }, [reports]);

  const renderRow = ({ item }: { item: StudentReport }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { flex: 3, textAlign: "left" }]}>
        {item.name}
      </Text>
      <Text
        style={[
          styles.tableCell,
          {
            flex: 1.2,
            color:
              item.grade >= 90
                ? colors.gradeHigh
                : item.grade < 80
                ? colors.gradeLow
                : colors.accent,
          },
        ]}
      >
        {item.grade}
      </Text>
      <Text
        style={[
          styles.tableCell,
          {
            flex: 1.5,
            color:
              item.attendance >= 90
                ? colors.gradeHigh
                : item.attendance < 80
                ? colors.gradeLow
                : colors.accent,
          },
        ]}
      >
        {item.attendance}%
      </Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔙 Back Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/reports")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.accent} />
        </TouchableOpacity>

        {/* 🧾 Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports & Analytics</Text>
          <Text style={styles.courseTitle}>
            {course || "Mobile Programming - USTP"}
          </Text>
          <Text style={styles.sectionText}>{section || "IT3R11 - BSIT"}</Text>
        </View>

        {/* 📊 Summary Section */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons name="people-outline" size={24} color={colors.accent} />
            <Text style={styles.summaryLabel}>Total Students</Text>
            <Text style={styles.summaryValue}>{summary.totalStudents}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons
              name="bar-chart-outline"
              size={24}
              color={colors.accent}
            />
            <Text style={styles.summaryLabel}>Avg Grade</Text>
            <Text style={styles.summaryValue}>{summary.avgGrade}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="calendar-outline" size={24} color={colors.accent} />
            <Text style={styles.summaryLabel}>Attendance</Text>
            <Text style={styles.summaryValue}>{summary.avgAttendance}%</Text>
          </View>
        </View>

        {/* 👩‍🎓 Student Performance Table */}
        <Text style={styles.sectionTitle}>Student Performance</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 3, textAlign: "left" }]}>
            Student
          </Text>
          <Text style={[styles.headerCell, { flex: 1.2 }]}>Grade</Text>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>Attendance</Text>
        </View>

        {/* Table Rows */}
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderRow}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* ⬇️ Floating Export Button */}
      <TouchableOpacity style={styles.exportButton}>
        <Ionicons name="download-outline" size={20} color={colors.buttonText} />
        <Text style={styles.exportText}>Export Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
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
    backgroundColor: colors.darkHeader,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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

  /** SUMMARY **/
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    color: colors.accent,
    fontSize: 13,
    marginTop: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 4,
  },

  /** TABLE **/
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.tableHeader,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderColor: colors.divider,
  },
  headerCell: {
    fontWeight: "700",
    color: colors.textPrimary,
    fontSize: 14,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderColor: colors.divider,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tableCell: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
  },

  /** EXPORT BUTTON **/
  exportButton: {
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
  exportText: {
    color: colors.buttonText,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
});
