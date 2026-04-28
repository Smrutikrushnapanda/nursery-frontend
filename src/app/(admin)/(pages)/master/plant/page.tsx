"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { masterApis } from "@/utils/api/api";
import {
  type PlantMasterApiItem,
  type PlantMasterRow,
  mapPlantsToMasterRows,
} from "./PlantMasterData";
import { getPlantMasterColumns } from "./PlantMasterColumns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableLoader } from "@/components/table-loader/table-loader";
import { Filter, FilterField } from "@/components/common/Filter";
import { DashboardConfirmDialog } from "@/components/common/DashboardConfirmDialog";

export default function Page() {
  const [plants, setPlants] = useState<PlantMasterRow[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantMasterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deletingPlant, setDeletingPlant] = useState<PlantMasterRow | null>(null);
  const router = useRouter();

  const fetchPlants = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await masterApis.getAllPlants();
      const rawPlants = Array.isArray(response?.data) ? response.data : [];
      const mappedPlants = mapPlantsToMasterRows(rawPlants as PlantMasterApiItem[]);
      setPlants(mappedPlants);
      setFilteredPlants(mappedPlants);
    } catch (err: any) {
      console.log(err);
      setError(err?.message || "Failed to load plants");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        masterApis.getCategories(),
        masterApis.getSubCategories(),
      ]);
      
      // Categorical data often comes nested in data.data or just data
      const catData = Array.isArray(catRes?.data?.data) 
        ? catRes.data.data 
        : Array.isArray(catRes?.data) 
          ? catRes.data 
          : Array.isArray(catRes) 
            ? catRes 
            : [];

      const subData = Array.isArray(subRes?.data?.data) 
        ? subRes.data.data 
        : Array.isArray(subRes?.data) 
          ? subRes.data 
          : Array.isArray(subRes) 
            ? subRes 
            : [];
      
      setCategories(catData);
      setSubCategories(subData);
    } catch (err) {
      console.error("Failed to fetch filter options:", err);
      setCategories([]);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    fetchPlants();
    fetchFilterOptions();
  }, []);

  const filterFields: FilterField[] = useMemo(() => [
    {
      id: "category",
      label: "Category",
      type: "select",
      options: (Array.isArray(categories) ? categories : []).map((c) => ({ 
        value: c?.name || "", 
        label: c?.name || "Unknown" 
      })),
      placeholder: "All Categories",
    },
    {
      id: "subcategory",
      label: "Subcategory",
      type: "select",
      options: (Array.isArray(subCategories) ? subCategories : []).map((s) => ({ 
        value: s?.name || "", 
        label: s?.name || "Unknown" 
      })),
      placeholder: "All Subcategories",
    },
    {
      id: "search",
      label: "Search Name/SKU",
      type: "text",
      placeholder: "Search plants...",
    },
  ], [categories, subCategories]);

  const handleFilter = useCallback((values: Record<string, any>) => {
    let filtered = [...plants];

    if (values.category) {
      filtered = filtered.filter((p) => p.category === values.category);
    }

    if (values.subcategory) {
      filtered = filtered.filter((p) => p.subcategory === values.subcategory);
    }

    if (values.search) {
      const searchTerm = values.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.sku.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredPlants(filtered);
    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ));
  }, [plants]);

  const handleReset = useCallback(() => {
    setFilteredPlants(plants);
    setPagination((prev) => (
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }
    ));
  }, [plants]);

  const handleDelete = useCallback(async (plant: PlantMasterRow) => {
    setDeleting(true);
    try {
      await masterApis.deletePlant(Number(plant.id));
      await fetchPlants();
      setDeletingPlant(null);
    } catch (error: any) {
      console.log(error);
      alert(error?.message || "Failed to delete plant");
    } finally {
      setDeleting(false);
    }
  }, []);

  const handleEdit = useCallback((plant: PlantMasterRow) => {
    router.push(`/master/plant/add-plant?edit=${plant.id}`);
  }, [router]);

  const columns = useMemo(
    () => getPlantMasterColumns({ onEdit: handleEdit, onDelete: setDeletingPlant }),
    [handleEdit]
  );

  const handleDownloadExcel = async () => {
    const { utils, writeFile } = await import('xlsx');
    
    if (plants.length === 0) return;

    const worksheet = utils.json_to_sheet(plants.map(p => ({
       ID: p.id,
       Name: p.name,
       SKU: p.sku,
       Category: p.category,
       Subcategory: p.subcategory,
       Status: p.status ? "Active" : "Inactive"
    })));
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Plants");
    writeFile(workbook, `plants_master_${new Date().getTime()}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sprout className="w-6 h-6 text-brand-500" />
          Plant Master
        </h1>
        <Link href="plant/add-plant">
          <Button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-xl shadow-md transition-all active:scale-95">
            + Add Plant
          </Button>
        </Link>
      </div>

      <Filter fields={filterFields} onFilter={handleFilter} onReset={handleReset} />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
        <TableLoader message="Loading plant master data..." />
      ) : (
        <DataTable
          columns={columns}
          data={filteredPlants}
          defaultPageSize={10}
          pagination={pagination}
          onPaginationChange={setPagination}
          onDownloadAll={handleDownloadExcel}
        />
      )}

      <DashboardConfirmDialog
        isOpen={Boolean(deletingPlant)}
        onClose={() => {
          if (!deleting) {
            setDeletingPlant(null);
          }
        }}
        onConfirm={() => {
          if (deletingPlant && !deleting) {
            void handleDelete(deletingPlant);
          }
        }}
        title="Delete Plant"
        description={
          deletingPlant
            ? `This will delete "${deletingPlant.name}". You can't undo this from the table.`
            : "This action will delete the selected plant."
        }
        confirmLabel="Delete"
        loading={deleting}
        loadingLabel="Deleting..."
      />
    </div>
  );
}
