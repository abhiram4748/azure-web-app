const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
console.warn("API_URL configured:", API_URL);

// Mock Data for Fallback
const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Classic Leather Tote",
        description: "A timeless leather tote bag for everyday use.",
        price: 195.00,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVKqOOTAFhl-WmG9mZ9ZDbKYtfJF4qSduhPRCnSDtEE2-0vuQrzeWXzrwOX0fKr-S8N2_49WbDdW3TR3BubENjhhrrTRtxD7mPRE6xlEoTyOyxUOuviUHppmLumPbu4BhY4-27uN7qiggUDQG6x48wrq21O8Cafis9WSrfQlPMqZfTJuA3x0uvem3PxVyG6yqBa4s5NuGCcKvGdxY0WCajHSc2kpq5P74ZdAG6sSBC4WDMZZL5O39Tqt2YqzaLWUlNi5gg_h5PJgXF",
        category: "Bags",
        stock: 15,
        sizes: ["One Size"]
    },
    {
        id: 2,
        name: "Wool Blend Coat",
        description: "Sophisticated wool blend coat for colder days.",
        price: 350.00,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiFmdIR-wt1obM5rEmZpGZxJVVIhbsOk120ESw1277SfCrSxWCEx7YCcHcXN3-Y3xem0piME3kRSqGw8UCLA3h2JLZVEzr96d7ZF0ie6x9m_xvv0mnVpcRRk9UY52-iTrhCBsu9zkUucU_OHhHU7hBdz-nTkK8aq3C0C-dv2hD_l2PtANLCOM82hWqeNuQzQqfpDAFoIZQJXTcPvgKydJRsSP04uHAQZ8m8fDSuwPpRgnavApKWBhj5HuGYOohCvpqX1ClWdGOAy4F",
        category: "Outerwear",
        stock: 8,
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 3,
        name: "Silk Scarf",
        description: "Elegant silk scarf with a unique print.",
        price: 85.00,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNIazEthqysLxh6AwnM5jwt7cLSajS-YYMbiuHjWsiodzqclBrK6k803QkqZlYZaJECK3BD73ViFfwgG7cRchiJRnY8Lef7LkZFf-h6Y7-ntLZ9rOZtP4BqNSkYL0JiNBxdhSW1ptNjE6_5QmDa4k4cr2o_9TA-A2ocR1EoNQeiZCz0-aXkg47PhTVIKnJ5KxFOLoR7Cn5VhOHVviYW91eptrBFdMSLn-h6c_C5qkgxDOYdkZ91XHmW9KJFbq4WTNl36-9YkdsBux1",
        category: "Accessories",
        stock: 20,
        sizes: ["One Size"]
    },
    {
        id: 4,
        name: "Leather Ankle Boots",
        description: "Chic leather boots that go with everything.",
        price: 220.00,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1UGvJXSaaWIWGKeT_0twfITvSQu13RiWRvuq855FGIrk34giT5tkmQa7CDmvh5qMtvFMWCclhbWnBXDAepf7QdhqyW3fGA5-CrKLrCq33xxeTiILC2ZkipxazB7VeZ398y8d45OrRVvLxObNbisIo_Eu2z5hgX4fylbD0DRMupwx7NpJrcs1R4r9kkreisoK4xqGcDCR1l3s90JvUTpfwmST-eiU3pUx922rq8jiRQvEHjSSRG7gCyj5-RJI8WU3ucN8zUuPa9tFq",
        category: "Shoes",
        stock: 10,
        sizes: ["36", "37", "38", "39", "40"]
    },
    {
        id: 5,
        name: "Minimalist Watch",
        description: "A sleek watch with a minimalist design.",
        price: 150.00,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqwT5tqC0Jg-iWlW9YvVbHlT0xJ5gXk0J5gXk0J5gXk0J5gXk0J5gXk0J5gXk0J5gXk0J5gXk0J5gXk0J5gXk0J5gXk0J5gXk0",
        category: "Accessories",
        stock: 5,
        sizes: ["One Size"]

    }
];

// Helper to prevent hanging requests
const fetchWithTimeout = async (url, options = {}, timeout = 2000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

export const fetchProducts = async () => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        return data.map(p => ({
            ...p,
            image: p.image_url // Map SQL column to frontend expectation
        }));
    } catch (error) {
        console.warn("API Error: Using mock products", error);
        return MOCK_PRODUCTS;
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        return {
            ...data,
            image: data.image_url
        };
    } catch (error) {
        console.warn(`API Error: Finding mock product with id ${id}`, error);
        // Ensure type matching for ID (API might utilize strings, mock uses numbers)
        const product = MOCK_PRODUCTS.find(p => p.id == id);
        return product || null;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        }, 5000); // Higher timeout for mutations
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    } catch (error) {
        console.warn("API Error: Simulating order creation", error);
        return { message: "Order created successfully (Mock)", orderId: Math.floor(Math.random() * 1000) };
    }
};

export const fetchUserOrders = async (userId) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/orders?user_id=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    } catch (error) {
        console.warn("API Error: Returning empty mock orders", error);
        return [];
    }
};

export const syncUser = async (user) => {
    try {
        const response = await fetchWithTimeout(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: user.uid,
                email: user.email,
                name: user.displayName
            }),
        });
        if (!response.ok) throw new Error('Failed to sync user');
        return response.json();
    } catch (error) {
        console.warn("API Error: Simulating user sync", error);
        return { message: "User synced (Mock)" };
    }
};
