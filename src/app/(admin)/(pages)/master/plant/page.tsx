"use client";

import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { masterApis } from "@/utils/api/api";
import {
  type PlantMasterApiItem,
  type PlantMasterRow,
  mapPlantsToMasterRows,
} from "./PlantMasterData";
import { plantMasterColumns } from "./PlantMasterColumns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TableLoader } from "@/components/table-loader/table-loader";

export default function Page() {
  const [plants, setPlants] = useState<PlantMasterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await masterApis.getAllPlants();
        const rawPlants = Array.isArray(response?.data) ? response.data : [];
        setPlants(mapPlantsToMasterRows(rawPlants as PlantMasterApiItem[]));
      } catch (err: any) {
        console.log(err);
        setError(err?.message || "Failed to load plants");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  return (
    <div className="space-y-6">

        <div className="w-full flex justify-end">
         <Link href="plant/add-plant">
           <Button className="bg-primary text-white p-2 rounded">
            + Add Plant
          </Button>         
         </Link>
        </div>
  

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
        <TableLoader message="Loading plant master data..."/>
      ) : (
        <DataTable columns={plantMasterColumns} data={plants} defaultPageSize={10} />
      )}
    </div>
  );
}
