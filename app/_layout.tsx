import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          contentStyle: {
            backgroundColor: "#fff",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Lists",
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            title: "List Items",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
