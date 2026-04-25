export type CategoryItem = {
  id: number;
  name: string;
  description?: string | null;
  status: boolean;
  organizationId?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CategoryForm = {
  name: string;
  description: string;
};
