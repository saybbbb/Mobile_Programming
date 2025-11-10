import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const colors = {
  background: "#0D1B2A",
  card: "#EAEAEA",
  accent: "#415A77",
  textPrimary: "#1B263B",
  buttonBg: "#415A77",
  buttonText: "#EAEAEA",
  gradeHigh: "#16A34A",
  gradeLow: "#B91C1C",
  divider: "#2C3E50",
};

interface StudentReport {
  id: string;
  name: string;
  grade: number;
  attendance: number;
}

export default function ReportsScreen() {
  const [reports] = useState<StudentReport[]>([
    { id: "1", name: "Alice Johnson", grade: 94, attendance: 96 },
    { id: "2", name: "Mark Lee", grade: 88, attendance: 92 },
    { id: "3", name: "Sophia Chen", grade: 91, attendance: 98 },
    { id: "4", name: "David Cruz", grade: 76, attendance: 85 },
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

  const renderItem = ({ item }: { item: StudentReport }) => (
    <View style={styles.studentCard}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
      </View>

      <View style={styles.stats}>
        <Text
          style={[
            styles.grade,
            {
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
            styles.attendance,
            {
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Reports & Analytics</Text>
      <View style={styles.divider} />

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="people-outline" size={24} color={colors.accent} />
          <Text style={styles.summaryLabel}>Total Students</Text>
          <Text style={styles.summaryValue}>{summary.totalStudents}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons name="bar-chart-outline" size={24} color={colors.accent} />
          <Text style={styles.summaryLabel}>Avg Grade</Text>
          <Text style={styles.summaryValue}>{summary.avgGrade}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons name="calendar-outline" size={24} color={colors.accent} />
          <Text style={styles.summaryLabel}>Attendance</Text>
          <Text style={styles.summaryValue}>{summary.avgAttendance}%</Text>
        </View>
      </View>

      {/* Student List */}
      <Text style={styles.sectionTitle}>Student Performance</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Export Button (UI only) */}
      <TouchableOpacity style={styles.exportButton}>
        <Ionicons name="download-outline" size={20} color={colors.buttonText} />
        <Text style={styles.exportText}>Export Report</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.card,
    marginBottom: 10,
  },
  studentCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  grade: {
    fontSize: 15,
    fontWeight: "700",
  },
  attendance: {
    fontSize: 15,
    fontWeight: "700",
  },
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
  info: {
    flex: 1,
    justifyContent: "center",
  },
});
