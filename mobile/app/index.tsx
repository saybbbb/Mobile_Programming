import React, { useEffect } from "react";
import {
  useRouter,
  useRootNavigation,
  useRootNavigationState,
} from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const rootNavigation = useRootNavigation();
  const rootState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigation || !rootState?.key) return; // wait until router is ready
    const timer = setTimeout(() => router.replace("/login"), 0);
    return () => clearTimeout(timer);
  }, [rootNavigation, rootState?.key]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#415A77" />
    </View>
  );
}
