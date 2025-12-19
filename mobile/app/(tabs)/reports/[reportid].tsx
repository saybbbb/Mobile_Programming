import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../../services/api";

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

type Student = {
  _id: string;
  name: string;
  grades?: {
    midterm?: number | null;
    final?: number | null;
  };
};

type AttendanceSummary = {
  _id: string;
  attendance: number;
};

type ReportRow = {
  id: string;
  name: string;
  grade: number;
  attendance: number;
};

export default function ReportDetails() {
  const { reportid } = useLocalSearchParams<{ reportid: string }>();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceSummary[]>([]);
  const [classInfo, setClassInfo] = useState<{
    course: string;
    section: string;
  } | null>(null);

  /* ================= FETCH ================= */

  const loadData = useCallback(async () => {
    if (!reportid) return;

    const [classRes, studentRes, attendanceRes] = await Promise.all([
      api.get(`/classes/${reportid}`),
      api.get(`/classes/${reportid}/students`),
      api.get(`/classes/${reportid}/attendance/summary`),
    ]);

    setClassInfo(classRes.data);
    setStudents(studentRes.data);
    setAttendance(attendanceRes.data);
  }, [reportid]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  /* ================= COMPUTED REPORT ================= */
  const gradeToPercentage = (grade?: number | null): number => {
    if (!grade) return 0;

    if (grade <= 1.0) return 98;
    if (grade <= 1.25) return 95;
    if (grade <= 1.5) return 92;
    if (grade <= 1.75) return 89;
    if (grade <= 2.0) return 86;
    if (grade <= 2.25) return 83;
    if (grade <= 2.5) return 80;
    if (grade <= 3.0) return 75;
    if (grade <= 4.0) return 70;

    return 60; // 5.0 / failed
  };

  const reports: ReportRow[] = useMemo(() => {
    const attendanceMap: Record<string, number> = {};

    attendance.forEach((a) => {
      attendanceMap[a._id] = a.attendance;
    });

    return students.map((s) => {
      const mid = s.grades?.midterm ?? null;
      const fin = s.grades?.final ?? null;

      const midPct = gradeToPercentage(mid);
      const finPct = gradeToPercentage(fin);

      const grade =
        midPct && finPct ? Math.round((midPct + finPct) / 2) : 0;

      return {
        id: s._id,
        name: s.name,
        grade,
        attendance: attendanceMap[s._id] ?? 0,
      };
    });
  }, [students, attendance]);


  /* ================= SUMMARY ================= */

  const summary = useMemo(() => {
    if (reports.length === 0) {
      return { avgGrade: "0", avgAttendance: "0", totalStudents: 0 };
    }

    const avgGrade = (
      reports.reduce((s, r) => s + r.grade, 0) / reports.length
    ).toFixed(1);

    const avgAttendance = (
      reports.reduce((s, r) => s + r.attendance, 0) / reports.length
    ).toFixed(1);

    return {
      avgGrade,
      avgAttendance,
      totalStudents: reports.length,
    };
  }, [reports]);

  /* ================= RENDER ================= */

  const renderRow = ({ item }: { item: ReportRow }) => (
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

const exportToPDF = async () => {
  if (!classInfo) return;

  try {
    const html = `
      <html>
        <body style="font-family: Arial; padding: 24px;">
          <h2>${classInfo.course}</h2>
          <p><strong>Section:</strong> ${classInfo.section}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

          <hr />

          <h3>Summary</h3>
          <p>Total Students: ${summary.totalStudents}</p>
          <p>Average Grade: ${summary.avgGrade}</p>
          <p>Average Attendance: ${summary.avgAttendance}%</p>

          <hr />

          <h3>Student Performance</h3>

          <table width="100%" border="1" cellspacing="0" cellpadding="6">
            <thead>
              <tr>
                <th align="left">Student</th>
                <th>Grade</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              ${reports
                .map(
                  r => `
                <tr>
                  <td>${r.name}</td>
                  <td align="center">${r.grade}</td>
                  <td align="center">${r.attendance}%</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    /* Generate PDF */
    const { uri } = await Print.printToFileAsync({ html });

    /* WEB: trigger browser download */
    if (Platform.OS === "web") {
      window.open(uri, "_blank");
      return;
    }

    /* NATIVE: share dialog */
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Exported", "PDF generated successfully");
    }
  } catch (err) {
    console.error("EXPORT PDF ERROR:", err);
    Alert.alert("Error", "Failed to export PDF");
  }
};

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* BACK */}
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/reports")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.accent} />
        </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports & Analytics</Text>
          <Text style={styles.courseTitle}>{classInfo?.course}</Text>
          <Text style={styles.sectionText}>{classInfo?.section}</Text>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons name="people-outline" size={24} color={colors.accent} />
            <Text style={styles.summaryLabel}>Students</Text>
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

        {/* TABLE */}
        <Text style={styles.sectionTitle}>Student Performance</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 3, textAlign: "left" }]}>
            Student
          </Text>
          <Text style={[styles.headerCell, { flex: 1.2 }]}>Grade</Text>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>Attendance</Text>
        </View>

        <FlatList
          data={reports}
          keyExtractor={(i) => i.id}
          renderItem={renderRow}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* EXPORT BUTTON (UNCHANGED) */}
      <TouchableOpacity style={styles.exportButton} onPress={exportToPDF}>
        <Ionicons name="download-outline" size={20} color={colors.buttonText} />
        <Text style={styles.exportText}>Export Report</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
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
  },
  courseTitle: {
    color: colors.card,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  sectionText: {
    color: colors.card,
    fontSize: 14,
    marginTop: 4,
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
    elevation: 6,
  },
  exportText: {
    color: colors.buttonText,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
});
