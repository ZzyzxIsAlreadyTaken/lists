import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "my-lists";

export default function ListDetail() {
  const { id, title } = useLocalSearchParams();
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const storedLists = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLists) {
        const lists = JSON.parse(storedLists);
        const currentList = lists.find((list: any) => list.id === id);
        if (currentList) {
          setItems(currentList.items);
        }
      }
    } catch (error) {
      console.error("Failed to load items:", error);
    }
  };

  const saveItems = async (updatedItems: ListItem[]) => {
    try {
      const storedLists = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLists) {
        const lists = JSON.parse(storedLists);
        const updatedLists = lists.map((list: any) =>
          list.id === id ? { ...list, items: updatedItems } : list
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
      }
    } catch (error) {
      console.error("Failed to save items:", error);
    }
  };

  const addItem = async () => {
    if (newItemText.trim() === "") return;

    const newItem: ListItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    await saveItems(updatedItems);
    setNewItemText("");
  };

  const toggleItem = async (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setItems(updatedItems);
    await saveItems(updatedItems);
  };

  const itemSummary = {
    total: items.length,
    active: items.filter((item) => !item.completed).length,
    completed: items.filter((item) => item.completed).length,
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title as string}</Text>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          {itemSummary.active} active • {itemSummary.completed} completed
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItemText}
          onChangeText={setNewItemText}
          placeholder="Add new item"
        />
        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isFirstCompleted =
            index > 0 &&
            !sortedItems[index].completed !== !sortedItems[index - 1].completed;

          return (
            <>
              {isFirstCompleted && <View style={styles.separator} />}
              <Pressable
                style={[
                  styles.itemContainer,
                  !item.completed && styles.completedItemContainer,
                ]}
                onPress={() => toggleItem(item.id)}
              >
                <Ionicons
                  name={item.completed ? "checkbox" : "square-outline"}
                  size={24}
                  color="#6B46C1"
                />
                <Text
                  style={[
                    styles.itemText,
                    item.completed && styles.completedItemText,
                  ]}
                >
                  {item.text}
                </Text>
              </Pressable>
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#6B46C1",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  completedItemText: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  summaryContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  summaryText: {
    color: "#666",
    fontSize: 14,
  },
  completedItemContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
  },
  separator: {
    height: 2,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
    marginHorizontal: -20,
  },
});
