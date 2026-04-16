export type NurseryInventoryStatus = "Healthy" | "Low Stock" | "Out of Stock"

export type NurseryInventoryItem = {
  id: string
  name: string
  category: string
  location: string
  stock: number
  reorderLevel: number
  soldThisWeek: number
  status: NurseryInventoryStatus
}

export type PlantSale = {
  id: string
  plant: string
  customer: string
  quantity: number
  amount: number
  soldAt: string
}

export const inventoryOverview: NurseryInventoryItem[] = [
  {
    id: "plant-001",
    name: "Monstera Deliciosa",
    category: "Indoor foliage",
    location: "Greenhouse A",
    stock: 28,
    reorderLevel: 12,
    soldThisWeek: 9,
    status: "Healthy",
  },
  {
    id: "plant-002",
    name: "Snake Plant Laurentii",
    category: "Low maintenance",
    location: "Warehouse 2",
    stock: 11,
    reorderLevel: 12,
    soldThisWeek: 7,
    status: "Low Stock",
  },
  {
    id: "plant-003",
    name: "Peace Lily",
    category: "Flowering indoor",
    location: "Greenhouse B",
    stock: 36,
    reorderLevel: 10,
    soldThisWeek: 5,
    status: "Healthy",
  },
  {
    id: "plant-004",
    name: "Fiddle Leaf Fig",
    category: "Premium indoor",
    location: "Display Room",
    stock: 4,
    reorderLevel: 8,
    soldThisWeek: 6,
    status: "Low Stock",
  },
  {
    id: "plant-005",
    name: "ZZ Plant",
    category: "Indoor foliage",
    location: "Warehouse 1",
    stock: 0,
    reorderLevel: 8,
    soldThisWeek: 4,
    status: "Out of Stock",
  },
  {
    id: "plant-006",
    name: "Pothos Marble Queen",
    category: "Trailing vine",
    location: "Greenhouse A",
    stock: 42,
    reorderLevel: 14,
    soldThisWeek: 11,
    status: "Healthy",
  },
  {
    id: "plant-007",
    name: "Calathea Orbifolia",
    category: "Humidity lovers",
    location: "Humidity Zone",
    stock: 8,
    reorderLevel: 10,
    soldThisWeek: 5,
    status: "Low Stock",
  },
  {
    id: "plant-008",
    name: "Aloe Vera",
    category: "Succulent",
    location: "Outdoor Rack",
    stock: 57,
    reorderLevel: 15,
    soldThisWeek: 13,
    status: "Healthy",
  },
]

export const recentPlantSales: PlantSale[] = [
  {
    id: "sale-1001",
    plant: "Monstera Deliciosa",
    customer: "Green Leaf Cafe",
    quantity: 3,
    amount: 104.97,
    soldAt: "10:20 AM",
  },
  {
    id: "sale-1002",
    plant: "Aloe Vera",
    customer: "Walk-in sale",
    quantity: 6,
    amount: 86.4,
    soldAt: "11:05 AM",
  },
  {
    id: "sale-1003",
    plant: "Calathea Orbifolia",
    customer: "Bloom Studio",
    quantity: 2,
    amount: 62.4,
    soldAt: "12:15 PM",
  },
  {
    id: "sale-1004",
    plant: "Snake Plant Laurentii",
    customer: "Sunrise Homes",
    quantity: 4,
    amount: 86,
    soldAt: "01:40 PM",
  },
  {
    id: "sale-1005",
    plant: "Peace Lily",
    customer: "Walk-in sale",
    quantity: 5,
    amount: 99.95,
    soldAt: "03:10 PM",
  },
]

export const monthlySoldPlants = [145, 162, 154, 188, 176, 194, 208, 201, 224, 238, 246, 259]

export const monthlyRestocks = [120, 130, 126, 165, 160, 172, 190, 182, 205, 210, 218, 230]

export const weeklySalesMix = [
  { day: "Mon", sold: 22, restocked: 18 },
  { day: "Tue", sold: 19, restocked: 12 },
  { day: "Wed", sold: 27, restocked: 20 },
  { day: "Thu", sold: 24, restocked: 14 },
  { day: "Fri", sold: 31, restocked: 16 },
  { day: "Sat", sold: 38, restocked: 22 },
  { day: "Sun", sold: 16, restocked: 10 },
]
