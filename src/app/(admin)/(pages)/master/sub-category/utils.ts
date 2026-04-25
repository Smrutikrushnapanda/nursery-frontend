import { SubcategoryItem } from "./types";

export const normalizeSubCategory = (item: any): SubcategoryItem => ({
  id: Number(item?.id ?? 0),
  name: item?.name ?? "",
  categoryId: Number(item?.categoryId ?? item?.category?.id ?? 0),
  categoryName:
    item?.categoryName ??
    item?.category?.name ??
    item?.category?.categoryName ??
    "",
  organizationId: item?.organizationId ?? null,
  createdAt: item?.createdAt ?? item?.created_at,
  updatedAt: item?.updatedAt ?? item?.updated_at,
});

export const formatSubCategoryDate = (value?: string) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
