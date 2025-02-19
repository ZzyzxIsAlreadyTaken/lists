import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SortBy = {
  field: "name" | "date";
  direction: "asc" | "desc";
};

type ActionBarProps = {
  sortBy: SortBy;
  onSortChange: (value: SortBy) => void;
  groupBy: "none" | "category";
  onGroupChange: (value: "none" | "category") => void;
};

export default function ActionBar({
  sortBy,
  onSortChange,
  groupBy,
  onGroupChange,
}: ActionBarProps) {
  const handleSortPress = (field: "name" | "date") => {
    if (sortBy.field === field) {
      // Toggle direction if same field
      onSortChange({
        field,
        direction: sortBy.direction === "asc" ? "desc" : "asc",
      });
    } else {
      // New field, start with ascending
      onSortChange({ field, direction: "asc" });
    }
  };

  return (
    <View style={styles.actionContainer}>
      <View style={styles.buttonRow}>
        <Pressable
          style={[
            styles.sortButton,
            sortBy.field === "name" && styles.activeButton,
          ]}
          onPress={() => handleSortPress("name")}
        >
          <Text
            style={[
              styles.buttonText,
              sortBy.field === "name" && styles.activeButtonText,
            ]}
          >
            Name{" "}
            {sortBy.field === "name" &&
              (sortBy.direction === "asc" ? "↑" : "↓")}
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.sortButton,
            sortBy.field === "date" && styles.activeButton,
          ]}
          onPress={() => handleSortPress("date")}
        >
          <Text
            style={[
              styles.buttonText,
              sortBy.field === "date" && styles.activeButtonText,
            ]}
          >
            Date{" "}
            {sortBy.field === "date" &&
              (sortBy.direction === "asc" ? "↑" : "↓")}
          </Text>
        </Pressable>
        <Pressable
          style={styles.groupButton}
          onPress={() =>
            onGroupChange(groupBy === "none" ? "category" : "none")
          }
        >
          <Ionicons
            name={
              groupBy === "category"
                ? "checkmark-circle"
                : "checkmark-circle-outline"
            }
            size={20}
            color="#666"
          />
          <Text style={styles.groupButtonText}>Group</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    marginTop: 15,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  sortButton: {
    flex: 3,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  groupButton: {
    flex: 2,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  activeButton: {
    backgroundColor: "#6B46C1",
  },
  buttonText: {
    color: "#666",
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#fff",
  },
  groupButtonText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 14,
  },
});
