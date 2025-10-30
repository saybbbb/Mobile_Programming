import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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

export default function GradeDetails() {
  const { gradeid, course, section } = useLocalSearchParams();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    midterm: "",
    final: "",
    remarks: "",
  });

  const [students, setStudents] = useState([
    {
      id: "S1",
      name: "Student 1",
      midterm: "1.5",
      final: "1.75",
      remarks: "Passed",
    },
    {
      id: "S2",
      name: "Student 2",
      midterm: "2.0",
      final: "2.25",
      remarks: "Passed",
    },
    {
      id: "S3",
      name: "Student 3",
      midterm: "1.25",
      final: "1.5",
      remarks: "Passed",
    },
    {
      id: "S4",
      name: "Student 4",
      midterm: "3.75",
      final: "5.0",
      remarks: "Failed",
    },
  ]);

  const getRemarksColor = (remarks: string) => {
    if (remarks.toLowerCase().includes("pass")) return colors.success;
    return colors.danger;
  };

  const handleAddStudent = () => {
    if (!newStudent.name.trim()) return;
    const id = `S${students.length + 1}`;
    setStudents([...students, { id, ...newStudent }]);
    setNewStudent({ name: "", midterm: "", final: "", remarks: "" });
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/grades")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.accent} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Grades</Text>
          <Text style={styles.courseTitle}>{course}</Text>
          <Text style={styles.sectionText}>{section}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 4 }]}>Student</Text>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Midterm</Text>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Final</Text>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Remarks</Text>
        </View>

        {/* Table Rows */}
        {students.map((student) => (
          <View key={student.id} style={styles.tableRow}>
            {/* Student Name + Edit Icon */}
            <View style={[styles.studentCell, { flex: 4 }]}>
              <Text style={styles.tableCellText}>{student.name}</Text>
              <TouchableOpacity style={styles.editBtn}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={colors.accent}
                />
              </TouchableOpacity>
            </View>

            {/* Midterm */}
            <Text
              style={[styles.tableCellText, { flex: 2, textAlign: "center" }]}
            >
              {student.midterm}
            </Text>

            {/* Final */}
            <Text
              style={[styles.tableCellText, { flex: 2, textAlign: "center" }]}
            >
              {student.final}
            </Text>

            {/* Remarks */}
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
              {student.remarks}
            </Text>
          </View>
        ))}

        {/* Floating Add Button fixed to bottom-right of the screen */}
        <TouchableOpacity
          style={styles.floatingAddButton}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Add Student"
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Modal for Adding Student */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Student</Text>

              {["name", "midterm", "final", "remarks"].map((field) => (
                <TextInput
                  key={field}
                  style={styles.modalInput}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={(newStudent as any)[field]}
                  onChangeText={(text) =>
                    setNewStudent({ ...newStudent, [field]: text })
                  }
                  keyboardType={
                    field === "midterm" || field === "final"
                      ? "decimal-pad"
                      : "default"
                  }
                />
              ))}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.accent },
                  ]}
                  onPress={handleAddStudent}
                >
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#aaa" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    backgroundColor: colors.background,
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
  editBtn: {
    padding: 4,
  },
  floatingAddButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: colors.accent,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
    elevation: 6,
  },
  /** MODAL **/
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
