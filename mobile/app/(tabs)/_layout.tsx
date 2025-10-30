import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#415A77",
        tabBarInactiveTintColor: "#EAEAEA",
        tabBarStyle: { backgroundColor: "#0D1B2A" },
      }}
    >
      {/* 🔹 Match folder names (index.tsx inside each folder will be used automatically) */}
      <Tabs.Screen
        name="class"
        options={{
          title: "Class",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="grades"
        options={{
          title: "Grades",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />

      {/* 🔸 Hide nested detail screens (they shouldn't appear as tabs) */}
      <Tabs.Screen
        name="home"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="class/[classid]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="grades/[gradeid]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="attendance/[attendanceid]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="reports/[reportid]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
