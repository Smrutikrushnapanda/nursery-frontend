export type SubcategoryItem = {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  organizationId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SubcategoryForm = {
  name: string;
  categoryId: string;
};
