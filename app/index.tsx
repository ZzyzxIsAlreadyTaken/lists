import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CategoryManager, { Category } from "./components/CategoryManager";
import ListItem from "./components/ListItem";
import ActionBar from "./components/ActionBar";
import CreateListModal from "./components/CreateListModal";
import Footer from "./components/Footer";

type List = {
  id: string;
  title: string;
  items: ListItem[];
  archived?: boolean;
  categoryId?: string;
};

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "my-lists";

export default function Index() {
  const [lists, setLists] = useState<List[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListCategory, setNewListCategory] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<"name" | "category">("name");
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem("categories");
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLists();
      loadCategories();
    }, [])
  );

  const saveLists = async (updatedLists: List[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
    } catch (error) {
      console.error("Failed to save lists:", error);
    }
  };

  const saveCategories = async (updatedCategories: Category[]) => {
    try {
      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(updatedCategories)
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to save categories:", error);
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

  const sortedAndGroupedLists = useCallback(() => {
    const sorted = [...lists].sort((a, b) => {
      if (sortBy === "category") {
        const categoryA =
          categories.find((c) => c.id === a.categoryId)?.name || "";
        const categoryB =
          categories.find((c) => c.id === b.categoryId)?.name || "";
        return categoryA.localeCompare(categoryB);
      }
      return a.title.localeCompare(b.title);
    });

    return [
      ...sorted.filter((list) => !list.archived),
      ...(sorted.some((l) => l.archived)
        ? [{ id: "separator", title: "", items: [], archived: true }]
        : []),
      ...sorted.filter((list) => list.archived),
    ];
  }, [lists, categories, sortBy]);

  const toggleArchive = async (listId: string) => {
    const updatedLists = lists.map((list) =>
      list.id === listId ? { ...list, archived: !list.archived } : list
    );
    setLists(updatedLists);
    await saveLists(updatedLists);
  };

  const handleSaveCategory = async (category: Category) => {
    const updatedCategories = [...categories, category];
    await saveCategories(updatedCategories);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>My Lists</Text>

        <View style={styles.actionsRow}>
          <ActionBar
            onManageCategories={() => setShowCategoryManager(true)}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </View>

        <FlatList
          data={sortedAndGroupedLists()}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
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

      <CategoryManager
        visible={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onSaveCategory={handleSaveCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});
