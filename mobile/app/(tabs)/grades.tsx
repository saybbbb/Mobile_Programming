import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
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
  overlay: "rgba(0,0,0,0.5)",
};

interface GradeRecord {
  id: string;
  name: string;
  grade: number;
}

export default function GradesScreen() {
  const [grades, setGrades] = useState<GradeRecord[]>([
    { id: "1", name: "Alice Johnson", grade: 94 },
    { id: "2", name: "Mark Lee", grade: 88 },
    { id: "3", name: "Sophia Chen", grade: 91 },
    { id: "4", name: "David Cruz", grade: 76 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState("");

  const renderGrade = ({ item }: { item: GradeRecord }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
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
          Grade: {item.grade}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="create-outline" size={20} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="trash-outline" size={20} color="#B91C1C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleSave = () => {
    if (!newName || !newGrade) {
      setModalVisible(false);
      return;
    }

    const newRecord: GradeRecord = {
      id: Date.now().toString(),
      name: newName,
      grade: parseInt(newGrade),
    };

    setGrades((prev) => [...prev, newRecord]);
    setNewName("");
    setNewGrade("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Grade Management</Text>
      <View style={styles.divider} />

      <FlatList
        data={grades}
        keyExtractor={(item) => item.id}
        renderItem={renderGrade}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color={colors.buttonText} />
      </TouchableOpacity>

      {/* Add Grade Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Grade</Text>

            <TextInput
              style={styles.input}
              placeholder="Student Name"
              placeholderTextColor="#7F8C99"
              value={newName}
              onChangeText={setNewName}
            />

            <TextInput
              style={styles.input}
              placeholder="Grade (e.g., 90)"
              placeholderTextColor="#7F8C99"
              value={newGrade}
              onChangeText={setNewGrade}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#9CA3AF" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: colors.buttonBg },
                ]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Save</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  grade: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  modalButtonText: {
    color: colors.buttonText,
    fontWeight: "600",
    fontSize: 15,
  },
});
