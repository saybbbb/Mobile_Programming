import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import api from "../../../services/api";

/* ================= CONSTANTS ================= */

const colors = {
  background: "#0D1B2A",
  card: "#EAEAEA",
  accent: "#415A77",
  textPrimary: "#1B263B",
  tabActive: "#EAEAEA",
  tabInactive: "#7F8C99",
};

const tabs = ["Bulletin", "Task", "Students"];
const SHEET_HEIGHT = 420;

/* ================= TYPES ================= */

type Student = {
  _id: string;
  name: string;
  studentId?: string;
};

type Bulletin = {
  _id: string;
  message: string;
};

type Task = {
  _id: string;
  title: string;
  dueDate?: string;
};

type ClassInfo = {
  course: string;
  section: string;
};

/* ================= COMPONENT ================= */

export default function ClassDetails() {
  const { classid } = useLocalSearchParams<{ classid: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Bulletin");
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);

  /* STUDENTS */
  const [students, setStudents] = useState<Student[]>([]);
  const [menuStudent, setMenuStudent] = useState<Student | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  /* BULLETIN */
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [bulletinText, setBulletinText] = useState("");

  /* TASK */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /* SHEETS */
  const studentY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const bulletinY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const taskY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [sheet, setSheet] = useState<"student" | "bulletin" | "task" | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!classid) return;

    api.get(`/classes/${classid}`).then(r => setClassInfo(r.data));
    api.get(`/classes/${classid}/students`).then(r => setStudents(r.data));
    api.get(`/classes/${classid}/bulletins`).then(r => setBulletins(r.data));
    api.get(`/classes/${classid}/tasks`).then(r => setTasks(r.data));
  }, [classid]);

  /* ================= SHEETS ================= */

  const openSheet = (type: typeof sheet) => {
    setSheet(type);
    const y = type === "student" ? studentY : type === "bulletin" ? bulletinY : taskY;
    Animated.timing(y, { toValue: 0, duration: 250, useNativeDriver: true }).start();
  };

  const closeSheet = () => {
    const y = sheet === "student" ? studentY : sheet === "bulletin" ? bulletinY : taskY;
    Animated.timing(y, { toValue: SHEET_HEIGHT, duration: 200, useNativeDriver: true })
      .start(() => {
        setSheet(null);
        setMenuStudent(null);
        setEditingStudent(null);
        setEditingTask(null);
        setStudentName("");
        setStudentId("");
        setTaskTitle("");
        setTaskDue("");
        setBulletinText("");
      });
  };

  /* ================= ACTIONS ================= */

  const saveStudent = async () => {
    if (!studentName.trim()) return;

    if (editingStudent) {
      await api.put(`/classes/students/${editingStudent._id}`, { name: studentName, studentId });
    } else {
      await api.post(`/classes/${classid}/students`, { name: studentName, studentId });
    }

    const r = await api.get(`/classes/${classid}/students`);
    setStudents(r.data);
    closeSheet();
  };

  const deleteStudent = (student: Student) => {
    Alert.alert("Delete Student", `Remove ${student.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await api.delete(`/classes/students/${student._id}`);
          setStudents(prev => prev.filter(s => s._id !== student._id));
        },
      },
    ]);
  };

  const saveBulletin = async () => {
    if (!bulletinText.trim()) return;

    await api.post(`/classes/${classid}/bulletins`, { message: bulletinText });
    const r = await api.get(`/classes/${classid}/bulletins`);
    setBulletins(r.data);
    closeSheet();
  };

  const saveTask = async () => {
    if (!taskTitle.trim()) return;

    if (editingTask) {
      await api.put(`/classes/tasks/${editingTask._id}`, { title: taskTitle, dueDate: taskDue });
    } else {
      await api.post(`/classes/${classid}/tasks`, { title: taskTitle, dueDate: taskDue });
    }

    const r = await api.get(`/classes/${classid}/tasks`);
    setTasks(r.data);
    closeSheet();
  };

  /* ================= TAB CONTENT ================= */

  const renderTabContent = () => {
    if (activeTab === "Students") {
      if (students.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.tabInactive} />
            <Text style={styles.emptyTitle}>No students yet</Text>
            <Text style={styles.emptySubtitle}>Tap + to add students</Text>
          </View>
        );
      }

      return (
        <>
          <Text style={styles.peopleHeader}>Students ({students.length})</Text>
          <FlatList
            data={students}
            keyExtractor={i => i._id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.studentRow} onPress={() => setMenuStudent(item)}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{item.name}</Text>
                  {item.studentId && <Text style={styles.studentId}>{item.studentId}</Text>}
                </View>
                <Ionicons name="ellipsis-vertical" size={18} color={colors.tabInactive} />
              </TouchableOpacity>
            )}
          />
        </>
      );
    }

    if (activeTab === "Bulletin") {
      if (bulletins.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Ionicons name="megaphone-outline" size={48} color={colors.tabInactive} />
            <Text style={styles.emptyTitle}>No announcements</Text>
            <Text style={styles.emptySubtitle}>Tap + to post one</Text>
          </View>
        );
      }

      return bulletins.map(b => (
        <View key={b._id} style={styles.card}>
          <Text style={styles.bulletinText}>{b.message}</Text>
        </View>
      ));
    }

    if (tasks.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={48} color={colors.tabInactive} />
          <Text style={styles.emptyTitle}>No tasks</Text>
          <Text style={styles.emptySubtitle}>Tap + to add a task</Text>
        </View>
      );
    }

    return tasks.map(t => (
      <View key={t._id} style={styles.card}>
        <Text style={styles.taskTitle}>{t.title}</Text>
        {t.dueDate && <Text style={styles.taskDue}>Due: {t.dueDate}</Text>}
      </View>
    ));
  };

  /* ================= RENDER ================= */

  return (
    <View style={styles.container}>
      <FlatList
        data={[1]}
        keyExtractor={() => "main"}
        renderItem={() => <View style={styles.contentCard}>{renderTabContent()}</View>}
        ListHeaderComponent={
          <>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.accent} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.courseTitle}>{classInfo?.course}</Text>
              <Text style={styles.sectionText}>Section {classInfo?.section}</Text>
            </View>

            <View style={styles.tabsContainer}>
              {tabs.map(tab => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                  <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          openSheet(activeTab === "Students" ? "student" : activeTab === "Bulletin" ? "bulletin" : "task")
        }
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {sheet && (
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* STUDENT SHEET */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: studentY }] }]}>
        <Text style={styles.sheetTitle}>{editingStudent ? "Edit Student" : "Add Student"}</Text>
        <TextInput placeholder="Name" value={studentName} onChangeText={setStudentName} style={styles.input} />
        <TextInput placeholder="Student ID" value={studentId} onChangeText={setStudentId} style={styles.input} />
        <TouchableOpacity style={styles.saveBtn} onPress={saveStudent}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* BULLETIN SHEET */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: bulletinY }] }]}>
        <Text style={styles.sheetTitle}>New Announcement</Text>
        <TextInput
          placeholder="Announcement"
          value={bulletinText}
          onChangeText={setBulletinText}
          style={[styles.input, { height: 100 }]}
          multiline
        />
        <TouchableOpacity style={styles.saveBtn} onPress={saveBulletin}>
          <Text style={styles.saveText}>Post</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* TASK SHEET */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: taskY }] }]}>
        <Text style={styles.sheetTitle}>{editingTask ? "Edit Task" : "New Task"}</Text>
        <TextInput placeholder="Task title" value={taskTitle} onChangeText={setTaskTitle} style={styles.input} />
        <TextInput placeholder="Due date" value={taskDue} onChangeText={setTaskDue} style={styles.input} />
        <TouchableOpacity style={styles.saveBtn} onPress={saveTask}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.card, paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 16 },
  backBtn: { marginLeft: 12, marginBottom: 12 },
  header: { backgroundColor: colors.background, padding: 20, borderRadius: 16, margin: 12 },
  courseTitle: { color: colors.card, fontSize: 20, fontWeight: "700" },
  sectionText: { color: colors.card },
  tabsContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 12 },
  tabText: { color: colors.tabInactive, fontWeight: "600" },
  tabTextActive: { color: colors.background, fontWeight: "700" },
  contentCard: { backgroundColor: colors.accent, borderRadius: 16, padding: 20, marginHorizontal: 12 },

  peopleHeader: { color: colors.card, fontWeight: "700", marginBottom: 12 },
  studentRow: { flexDirection: "row", backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10, alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { color: "#fff", fontWeight: "700" },
  studentName: { fontWeight: "700", color: colors.textPrimary },
  studentId: { color: colors.tabInactive },

  card: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 10 },
  bulletinText: { color: colors.textPrimary },
  taskTitle: { fontWeight: "700", color: colors.textPrimary },
  taskDue: { color: colors.tabInactive },

  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  emptySubtitle: { marginTop: 6, color: colors.tabInactive },

  fab: { position: "absolute", bottom: 24, right: 24, backgroundColor: colors.accent, width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },

  sheet: { position: "absolute", bottom: 0, width: "100%", height: SHEET_HEIGHT, backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  sheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 12 },
  saveBtn: { backgroundColor: colors.accent, padding: 14, borderRadius: 10 },
  saveText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
