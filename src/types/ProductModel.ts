import { Category, Product } from './DBmodel';

class ProductModel implements Product {
  id: number;

  name: string;

  categoryId: number | string;

  numInStock: number;

  unitPrice: number;

  category: Category;

  constructor(
    name: string = '',
    categoryId: string = '',
    numInStock: number = 0,
    unitPrice: number = 0,
    category: Category = {} as Category
  ) {
    this.id = 0;
    this.name = name;
    this.categoryId = categoryId;
    this.numInStock = numInStock;
    this.unitPrice = unitPrice;
    this.category = category;
  }
}

export default ProductModel;
