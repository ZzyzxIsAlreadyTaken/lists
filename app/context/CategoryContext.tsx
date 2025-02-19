import { createContext, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category } from "../components/CategoryModal";

type CategoryContextType = {
  categories: Category[];
  showCategoryModal: boolean;
  setShowCategoryModal: (show: boolean) => void;
  saveCategory: (category: Category) => Promise<void>;
  loadCategories: () => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  showCategoryModal: false,
  setShowCategoryModal: () => {},
  saveCategory: async () => {},
  loadCategories: async () => {},
});

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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

  const saveCategory = async (category: Category) => {
    try {
      const updatedCategories = [...categories, category];
      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(updatedCategories)
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        showCategoryModal,
        setShowCategoryModal,
        saveCategory,
        loadCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategories = () => useContext(CategoryContext);
