import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useRootNavigation,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const rootNavigation = useRootNavigation();
  const rootState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigation || !rootState?.key) return;

    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        router.replace(token ? "/(tabs)/home" : "/login");
      } catch {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [rootNavigation, rootState?.key]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#415A77" />
    </View>
  );
}
