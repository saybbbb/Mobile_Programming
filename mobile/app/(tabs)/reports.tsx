import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/api";

const colors = {
  background: "#0D1B2A",
  card: "#EAEAEA",
  accent: "#415A77",
  textPrimary: "#1B263B",
  placeholder: "#7F8C99",
  buttonBg: "#415A77",
  buttonText: "#EAEAEA",
};

type StoredUser = {
  fullName: string;
  profileImage?: string;
};

type ClassItem = {
  _id: string;
  course: string;
  section: string;
  instructor?: string;
  schedule: { day: string; time: string }[];
};

export default function ReportsScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [user, setUser] = useState<StoredUser | null>(null);

  /* LOAD USER */
  useEffect(() => {
    AsyncStorage.getItem("user").then((u) => {
      if (u) setUser(JSON.parse(u));
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadClasses = async () => {
        const res = await api.get("/classes");
        if (isActive) setClasses(res.data);
      };

      loadClasses();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const renderClassCard = ({ item }: { item: ClassItem }) => (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/reports/[reportid]",
          params: {
            reportid: item._id,
          },
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
          {item.schedule.map((sched, index) => (
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

          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.welcomeText}>Report & Analysis</Text>
              <Text style={styles.subText}>Student Performances</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* CLASS LIST */}
      <FlatList
        data={classes}
        renderItem={renderClassCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No classes found</Text>
        }
      />
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

  /** COURSE CARD **/
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

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textPrimary,
    opacity: 0.6,
  },
});
