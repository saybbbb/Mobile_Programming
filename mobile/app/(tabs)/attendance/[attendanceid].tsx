import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
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
  tableHeader: "#F5F7FA",
  present: "#16A34A",
  absent: "#B91C1C",
  divider: "#D6DEE6",
};

type AttendanceStudent = {
  _id: string;
  name: string;
  status: "Present" | "Absent";
};

export default function AttendanceDetails() {
  const { attendanceid } = useLocalSearchParams<{ attendanceid: string }>();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [classInfo, setClassInfo] = useState<{
    course: string;
    section: string;
  } | null>(null);

  const formattedDate = selectedDate.toISOString().split("T")[0];

  /* ================= FETCH ================= */

  const loadAttendance = async () => {
    if (!attendanceid) return;

    const [classRes, attendanceRes] = await Promise.all([
      api.get(`/classes/${attendanceid}`),
      api.get(`/classes/${attendanceid}/attendance`, {
        params: { date: formattedDate },
      }),
    ]);

    setClassInfo(classRes.data);
    setStudents(attendanceRes.data);
  };

  useFocusEffect(
    useCallback(() => {
      loadAttendance();
    }, [attendanceid, formattedDate])
  );

  /* ================= ACTIONS ================= */

  const toggleStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id
          ? { ...s, status: s.status === "Present" ? "Absent" : "Present" }
          : s
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "Present" })));
  };

  const saveAttendance = () => {
    Alert.alert("Save Attendance", `Save attendance for ${formattedDate}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save",
        onPress: async () => {
          await api.post(`/classes/${attendanceid}/attendance`, {
            date: formattedDate,
            records: students.map((s) => ({
              studentId: s._id,
              status: s.status,
            })),
          });

          Alert.alert("Success", "Attendance saved successfully");
        },
      },
    ]);
  };

  /* ================= RENDER ================= */

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* BACK */}
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/attendance")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.accent} />
        </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendance</Text>
          <Text style={styles.courseTitle}>{classInfo?.course}</Text>
          <Text style={styles.sectionText}>{classInfo?.section}</Text>

          {/* DATE PICKER */}
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </TouchableOpacity>
        </View>

        {/* TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 4, textAlign: "left" }]}>
            Student
          </Text>
          <Text style={[styles.headerText, { flex: 2 }]}>Status</Text>
          <Text style={[styles.headerText, { flex: 3 }]}>Action</Text>
        </View>

        {/* ROWS */}
        {students.map((s) => (
          <View key={s._id} style={styles.tableRow}>
            <Text style={[styles.cellText, { flex: 4 }]}>{s.name}</Text>

            <Text
              style={[
                styles.cellText,
                {
                  flex: 2,
                  textAlign: "center",
                  color:
                    s.status === "Present" ? colors.present : colors.absent,
                },
              ]}
            >
              {s.status}
            </Text>

            <TouchableOpacity
              style={[
                styles.statusButton,
                {
                  backgroundColor:
                    s.status === "Present" ? colors.present : colors.absent,
                },
              ]}
              onPress={() => toggleStatus(s._id)}
            >
              <Text style={styles.buttonLabel}>
                {s.status === "Present" ? "Mark Absent" : "Mark Present"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {students.length === 0 && (
          <Text style={styles.emptyText}>No students found for this date</Text>
        )}
      </ScrollView>

      {/* FLOATING ACTIONS */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={markAllPresent}>
          <Ionicons name="checkmark-done" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.fab} onPress={saveAttendance}>
          <Ionicons name="save-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* DATE PICKER MODAL */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },
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
  headerTitle: { color: colors.card, fontSize: 22, fontWeight: "700" },
  courseTitle: {
    color: colors.card,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  sectionText: { color: colors.card, fontSize: 14, marginTop: 4 },

  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  dateText: { color: "#fff", fontSize: 13 },

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
  cellText: { fontSize: 14, fontWeight: "500", color: colors.textPrimary },

  statusButton: {
    flex: 3,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonLabel: { color: "#fff", fontSize: 13, fontWeight: "600" },

  emptyText: {
    marginTop: 20,
    textAlign: "center",
    color: colors.textPrimary,
    opacity: 0.6,
  },

  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
