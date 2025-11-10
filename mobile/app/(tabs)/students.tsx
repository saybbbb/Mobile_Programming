// app/(tabs)/students.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItem,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const colors = {
  background: "#0D1B2A",
  surface: "#EAEAEA",
  accent: "#415A77",
  textPrimary: "#1B263B",
  textSecondary: "#778DA9",
  danger: "#B91C1C",
  buttonBg: "#415A77",
  buttonText: "#EAEAEA",
};

interface Student {
  id: string;
  name: string;
  studentId: string;
  course: string;
  yearLevel: string;
  section: string;
}

const StudentCard = ({
  student,
  onEdit,
  onDelete,
}: {
  student: Student;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) => (
  <View style={styles.card} accessible accessibilityRole="button">
    <View style={styles.info}>
      <Text style={styles.name}>{student.name}</Text>
      <Text style={styles.details}>ID: {student.studentId}</Text>
      <Text style={styles.details}>Course: {student.course}</Text>
      <Text style={styles.details}>Year Level: {student.yearLevel}</Text>
      <Text style={styles.details}>Section: {student.section}</Text>
    </View>

    <View style={styles.actions}>
      <TouchableOpacity
        onPress={() => onEdit?.(student.id)}
        style={styles.iconButton}
        accessibilityLabel={`Edit ${student.name}`}
      >
        <Ionicons name="create-outline" size={20} color={colors.accent} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete?.(student.id)}
        style={styles.iconButton}
        accessibilityLabel={`Delete ${student.name}`}
      >
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </TouchableOpacity>
    </View>
  </View>
);

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alice Johnson",
      studentId: "2021-10101",
      course: "BS Computer Science",
      yearLevel: "3rd Year",
      section: "CS-3A",
    },
    {
      id: "2",
      name: "Mark Lee",
      studentId: "2022-10456",
      course: "BS Information Technology",
      yearLevel: "2nd Year",
      section: "IT-2B",
    },
    {
      id: "3",
      name: "Sophia Chen",
      studentId: "2020-10999",
      course: "BS Computer Engineering",
      yearLevel: "4th Year",
      section: "CE-4A",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentId: "",
    course: "",
    yearLevel: "",
    section: "",
  });

  const handleEdit = (id: string) => {
    console.log("Edit student:", id);
  };

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddStudent = () => {
    if (
      !newStudent.name ||
      !newStudent.studentId ||
      !newStudent.course ||
      !newStudent.yearLevel ||
      !newStudent.section
    ) {
      Alert.alert("Missing Fields", "Please fill in all student details.");
      return;
    }

    const newEntry: Student = {
      id: Date.now().toString(),
      ...newStudent,
    };

    setStudents((prev) => [...prev, newEntry]);
    setNewStudent({
      name: "",
      studentId: "",
      course: "",
      yearLevel: "",
      section: "",
    });
    setModalVisible(false);
  };

  const renderStudent: ListRenderItem<Student> = ({ item }) => (
    <StudentCard student={item} onEdit={handleEdit} onDelete={handleDelete} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Manage Students</Text>
      <View style={styles.divider} />

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
        ListEmptyComponent={
          <Text style={styles.empty}>No students found. Tap + to add one.</Text>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add new student"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color={colors.buttonText} />
      </TouchableOpacity>

      {/* Modal for Adding Student */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Student</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { label: "Name", key: "name" },
                { label: "Student ID", key: "studentId" },
                { label: "Course", key: "course" },
                { label: "Year Level", key: "yearLevel" },
                { label: "Section", key: "section" },
              ].map((field) => (
                <TextInput
                  key={field.key}
                  placeholder={field.label}
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  value={(newStudent as any)[field.key]}
                  onChangeText={(text) =>
                    setNewStudent((prev) => ({ ...prev, [field.key]: text }))
                  }
                />
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.accent }]}
                onPress={handleAddStudent}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.danger }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: colors.surface,
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#2C3E50",
    marginBottom: 16,
    opacity: 0.4,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  details: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 12,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors.buttonBg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  empty: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: colors.buttonText,
    fontWeight: "600",
    fontSize: 15,
  },
});
