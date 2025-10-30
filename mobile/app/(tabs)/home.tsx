import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
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
  link: "#1B263B", // deep navy link
};

export default function HomeScreen() {
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const quickLinks = [
    {
      id: "1",
      title: "Placeholder",
      icon: "calendar-outline",
      route: "/(tabs)/placeholder",
    },
    {
      id: "2",
      title: "Placeholder",
      icon: "megaphone-outline",
      route: "/(tabs)/placeholder",
    },
    {
      id: "3",
      title: "Placeholder",
      icon: "bar-chart-outline",
      route: "/(tabs)/placeholder",
    },
  ];

  const renderLink = ({ item }: any) => (
    <TouchableOpacity
      style={styles.linkCard}
      onPress={() => router.push(item.route)}
    >
      <View style={styles.linkLeft}>
        <Ionicons name={item.icon as any} size={22} color={colors.buttonText} />
        <Text style={styles.linkText}>{item.title}</Text>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        size={22}
        color={colors.buttonText}
      />
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

          {/* Bell at Top Right */}
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.buttonText}
            />
            <View style={styles.badge} />
          </TouchableOpacity>

          {/* Content Row */}
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.welcomeText}>Welcome!</Text>
              <Text style={styles.subText}>
                Hi User-01, Make Ravenscroft Proud!
              </Text>
              <Text style={styles.dateText}>{today}</Text>
            </View>

            <Image
              source={require("../../assets/images/profile-placeholder.jpg")}
              style={styles.profileImage}
            />
          </View>
        </ImageBackground>
      </View>

      <View style={styles.contentContainer}>
        {/* CLASS SCHEDULE */}
        <View style={styles.classSection}>
          <Text style={styles.classTitle}>Class Schedule</Text>

          <View style={styles.classRow}>
            <View style={styles.classCard}>
              <Text style={styles.classLabel}>Current</Text>
              <Text style={styles.classValue}>BSIT 3A</Text>
            </View>
            <Ionicons
              name="time-outline"
              size={28}
              color={colors.accent}
              style={styles.classIcon}
            />
            <View style={styles.classCard}>
              <Text style={styles.classLabel}>Next</Text>
              <Text style={styles.classValue}>BSIT 4C</Text>
            </View>
          </View>
        </View>

        {/* QUICK ACCESS */}
        <View style={styles.quickSection}>
          <View style={styles.quickHeader}>
            <Text style={styles.quickTitle}>Quick Access</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={quickLinks}
            renderItem={renderLink}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
        </View>
      </View>
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
    marginBottom: 30,
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
  dateText: {
    backgroundColor: colors.card,
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 13,
    alignSelf: "flex-start",
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

  /** CONTENT **/
  contentContainer: {
    flex: 1,
    padding: 20,
  },

  /** CLASS SCHEDULE **/
  classSection: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 50,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  classTitle: {
    color: colors.card,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },
  classRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 12,
  },
  classIcon: {
    marginHorizontal: 8,
  },
  classCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    minWidth: 110,
    alignItems: "center",
    flex: 1,
  },
  classLabel: { fontSize: 13, color: colors.placeholder },
  classValue: { fontSize: 16, color: colors.textPrimary, fontWeight: "600" },

  /** QUICK ACCESS **/
  quickTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 12,
  },
  quickSection: { flex: 1 },
  quickHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  viewAll: {
    color: colors.link,
    fontSize: 13,
    fontWeight: "500",
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.buttonBg,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    elevation: 2,
  },
  linkLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  linkText: { color: colors.buttonText, fontSize: 15, fontWeight: "600" },
});
