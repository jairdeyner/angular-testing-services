import { faker } from '@faker-js/faker';
import { Product } from './product.model';

export const generateOneProduct = (): Product => {
  return {
    id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    price: parseInt(faker.commerce.price(), 10),
    images: [faker.image.imageUrl(), faker.image.imageUrl()],
    description: faker.commerce.productDescription(),
    category: {
      id: faker.datatype.number(),
      name: faker.commerce.department(),
    },
  };
};

export const generateManyProducts = (size: number = 10): Product[] => {
  const products: Product[] = [];

  for (let i = 0; i < size; i++) {
    products.push(generateOneProduct());
  }

  return [...products];
};
