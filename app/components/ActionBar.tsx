import { View, Text, Pressable, StyleSheet } from "react-native";

type ActionBarProps = {
  onManageCategories: () => void;
  sortBy: "name" | "category";
  onSortChange: (sort: "name" | "category") => void;
};

export default function ActionBar({
  onManageCategories,
  sortBy,
  onSortChange,
}: ActionBarProps) {
  return (
    <View style={styles.actionsContainer}>
      <View style={styles.actionRow}>
        <Pressable style={styles.categoryButton} onPress={onManageCategories}>
          <Text style={styles.categoryButtonText}>Manage Categories</Text>
        </Pressable>
        <Pressable
          style={styles.sortButton}
          onPress={() => onSortChange(sortBy === "name" ? "category" : "name")}
        >
          <Text style={styles.sortButtonText}>
            Sort by: {sortBy === "name" ? "Name" : "Category"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  categoryButtonText: {
    color: "#666",
  },
  sortButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  sortButtonText: {
    color: "#666",
  },
});
