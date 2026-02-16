const API_URL = import.meta.env.VITE_API_URL;

export const fetchProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.map(p => ({
        ...p,
        image: p.image_url // Map SQL column to frontend expectation
    }));
};

export const fetchProductById = async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    return {
        ...data,
        image: data.image_url
    };
};

export const createOrder = async (orderData) => {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
};

export const fetchUserOrders = async (userId) => {
    const response = await fetch(`${API_URL}/orders?user_id=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
};

export const syncUser = async (user) => {
    const response = await fetch(`${API_URL}/users`, {
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
};
