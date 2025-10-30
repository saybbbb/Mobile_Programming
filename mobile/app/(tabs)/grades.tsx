import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const colors = {
  background: "#0D1B2A", // deep navy
  card: "#EAEAEA", // cream/off-white
  accent: "#415A77", // muted slate blue
  textPrimary: "#1B263B", // dark blue-gray
  placeholder: "#7F8C99", // muted gray-blue
  buttonBg: "#415A77", // slate accent
  buttonText: "#EAEAEA", // light cream
};

export default function GradesScreen() {
  const router = useRouter();

  const grades = [
    {
      id: "1",
      course: "Mobile Programming - USTP",
      section: "IT3R11 - BSIT",
      instructor: "User-01",
      schedule: [
        { day: "Monday", time: "3:30pm" },
        { day: "Thursday", time: "3:30pm" },
      ],
    },
    {
      id: "2",
      course: "Mobile Programming - USTP",
      section: "IT3R12 - BSIT",
      instructor: "User-01",
      schedule: [
        { day: "Tuesday", time: "7:00am" },
        { day: "Friday", time: "7:00am" },
      ],
    },
    {
      id: "3",
      course: "Mobile Programming - USTP",
      section: "IT3R13 - BSIT",
      instructor: "User-01",
      schedule: [
        { day: "Monday", time: "8:30am" },
        { day: "Wednesday", time: "8:30am" },
      ],
    },
  ];

  const renderGradeCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/grades/[gradeid]",
          params: {
            gradeid: item.id,
            course: item.course,
            section: item.section,
            instructor: item.instructor,
          },
        })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.courseTitle}>{item.course}</Text>
        <Text style={styles.courseSection}>{item.section}</Text>
        <Text style={styles.courseUser}>{item.instructor}</Text>
      </View>

      <View style={styles.cardFooter}>
        <View>
          {item.schedule.map((sched: any, index: number) => (
            <Text key={index} style={styles.scheduleText}>
              {sched.day} - {sched.time}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerCard}>
        <ImageBackground
          source={require("../../assets/images/header-bg.jpg")}
          style={styles.headerBg}
          imageStyle={{ borderRadius: 20 }}
          resizeMode="cover"
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

          {/* HEADER CONTENT */}
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.welcomeText}>Grades</Text>
              <Text style={styles.subText}>Input Grades of your Students</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* GRADE LIST */}
      <FlatList
        data={grades}
        renderItem={renderGradeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 16,
  },

  /** HEADER **/
  headerCard: {
    backgroundColor: colors.background,
    height: 170,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 6,
  },
  headerBg: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13,27,42,0.6)",
  },
  bellButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 12,
    zIndex: 2,
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
    flex: 1,
    paddingTop: 40,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.buttonText,
  },
  subText: {
    fontSize: 14,
    color: colors.card,
    marginTop: 4,
  },

  /** COURSE CARD (Copied from Class) **/
  courseCard: {
    backgroundColor: colors.background,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 25,
    overflow: "hidden",
    elevation: 3,
  },
  cardHeader: {
    padding: 12,
  },
  courseTitle: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "bold",
  },
  courseSection: {
    color: colors.accent,
    fontSize: 14,
    marginTop: 2,
  },
  courseUser: {
    color: colors.card,
    fontSize: 13,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  scheduleText: {
    color: colors.card,
    fontSize: 13,
  },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 12,
    zIndex: 2,
  },
});
