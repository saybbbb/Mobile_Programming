import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../../services/api";

const colors = {
  background: "#EAEAEA",
  card: "#FFFFFF",
  darkHeader: "#0D1B2A",
  accent: "#415A77",
  textPrimary: "#0D1B2A",
  border: "#D6DEE6",
  success: "#2ECC71",
  danger: "#E74C3C",
  tableHeader: "#E3E9F1",
  modalBg: "rgba(0,0,0,0.3)",
};

type Student = {
  _id: string;
  name: string;
  grades?: {
    midterm?: number | null;
    final?: number | null;
  };
  remarks?: string;
};

export default function GradeDetails() {
  const { gradeid } = useLocalSearchParams<{ gradeid: string }>();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);

  /* EDIT STATE */
  const [editVisible, setEditVisible] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editMidterm, setEditMidterm] = useState("");
  const [editFinal, setEditFinal] = useState("");
  const [editRemarks, setEditRemarks] = useState("");

  const [classInfo, setClassInfo] = useState<{
    course: string;
    section: string;
  } | null>(null);

  /* FETCH CLASS INFO */
  useEffect(() => {
    if (!gradeid) return;
    api.get(`/classes/${gradeid}`).then((res) => setClassInfo(res.data));
  }, [gradeid]);

  /* FETCH STUDENTS */
  const loadStudents = async () => {
    if (!gradeid) return;
    const res = await api.get(`/classes/${gradeid}/students`);
    setStudents(res.data);
  };

  useFocusEffect(
    useCallback(() => {
      loadStudents();
    }, [gradeid])
  );

  const openEdit = (student: Student) => {
    setEditStudent(student);
    setEditMidterm(String(student.grades?.midterm ?? ""));
    setEditFinal(String(student.grades?.final ?? ""));
    setEditRemarks(student.remarks ?? "");
    setEditVisible(true);
  };

  const saveGrades = async () => {
    if (!editStudent) return;

    await api.put(`/classes/students/${editStudent._id}`, {
      grades: {
        midterm: editMidterm ? Number(editMidterm) : null,
        final: editFinal ? Number(editFinal) : null,
      },
      remarks: editRemarks,
    });

    await loadStudents();
    setEditVisible(false);
    setEditStudent(null);
  };

  const getRemarksColor = (remarks?: string) => {
    if (!remarks) return colors.textPrimary;
    return remarks.toLowerCase().includes("pass")
      ? colors.success
      : colors.danger;
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* BACK */}
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/grades")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.accent} />
        </TouchableOpacity>

        {/* HEADER (UNCHANGED) */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Grades</Text>
          <Text style={styles.courseTitle}>{classInfo?.course}</Text>
          <Text style={styles.sectionText}>{classInfo?.section}</Text>
        </View>

        {/* TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 4 }]}>Student</Text>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Midterm</Text>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Final</Text>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Remarks</Text>
        </View>

        {/* TABLE ROWS */}
        {students.map((student) => (
          <View key={student._id} style={styles.tableRow}>
            <View style={[styles.studentCell, { flex: 4 }]}>
              <Text style={styles.tableCellText}>{student.name}</Text>
              <TouchableOpacity onPress={() => openEdit(student)}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={colors.accent}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[styles.tableCellText, { flex: 2, textAlign: "center" }]}
            >
              {student.grades?.midterm ?? "-"}
            </Text>

            <Text
              style={[styles.tableCellText, { flex: 2, textAlign: "center" }]}
            >
              {student.grades?.final ?? "-"}
            </Text>

            <Text
              style={[
                styles.tableCellText,
                {
                  flex: 2,
                  textAlign: "center",
                  color: getRemarksColor(student.remarks),
                },
              ]}
            >
              {student.remarks || "-"}
            </Text>
          </View>
        ))}

        {students.length === 0 && (
          <Text style={styles.emptyText}>No students found for this class</Text>
        )}
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={editVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Grades</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Midterm (1–5)"
              keyboardType="decimal-pad"
              value={editMidterm}
              onChangeText={setEditMidterm}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Final (1–5)"
              keyboardType="decimal-pad"
              value={editFinal}
              onChangeText={setEditFinal}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Remarks"
              value={editRemarks}
              onChangeText={setEditRemarks}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.accent }]}
                onPress={saveGrades}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#aaa" }]}
                onPress={() => setEditVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.tableHeader,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tableHeaderText: {
    textAlign: "center",
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  studentCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tableCellText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
    color: colors.textPrimary,
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalBg,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
