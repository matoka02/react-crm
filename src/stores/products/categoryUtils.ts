import { Category } from '../types/modelTypes';

interface StateWithCategories {
  categories: { categories: Category[] };
}
/**
 * Gets the category name by `categoryId`, taking data from Redux state.
 * @param categoryId - Category ID.
 * @param getState - Redux `getState()` function.
 * @returns Category name, or "Unknown" if not found.
 */

const getCategoryName = (categoryId: string | number, getState: () => any) => {
  const { categories }: StateWithCategories = getState();

  const foundCategory = categories.categories.find(
    (category) => String(category.id) === String(categoryId)
  );

  return foundCategory?.name || 'Unknown';
};

export default getCategoryName;
