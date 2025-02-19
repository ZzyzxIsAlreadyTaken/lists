import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCategories } from "../context/CategoryContext";

type FooterProps = {
  onCreatePress: () => void;
};

export default function Footer({ onCreatePress }: FooterProps) {
  const insets = useSafeAreaInsets();
  const { setShowCategoryModal } = useCategories();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      <View style={styles.buttonRow}>
        <Pressable
          style={styles.categoriesButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categoriesButtonText}>Categories</Text>
        </Pressable>
        <Pressable style={styles.createButton} onPress={onCreatePress}>
          <Text style={styles.createButtonText}>Create New List</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#f8f8f8",
    padding: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  categoriesButton: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  categoriesButtonText: {
    color: "#6B46C1",
    fontWeight: "600",
    fontSize: 16,
  },
  createButton: {
    flex: 2,
    backgroundColor: "#6B46C1",
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
