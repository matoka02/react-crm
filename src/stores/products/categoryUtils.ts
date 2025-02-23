import { Category } from '../types/modelTypes';

interface StateWithCategories {
  categories: { categories: Category[] }
}
/**
* Gets the category name by `categoryId`, taking data from Redux state.
* @param categoryId - Category ID.
* @param getState - Redux `getState()` function.
* @returns Category name, or "Unknown" if not found.
*/

const getCategoryNameById = (categoryId: string, getState: () => any) => {
  const { categories }: StateWithCategories = getState();
  return categories.categories.find((category) => category.id === categoryId)?.name || 'Unknown'
}

export default getCategoryNameById;

