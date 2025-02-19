import { Pressable, Text, StyleSheet } from "react-native";

type CategoriesButtonProps = {
  onPress: () => void;
};

export default function CategoriesButton({ onPress }: CategoriesButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.headerButton,
        pressed && styles.headerButtonPressed,
      ]}
      onPress={onPress}
      hitSlop={12}
    >
      <Text style={styles.headerButtonText}>Categories</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 8,
    padding: 12,
    borderRadius: 6,
  },
  headerButtonPressed: {
    opacity: 0.7,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  headerButtonText: {
    color: "#6B46C1",
    fontSize: 16,
    fontWeight: "500",
  },
});
