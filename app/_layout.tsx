import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CategoryModal from "./components/CategoryModal";
import { CategoryProvider, useCategories } from "./context/CategoryContext";

function LayoutContent() {
  const { showCategoryModal, setShowCategoryModal, categories, saveCategory } =
    useCategories();

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#f8f8f8",
          },
          contentStyle: {
            backgroundColor: "#f8f8f8",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Lists",
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            title: "List Items",
          }}
        />
      </Stack>

      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        onSaveCategory={saveCategory}
      />
    </SafeAreaProvider>
  );
}

export default function Layout() {
  return (
    <CategoryProvider>
      <LayoutContent />
    </CategoryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerButton: {
    marginRight: 8,
    padding: 12,
    borderRadius: 6,
  },
  headerButtonPressed: {
    opacity: 0.7,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  headerButtonText: {
    color: "#6B46C1",
    fontSize: 16,
    fontWeight: "500",
  },
});
