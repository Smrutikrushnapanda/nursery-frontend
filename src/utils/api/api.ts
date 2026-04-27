import axios from "axios";
import { useAppStore } from "@/utils/store/store";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
    baseURL: backend,
    headers: {
        "Content-Type": "application/json",
    },
});

// Global Loader Interceptor
api.interceptors.request.use((config) => {
    if (config.headers?.["X-Global-Loader"] === "true") {
        useAppStore.getState().setLoading(true);
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        if (response.config.headers?.["X-Global-Loader"] === "true") {
            useAppStore.getState().setLoading(false);
        }
        return response;
    },
    (error) => {
        if (error.config?.headers?.["X-Global-Loader"] === "true") {
            useAppStore.getState().setLoading(false);
        }
        return Promise.reject(error);
    }
);

const getApiError = (error: any) => {
    const responseData = error?.response?.data;

    if (typeof responseData?.message === "string") {
        return new Error(responseData.message);
    }

    if (Array.isArray(responseData?.message)) {
        return new Error(responseData.message.join(", "));
    }

    return error;
};

//Authenticated apis
export const authApis = {

    register: async (formData: any) => {
        try {

            const { data } = await api.post("/auth/register", formData);

            return data

        } catch (error: any) {
            throw getApiError(error);
        }
    },

    login: async (formData: any) => {
        try {

            const { data } = await api.post("/auth/login", formData, {
                withCredentials: true
            });

            return data
        } catch (error: any) {
            throw getApiError(error);
        }
    },

    logout: async () => {
        try {
            const { data } = await api.post("/auth/logout", {}, {
                withCredentials: true,
                headers: {
                    "X-Global-Loader": "true"
                }
            });

            return data
        } catch (error: any) {
            throw getApiError(error);
        }
    },

    verify: async () => {
        try {

            const { data } = await api.get("/auth/verify", {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    getBusinessTypes: async () => {
        try {
            const { data } = await api.get("/register/business-types");

            return data;
        } catch (error: any) {
            throw getApiError(error);
        }
    },

    getCategories: async () => {
        try {

            const { data } = await api.get("/register/categories");

            return data;

        } catch (error: any) {
            throw getApiError(error);
        }
    },

    getSubCategories: async (id?: number) => {
        try {
            const { data } = await api.get("/register/sub-categories?categoryId=" + id)

            return data
        } catch (error: any) {
            throw getApiError(error);
        }
    },


}

export const organizationApis = {
    getOrganizationData: async (id: string) => {
        try {

            const { data } = await api.get(`/organizations/${id}`);

            return data;

        } catch (error: any) {
            throw getApiError(error);
        }
    },

    updateOrganization: async (id: string, newData: any) => {
        try {
            const { data } = await api.patch(`organizations/${id}`, newData);

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    deleteOrganization: async (id: string) => {
        try {
            const { data } = await api.delete(`/organizations/${id}`);

            return data
        } catch (error) {
            throw getApiError(error);
        }
    }
}

export const masterApis = {
    //Master apis for menus
    getMenu: async () => {
        try {

            const { data } = await api.get("/master/menus", {
                headers: { 'X-Global-Loader': 'true' }
            });

            return data;

        } catch (error: any) {
            throw getApiError(error);
        }
    },

    createMenu: async (menu: any) => {
        try {

            const { data } = await api.post("/master/menus", menu, {
                withCredentials: true
            });

            return data

        } catch (error) {
            throw getApiError(error);
        }
    },

    getMenuById: async (id: number) => {
        try {
            const { data } = await api.get(`/master/menus/${id}`, {
                withCredentials: true
            });

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    updateMenu: async (id: number, newMenu: any) => {
        try {
            const { data } = await api.put(`/master/menus/${id}`, newMenu, {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    deleteMenu: async (id: number) => {
        try {
            const { data } = await api.delete(`/master/menus/${id}`, {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    //Master apis for plants
    getAllPlants: async () => {
        try {
            const { data } = await api.get("/master/plant", {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    getPlantById: async (id: number) => {
        try {
            const { data } = await api.get(`/master/plant/${id}`, {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    createPlant: async (plant: any) => {
        try {

            const { data } = await api.post("/master/plant", plant, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    updatePlant: async (id: number, newPlant: any) => {
        try {

            const { data } = await api.patch(`/master/plant/${id}`, newPlant, {
                withCredentials: true
            });

            return data

        } catch (error) {
            throw getApiError(error);
        }
    },

    deletePlant: async (id: number) => {
        try {
            const { data } = await api.delete(`/master/plant/${id}`, {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    //Master api plant variants
    getAllPlantVariants: async () => {
        try {
            const { data } = await api.get("/master/plant-variant", {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    getPlantVariantById: async (id: number) => {
        try {
            const { data } = await api.get(`/master/plant-variant/${id}`, {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    createPlantVariant: async (variantData: any) => {
        try {

            const { data } = await api.post("/master/plant-variant", variantData, {
                withCredentials: true
            });

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    updatePlantVariant: async (id: number, newVariant: any) => {
        try {
            const { data } = await api.patch(`/master/plant-variant/${id}`, newVariant, {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    deletePlantVariant: async (id: number) => {
        try {
            const { data } = await api.delete(`/master/plant-variant/${id}`, {
                withCredentials: true
            });

            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    //Categories and sub categories
    getCategories: async () => {
        try {

            const { data } = await api.get("/master/category", {
                withCredentials: true
            });

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    createCategory: async (category: any) => {
        try {

            const { data } = await api.post("/master/category", category, {
                withCredentials: true
            });

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    getCategoryById: async (id: number) => {
        try {

            const { data } = await api.get(`/master/category/${id}`, {
                withCredentials: true
            });

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    updateCategory: async (id: number, category: any) => {
        try {

            const { data } = await api.patch(`/master/category/${id}`, category, {
                withCredentials: true
            });

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    deleteCategory: async (id: string) => {
        try {

            const { data } = await api.delete(`/master/category/${id}`, {
                withCredentials: true
            });

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    getSubCategories: async (categoryId?: number) => {
        try {

            const query = typeof categoryId === "number"
                ? `?categoryId=${categoryId}`
                : "";
            const { data } = await api.get(`/master/dashboard/subcategories${query}`, {
                withCredentials: true
            })

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    createSubCategory: async (subCategory: any) => {
        try {

            const { data } = await api.post("/master/dashboard/subcategories", subCategory, {
                withCredentials: true
            });

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    updateSubCategory: async (id: number, subCategory: any) => {
        try {

            const { data } = await api.put(`/master/dashboard/subcategories/${id}`, subCategory, {
                withCredentials: true
            });

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    deleteSubCategory: async (id: number) => {
        try {

            const { data } = await api.delete(`/master/dashboard/subcategories/${id}`, {
                withCredentials: true
            });

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    }
}

export const inventoryApis = {

    getAllStocks: async () => {
        try {

            const { data } = await api.get("/inventory", {
                withCredentials: true
            });

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    getStockById: async (id: number) => {
        try {
            const { data } = await api.get(`inventory/${id}`, {
                withCredentials: true
            });

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },
    addStocks: async (stockData: any) => {
        try {

            const { data } = await api.post("inventory/add-stock", stockData, {
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    updateStock: async (stockData: any) => {
        try {
            const { data } = await api.put("inventory/stock", stockData, {
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    removeStock: async (stockData: any) => {
        try {

            const { data } = await api.post("inventory/remove-stock", stockData, {
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    deadStock: async (stockData: any) => {
        try {

            const { data } = await api.post("inventory/dead-stock", stockData, {
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    deleteStock: async (variantId: number) => {
        try {
            const { data } = await api.delete(`/inventory/${variantId}`, {
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    }
}

export const plansApi = {
    getAllPlans: async () => {
        try {
            const { data } = await api.get("/plans");

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    createNewPlan: async (planData: any) => {
        try {

            const { data } = api.post("/plans", planData, {
                withCredentials: true
            })

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    getEveryPlans: async () => {
        try {
            const { data } = await api.get("/plans/all");

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    updateAPlan: async (id: string, updatedPlan: any) => {
        try {
            const { data } = await api.patch(`/plans/${id}`, updatedPlan, {
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    deleteAPlan: async (id: string) => {
        try {
            const { data } = await api.delete(`/plans/${id}`,
                {
                    withCredentials: true
                }
            )

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    }
}

export const qrApis = {

    generateQrCode: async (id: number) => {
        try {
            const { data } = await api.post(`/qr/generate/${id}`, null, {
                withCredentials: true
            })
            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    getQrCode: async (code: string) => {
        try {
            const { data } = await api.get(`/qr/${code}`, {
                withCredentials: true
            })
            return data
        } catch (error) {
            throw getApiError(error);
        }
    },

    getQrAnalytics: async (days: number = 30) => {
        try {
            const { data } = await api.get(`/qr/analytics/summary?days=${days}`, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    generateInBulk: async (categoryId: number, subcategoryId: number) => {
        try {
            const { data } = await api.post(`/qr/generate/bulk?categoryId=${categoryId}&subcategoryId=${subcategoryId}`, null, {
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    }
}


export const paymentApis = {
    getAllPayments: async () => {
        try {
            const { data } = await api.get("/payments", {
                withCredentials: true
            });
            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    getPaymentById: async (id: number) => {
        try {
            const { data } = await api.get(`/payments/${id}`, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    updatePaymentStatus: async (id: number, status: string) => {
        try {
            const { data } = await api.patch(`/payments/${id}/status`, { status }, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            throw getApiError(error);
        }
    }
}

export const reportApis = {
    getSalesReports: async (type?: string) => {
        try {
            const { data } = await api.get(`/reports/sales?type=${type}`, {
                withCredentials: true
            });

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },
    getTopPlants: async (limit?: number) => {
        try {
            const { data } = await api.get(`/reports/top-plants?limit=${limit}`, {
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    getInventoryValue: async () => {
        try {
            const { data } = await api.get('/reports/inventory-value', {
                withCredentials: true
            });

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    getLogReportFiltered: async (filters?: {
        method?: string;
        userId?: string;
        status?: string;
        endpoint?: string;
        from?: string;
        to?: string;
        page?: string | number;
        limit?: string | number;
    }) => {
        try {
            // Clean filters to remove undefined, null or empty string values
            const cleanFilters = filters ? Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== "")
            ) : {};

            const { data } = await api.get("/log-report", {
                params: cleanFilters,
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    getLogReports: async () => {
        try {

            const { data } = await api.get("/log-report/summary", {
                withCredentials: true
            })

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    }
}

export const ordersApis = {
    getAllOrders: async () => {
        try {
            const { data } = await api.get("/orders", {
                withCredentials: true
            });
            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    getOrderById: async (id: number) => {
        try {
            const { data } = await api.get(`/orders/${id}`, {
                withCredentials: true
            });
            return data;
        } catch (error) {
            throw getApiError(error);
        }
    }
}

export const subscriptionApis = {
    getActiveSubscription: async () => {
        try {
            const { data } = await api.get("/subscriptions/me", {
                withCredentials: true
            })

            return data;
        } catch (error) {
            throw getApiError(error);
        }
    },

    subscribe: async (planId: string, paymentMethod: string, paymentReference: string) => {
        try {
            const { data } = await api.post("/subscription/subscribe", {
                planId, paymentMethod, paymentReference
            }, {
                withCredentials: true
            })

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },

    upgrade: async (planId: string, paymentMethod: string, paymentReference: string) => {
        try {
            const { data } = await api.post("/subscription/upgrade", {
                planId, paymentMethod, paymentReference
            }, {
                withCredentials: true
            })

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },
    cancel: async () => {
        try {
            const { data } = await api.post("/subscription/cancel", {}, {
                withCredentials: true
            })

            return data;

        } catch (error) {
            throw getApiError(error);
        }
    },
}
