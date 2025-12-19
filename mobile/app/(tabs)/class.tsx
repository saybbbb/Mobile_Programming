import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import api from "../../services/api";

const colors = {
  background: "#0D1B2A",
  card: "#EAEAEA",
  accent: "#415A77",
  textPrimary: "#1B263B",
  placeholder: "#7F8C99",
  buttonText: "#EAEAEA",
};

type StoredUser = {
  fullName: string;
  profileImage?: string;
};

type ScheduleItem = {
  day: string;
  time: string;
};

type ClassItem = {
  _id: string;
  course: string;
  section: string;
  schedule: ScheduleItem[];
};

const SHEET_HEIGHT = 420;

export default function ClassScreen() {
  const router = useRouter();

  const [user, setUser] = useState<StoredUser | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [menuClass, setMenuClass] = useState<ClassItem | null>(null);

  const [course, setCourse] = useState("");
  const [section, setSection] = useState("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { day: "", time: "" },
  ]);

  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeScheduleIndex, setActiveScheduleIndex] = useState<number | null>(
    null
  );

  const createY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  /* LOAD USER */
  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  /* LOAD CLASSES */
  useEffect(() => {
    const load = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await api.get("/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* CREATE SHEET CONTROLS */
  const openCreate = () => {
    Animated.timing(createY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeCreate = () => {
    Animated.timing(createY, {
      toValue: SHEET_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuClass(null));
  };

  const addScheduleRow = () =>
    setSchedule((prev) => [...prev, { day: "", time: "" }]);

  const removeScheduleRow = (index: number) =>
    setSchedule((prev) => prev.filter((_, i) => i !== index));

  const editClass = (item: ClassItem) => {
    setMenuClass(item);
    setCourse(item.course);
    setSection(item.section);
    setSchedule(item.schedule.length ? item.schedule : [{ day: "", time: "" }]);
    openCreate();
  };

  const confirmDelete = (item: ClassItem) => {
    Alert.alert(
      "Delete Class",
      `Are you sure you want to delete ${item.course}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const token = await AsyncStorage.getItem("token");
            await api.delete(`/classes/${item._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setClasses((prev) => prev.filter((c) => c._id !== item._id));
            setMenuClass(null);
          },
        },
      ]
    );
  };

  const createClass = async () => {
    const token = await AsyncStorage.getItem("token");
    const cleanSchedule = schedule.filter((s) => s.day && s.time);

    if (menuClass) {
      const res = await api.put(
        `/classes/${menuClass._id}`,
        { course, section, schedule: cleanSchedule },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClasses((prev) =>
        prev.map((c) => (c._id === menuClass._id ? res.data : c))
      );
    } else {
      const res = await api.post(
        "/classes",
        { course, section, schedule: cleanSchedule },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClasses((prev) => [res.data, ...prev]);
    }

    setCourse("");
    setSection("");
    setSchedule([{ day: "", time: "" }]);
    closeCreate();
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const renderCourseCard = ({ item }: { item: ClassItem }) => (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/class/[classid]",
          params: { classid: item._id },
        })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.courseTitle}>{item.course}</Text>
        <Text style={styles.courseSection}>{item.section}</Text>
        <Text style={styles.courseUser}>{user?.fullName}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View>
          {item.schedule.map((s, i) => (
            <Text key={i} style={styles.scheduleText}>
              {s.day} - {s.time}
            </Text>
          ))}
        </View>

        <View style={styles.iconRow}>
          <Ionicons name="people-outline" size={20} color={colors.card} />
          <Ionicons name="folder-outline" size={20} color={colors.card} />
          <TouchableOpacity onPress={() => setMenuClass(item)}>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.card}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerCard}>
        <ImageBackground
          source={require("../../assets/images/header-bg.jpg")}
          style={styles.headerBg}
        >
          <View style={styles.headerOverlay} />

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/home")}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={colors.buttonText} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bellButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.buttonText}
            />
            <View style={styles.badge} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Class Sections</Text>
              <Text style={styles.subText}>Manage your Section/Class</Text>
              <Text style={styles.dateText}>{today}</Text>
            </View>

            <Image
              source={
                user?.profileImage
                  ? { uri: user.profileImage }
                  : require("../../assets/images/profile-placeholder.jpg")
              }
              style={styles.profileImage}
            />
          </View>
        </ImageBackground>
      </View>

      <FlatList
        data={classes}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openCreate}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* CONTEXT MENU */}
      {menuClass && (
        <TouchableWithoutFeedback onPress={() => setMenuClass(null)}>
          <View style={styles.overlay}>
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => editClass(menuClass)}
              >
                <Text style={styles.menuText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => confirmDelete(menuClass)}
              >
                <Text style={[styles.menuText, { color: "red" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* CREATE SHEET */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: createY }] }]}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>
            {menuClass ? "Edit Class" : "Add Class"}
          </Text>
          <TouchableOpacity onPress={closeCreate}>
            <Ionicons name="close" size={24} />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Course"
          value={course}
          onChangeText={setCourse}
          style={styles.input}
        />

        <TextInput
          placeholder="Section"
          value={section}
          onChangeText={setSection}
          style={styles.input}
        />

        <Text style={styles.label}>Schedule</Text>

        {schedule.map((s, i) => (
          <View key={i} style={styles.scheduleRow}>
            <TouchableOpacity
              style={[styles.input, styles.halfInput]}
              onPress={() => {
                setActiveScheduleIndex(i);
                setShowDayPicker(true);
              }}
            >
              <Text
                style={{
                  color: s.day ? colors.textPrimary : colors.placeholder,
                }}
              >
                {s.day || "Select day"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.input, styles.halfInput]}
              onPress={() => {
                setActiveScheduleIndex(i);
                setShowTimePicker(true);
              }}
            >
              <Text
                style={{
                  color: s.time ? colors.textPrimary : colors.placeholder,
                }}
              >
                {s.time || "Select time"}
              </Text>
            </TouchableOpacity>

            {schedule.length > 1 && (
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeScheduleRow(i)}
              >
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={addScheduleRow}>
          <Text style={{ color: colors.accent }}>+ Add another schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={createClass}>
          <Text style={styles.saveText}>
            {menuClass ? "Update Class" : "Save Class"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* PICKERS */}
      {showDayPicker && (
        <DateTimePicker
          mode="date"
          value={new Date()}
          onChange={(_, date) => {
            setShowDayPicker(false);
            if (!date || activeScheduleIndex === null) return;
            const day = date.toLocaleDateString("en-US", {
              weekday: "long",
            });
            setSchedule((prev) => {
              const copy = [...prev];
              copy[activeScheduleIndex].day = day;
              return copy;
            });
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          onChange={(_, date) => {
            setShowTimePicker(false);
            if (!date || activeScheduleIndex === null) return;
            const time = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });
            setSchedule((prev) => {
              const copy = [...prev];
              copy[activeScheduleIndex].time = time;
              return copy;
            });
          }}
        />
      )}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 16,
  },

  headerCard: {
    backgroundColor: colors.background,
    height: 170,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  headerBg: { flex: 1, padding: 20 },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13,27,42,0.6)",
  },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 12,
  },
  bellButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 12,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.card,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
  },
  welcomeText: { fontSize: 26, fontWeight: "700", color: colors.buttonText },
  subText: { fontSize: 14, color: colors.card, marginTop: 4 },
  dateText: {
    backgroundColor: "rgba(255,255,255,0.9)",
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 13,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.card,
  },

  courseCard: {
    backgroundColor: colors.background,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 25,
    overflow: "hidden",
  },
  cardHeader: { padding: 12 },
  courseTitle: { color: colors.card, fontSize: 16, fontWeight: "700" },
  courseSection: { color: colors.accent },
  courseUser: { color: colors.card },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  scheduleText: { color: colors.card },
  iconRow: { flexDirection: "row", gap: 16 },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors.accent,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  menu: {
    position: "absolute",
    right: 20,
    bottom: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    width: 140,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SHEET_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  label: {
    color: colors.accent,
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
    marginBottom: 0,
  },
  removeBtn: {
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: colors.accent,
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
