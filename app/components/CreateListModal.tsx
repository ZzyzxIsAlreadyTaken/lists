import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Category } from "./CategoryModal";

type CreateListModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  onTitleChange: (title: string) => void;
  selectedCategory?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  categories: Category[];
  onSubmit: () => void;
};

export default function CreateListModal({
  visible,
  onClose,
  title,
  onTitleChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onSubmit,
}: CreateListModalProps) {
  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit();
    onTitleChange("");
    onCategoryChange(undefined);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Create New List</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={onTitleChange}
                placeholder="Enter list title"
                autoFocus
              />
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
                      selectedCategory === category.id &&
                        styles.selectedCategory,
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
                    <Text style={styles.categoryOptionText}>
                      {category.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.createButton,
                  !title && styles.createButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!title}
              >
                <Text
                  style={[
                    styles.createButtonText,
                    !title && styles.createButtonTextDisabled,
                  ]}
                >
                  Create
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  keyboardView: {
    width: "100%",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
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
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  categorySelect: {
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  createButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#6B46C1",
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#ccc",
  },
  createButtonText: {
    color: "white",
    fontWeight: "500",
  },
  createButtonTextDisabled: {
    color: "#666",
  },
});
