import * as api from './api';

// --- Products ---

export const fetchProducts = async () => {
    try {
        return await api.fetchProducts();
    } catch (error) {
        console.error("Error fetching products: ", error);
        return [];
    }
};

export const fetchProductById = async (productId) => {
    try {
        return await api.fetchProductById(productId);
    } catch (error) {
        console.error("Error fetching product: ", error);
        return null;
    }
};

// --- Users ---

export const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;
    try {
        // Sync user to SQL database
        await api.syncUser(user);
    } catch (error) {
        console.error("Error syncing user profile", error);
    }
};

export const getUserProfile = async (uid) => {
    // Currently API doesn't support fetching full profile including address/phone details
    // For now, we return basic info or null.
    // TODO: Implement GET /api/users/:id
    return null;
};

export const updateUserProfile = async (uid, data) => {
    // TODO: Implement PUT /api/users/:id
    console.warn("updateUserProfile not implemented in SQL backend yet");
};

// --- Orders ---

export const createOrder = async (orderData) => {
    try {
        const result = await api.createOrder({
            user_id: orderData.userId,
            items: orderData.items,
            total_amount: orderData.total
        });
        return result.orderId;
    } catch (error) {
        console.error("Error creating order", error);
        throw error;
    }
};

export const getUserOrders = async (uid) => {
    try {
        return await api.fetchUserOrders(uid);
    } catch (error) {
        console.error("Error fetching user orders", error);
        return [];
    }
};
