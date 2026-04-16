import { Metadata } from "next"

import { columns, InventoryItem } from "@/components/tables/Columns"
import { DataTable } from "@/components/tables/DataTable"
import {FaPlus} from "react-icons/fa"

export const metadata: Metadata = {
  title: "Inventory | PlantScan Admin",
  description: "Inventory page for PlantScan Admin Dashboard",
}

const inventoryData: InventoryItem[] = [
  {
    id: "plant-001",
    name: "Monstera Deliciosa",
    sku: "PLT-MON-001",
    species: "Tropical Indoor",
    location: "Greenhouse A",
    stock: 28,
    price: 34.99,
    status: "In Stock",
  },
  {
    id: "plant-002",
    name: "Snake Plant Laurentii",
    sku: "PLT-SNK-014",
    species: "Sansevieria",
    location: "Warehouse 2",
    stock: 11,
    price: 21.5,
    status: "Low Stock",
  },
  {
    id: "plant-003",
    name: "Peace Lily",
    sku: "PLT-PLC-087",
    species: "Spathiphyllum",
    location: "Greenhouse B",
    stock: 36,
    price: 19.99,
    status: "In Stock",
  },
  {
    id: "plant-004",
    name: "Fiddle Leaf Fig",
    sku: "PLT-FDL-211",
    species: "Ficus Lyrata",
    location: "Display Room",
    stock: 4,
    price: 58,
    status: "Low Stock",
  },
  {
    id: "plant-005",
    name: "ZZ Plant",
    sku: "PLT-ZZ-032",
    species: "Zamioculcas",
    location: "Warehouse 1",
    stock: 0,
    price: 24.25,
    status: "Out of Stock",
  },
  {
    id: "plant-006",
    name: "Pothos Marble Queen",
    sku: "PLT-PTH-115",
    species: "Epipremnum Aureum",
    location: "Greenhouse A",
    stock: 42,
    price: 17.75,
    status: "In Stock",
  },
  {
    id: "plant-007",
    name: "Calathea Orbifolia",
    sku: "PLT-CAL-054",
    species: "Prayer Plant",
    location: "Humidity Zone",
    stock: 8,
    price: 31.2,
    status: "Low Stock",
  },
  {
    id: "plant-008",
    name: "Aloe Vera",
    sku: "PLT-ALO-005",
    species: "Succulent",
    location: "Outdoor Rack",
    stock: 57,
    price: 14.4,
    status: "In Stock",
  },
  {
    id: "plant-009",
    name: "Rubber Plant Burgundy",
    sku: "PLT-RBR-073",
    species: "Ficus Elastica",
    location: "Display Room",
    stock: 16,
    price: 39.95,
    status: "In Stock",
  },
  {
    id: "plant-010",
    name: "Chinese Evergreen",
    sku: "PLT-CHN-024",
    species: "Aglaonema",
    location: "Warehouse 2",
    stock: 0,
    price: 23.8,
    status: "Out of Stock",
  },
  {
    id: "plant-011",
    name: "Areca Palm",
    sku: "PLT-ARC-118",
    species: "Dypsis Lutescens",
    location: "Greenhouse C",
    stock: 14,
    price: 44.5,
    status: "In Stock",
  },
  {
    id: "plant-012",
    name: "Philodendron Birkin",
    sku: "PLT-PHL-091",
    species: "Philodendron",
    location: "Greenhouse B",
    stock: 6,
    price: 29.99,
    status: "Low Stock",
  },
]

export default function InventoryPage() {
  return (
    <div>
      <div className="rounded-2xl border border-border bg-white p-5 dark:bg-white/[0.03] lg:p-6 relative">
        <div className="mb-5 flex flex-col gap-1 lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Inventory
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sort any column and control how many plants appear on each page.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={inventoryData}
          defaultPageSize={5}
          pageSizeOptions={[5, 10, 15]}
        />


        <button className="bg-primary flex justify-center align-items-center gap-1 text-white p-2 w-[150px] rounded-lg absolute top-3 right-3">
          <span className="grid place-items-center text-sm font-bold"><FaPlus/></span>
          <span>Add Plant</span>
        </button>

      </div>
    </div>
  )
}
