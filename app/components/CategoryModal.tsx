import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export type Category = {
  id: string;
  name: string;
  color: string;
};

type CategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onSaveCategory: (category: Category) => void;
};

const DEFAULT_COLORS = [
  "#FF6B6B", // red
  "#4ECDC4", // teal
  "#45B7D1", // blue
  "#96CEB4", // green
  "#FFEEAD", // yellow
  "#D4A5A5", // pink
  "#9B59B6", // purple
  "#E67E22", // orange
];

export default function CategoryModal({
  visible,
  onClose,
  categories,
  onSaveCategory,
}: CategoryModalProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);

  useEffect(() => {
    console.log("CategoryModal visible:", visible); // Debug log
  }, [visible]);

  const handleSave = () => {
    if (newCategoryName.trim() === "") return;

    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      color: selectedColor,
    };

    onSaveCategory(newCategory);
    onClose(); // Close the modal after saving

    // Reset the form
    setNewCategoryName("");
    setSelectedColor(DEFAULT_COLORS[0]);
  };

  const handleSaveCategory = (newCategory: Category) => {
    // This function is no longer used as categories is already available as a prop
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Manage Categories</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="New category name"
                />
              </View>

              <Text style={styles.colorLabel}>Select Color:</Text>
              <View style={styles.colorGrid}>
                {DEFAULT_COLORS.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>

              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Add Category</Text>
              </Pressable>

              <Text style={styles.existingLabel}>Existing Categories:</Text>
              <View style={styles.categoriesList}>
                {categories.map((item) => (
                  <View key={item.id} style={styles.categoryItem}>
                    <View
                      style={[
                        styles.categoryDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    height: "80%",
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  colorLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#000",
  },
  saveButton: {
    backgroundColor: "#6B46C1",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  existingLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
  },
  categoriesList: {
    maxHeight: 200,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#666",
  },
});
