import { useState, useCallback, useEffect, useLayoutEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  router,
  Stack,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CategoryModal from "./components/CategoryModal";
import ListItem from "./components/ListItem";
import ActionBar from "./components/ActionBar";
import CreateListModal from "./components/CreateListModal";
import Footer from "./components/Footer";
import { Ionicons } from "@expo/vector-icons";
import CategoriesButton from "./components/CategoriesButton";
import { useCategories } from "./context/CategoryContext";

type List = {
  id: string;
  title: string;
  items: ListItem[];
  archived?: boolean;
  categoryId?: string;
  isCategorySeparator?: boolean;
  isCollapsed?: boolean;
};

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
};

type ListOrSeparator =
  | List
  | {
      id: string;
      title: string;
      items: ListItem[];
      isCategorySeparator?: boolean;
      archived?: boolean;
      categoryId?: string;
      isCollapsed?: boolean;
    };

type SortBy = {
  field: "name" | "date";
  direction: "asc" | "desc";
};

type CollapsedCategories = {
  [categoryId: string]: boolean; // true means collapsed
};

const STORAGE_KEY = "my-lists";

export default function Index() {
  const { categories, loadCategories } = useCategories();
  const [lists, setLists] = useState<List[]>([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListCategory, setNewListCategory] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<SortBy>({
    field: "name",
    direction: "asc",
  });
  const [groupBy, setGroupBy] = useState<"none" | "category">("none");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [collapsedCategories, setCollapsedCategories] =
    useState<CollapsedCategories>({});

  const loadLists = async () => {
    try {
      const storedLists = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }
    } catch (error) {
      console.error("Failed to load lists:", error);
    }
  };

  const loadCollapsedState = async () => {
    try {
      const storedState = await AsyncStorage.getItem("collapsedCategories");
      if (storedState) {
        setCollapsedCategories(JSON.parse(storedState));
      }
    } catch (error) {
      console.error("Failed to load collapsed state:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLists();
      loadCategories();
      loadCollapsedState();
    }, [])
  );

  const saveLists = async (updatedLists: List[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
    } catch (error) {
      console.error("Failed to save lists:", error);
    }
  };

  const createNewList = async () => {
    if (newListTitle.trim() === "") return;

    const newList: List = {
      id: Date.now().toString(),
      title: newListTitle,
      items: [],
      categoryId: newListCategory,
    };

    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    await saveLists(updatedLists);
    setNewListTitle("");
    setNewListCategory(undefined);
  };

  const sortedAndGroupedLists = useCallback((): ListOrSeparator[] => {
    const sortLists = (a: List, b: List) => {
      const multiplier = sortBy.direction === "asc" ? 1 : -1;

      if (sortBy.field === "date") {
        return multiplier * (parseInt(b.id) - parseInt(a.id));
      }
      return multiplier * a.title.localeCompare(b.title);
    };

    // First separate non-archived and archived
    let nonArchived = [...lists].filter((list) => !list.archived);
    let archived = [...lists].filter((list) => list.archived);

    // If grouping by category
    if (groupBy === "category") {
      // Get unique categories
      const uniqueCategories = Array.from(
        new Set(nonArchived.map((list) => list.categoryId))
      );

      // Sort lists within each category
      const groupedNonArchived = uniqueCategories.flatMap((categoryId) => {
        const categoryLists = nonArchived
          .filter((list) => list.categoryId === categoryId)
          .sort(sortLists);

        if (categoryLists.length === 0) return [];

        const category = categories.find((c) => c.id === categoryId);
        const isCollapsed = collapsedCategories[categoryId ?? "none"] ?? true; // Default to collapsed

        return [
          {
            id: `category-${categoryId || "none"}`,
            title: category?.name || "No Category",
            items: [],
            isCategorySeparator: true,
            categoryId: categoryId,
            isCollapsed,
          },
          ...(isCollapsed ? [] : categoryLists),
        ];
      });

      nonArchived = groupedNonArchived;
    } else {
      // If not grouping, sort all non-archived lists together
      nonArchived.sort(sortLists);
    }

    // Sort archived lists
    archived.sort(sortLists);

    return [
      ...nonArchived,
      ...(archived.length > 0
        ? [{ id: "separator", title: "", items: [], archived: true }]
        : []),
      ...archived,
    ];
  }, [lists, categories, sortBy, groupBy, collapsedCategories]);

  const toggleArchive = async (listId: string) => {
    const updatedLists = lists.map((list) =>
      list.id === listId ? { ...list, archived: !list.archived } : list
    );
    setLists(updatedLists);
    await saveLists(updatedLists);
  };

  const toggleCategoryCollapse = async (categoryId: string) => {
    const newState = {
      ...collapsedCategories,
      [categoryId]: !collapsedCategories[categoryId],
    };
    setCollapsedCategories(newState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.actionsRow}>
          <ActionBar
            sortBy={sortBy}
            onSortChange={(value: SortBy) => setSortBy(value)}
            groupBy={groupBy}
            onGroupChange={(value: "none" | "category") => setGroupBy(value)}
          />
        </View>

        <FlatList<ListOrSeparator>
          data={sortedAndGroupedLists()}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.isCategorySeparator) {
              return (
                <Pressable
                  style={styles.categorySeparator}
                  onPress={() =>
                    toggleCategoryCollapse(item.categoryId ?? "none")
                  }
                >
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryLabel}>{item.title}</Text>
                    <Ionicons
                      name={item.isCollapsed ? "chevron-down" : "chevron-up"}
                      size={20}
                      color="#666"
                    />
                  </View>
                  <Text style={styles.categoryCount}>
                    {
                      lists.filter(
                        (l) => l.categoryId === item.categoryId && !l.archived
                      ).length
                    }{" "}
                    lists
                  </Text>
                </Pressable>
              );
            }

            if (item.id === "separator" && lists.some((l) => l.archived)) {
              return (
                <View style={styles.archiveSeparator}>
                  <Text style={styles.archiveLabel}>Archived Lists</Text>
                </View>
              );
            }

            if (item.id === "separator") return null;

            const category = categories.find((c) => c.id === item.categoryId);
            return (
              <ListItem
                item={item}
                category={category}
                onArchive={toggleArchive}
              />
            );
          }}
        />
      </View>

      <Footer onCreatePress={() => setShowCreateModal(true)} />

      <CreateListModal
        visible={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewListTitle("");
          setNewListCategory(undefined);
        }}
        title={newListTitle}
        onTitleChange={setNewListTitle}
        selectedCategory={newListCategory}
        onCategoryChange={setNewListCategory}
        categories={categories}
        onSubmit={createNewList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  actionsRow: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra padding for footer
  },
  archiveSeparator: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginVertical: 15,
    paddingTop: 15,
  },
  archiveLabel: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  categorySeparator: {
    paddingVertical: 10,
    marginBottom: 5,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    padding: 15,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  categoryCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
