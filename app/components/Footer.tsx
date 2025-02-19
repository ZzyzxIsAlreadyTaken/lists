import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FooterProps = {
  onCreatePress: () => void;
};

export default function Footer({ onCreatePress }: FooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      <Pressable style={styles.createButton} onPress={onCreatePress}>
        <Text style={styles.createButtonText}>Create New List</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 16,
  },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
