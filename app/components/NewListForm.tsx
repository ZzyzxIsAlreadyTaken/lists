import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Category } from "./CategoryManager";

type NewListFormProps = {
  title: string;
  onTitleChange: (title: string) => void;
  selectedCategory?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  categories: Category[];
  onSubmit: () => void;
};

export default function NewListForm({
  title,
  onTitleChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onSubmit,
}: NewListFormProps) {
  return (
    <>
      <View style={styles.inputContainer}>
        <View style={styles.newListForm}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={onTitleChange}
            placeholder="Enter new list title"
          />
        </View>
        <Pressable style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Create</Text>
        </Pressable>
      </View>
      <View style={styles.categorySelect}>
        <Text style={styles.categorySelectLabel}>Category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            style={[
              styles.categoryOption,
              !selectedCategory && styles.selectedCategory,
            ]}
            onPress={() => onCategoryChange(undefined)}
          >
            <Text style={styles.categoryOptionText}>None</Text>
          </Pressable>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryOption,
                selectedCategory === category.id && styles.selectedCategory,
                { borderColor: category.color },
              ]}
              onPress={() => onCategoryChange(category.id)}
            >
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: category.color },
                ]}
              />
              <Text style={styles.categoryOptionText}>{category.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  newListForm: {
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  categorySelect: {
    marginTop: 0,
  },
  categorySelectLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: "#f0f0f0",
  },
  categoryOptionText: {
    fontSize: 14,
    color: "#666",
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});
