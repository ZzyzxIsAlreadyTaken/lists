import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Category } from "./CategoryModal";

type ListItemProps = {
  item: {
    id: string;
    title: string;
    items: Array<{ completed: boolean }>;
    archived?: boolean;
    categoryId?: string;
  };
  category?: Category;
  onArchive: (id: string) => void;
};

export default function ListItem({ item, category, onArchive }: ListItemProps) {
  const activeTasks = item.items.filter((task) => !task.completed).length;
  const completedTasks = item.items.filter((task) => task.completed).length;

  return (
    <Link
      href={`/${item.id}?title=${item.title}`}
      style={styles.listItemContainer}
      asChild
    >
      <Pressable>
        <View
          style={[styles.listItem, item.archived && styles.archivedListItem]}
        >
          <View style={styles.listItemContent}>
            <View style={styles.listItemMain}>
              {category && (
                <View style={styles.categoryRow}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: category.color },
                    ]}
                  />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
              )}
              <Text
                style={[
                  styles.listTitle,
                  item.archived && styles.archivedListTitle,
                ]}
              >
                {item.title}
              </Text>
              <Text style={styles.itemCount}>
                {activeTasks} active • {completedTasks} completed
              </Text>
            </View>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onArchive(item.id);
              }}
              style={styles.archiveButton}
            >
              <Text style={styles.archiveButtonText}>
                {item.archived ? "Unarchive" : "Archive"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 5,
    padding: 15,
  },
  archivedListItem: {
    backgroundColor: "#f0f0f0",
    borderColor: "#f0f0f0",
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  listItemMain: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 12,
    color: "#666",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: "#666",
  },
  archiveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  archiveButtonText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  archivedListTitle: {
    color: "#666",
  },
});
