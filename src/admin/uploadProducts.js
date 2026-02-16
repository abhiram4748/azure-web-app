import { products } from '../data/products.js';

const API_URL = import.meta.env.VITE_API_URL;

const uploadProducts = async () => {
    console.log("Starting product upload to SQL Database...");

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    description: product.description,
                    stock: 20 // Default stock
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to upload ${product.name}: ${response.statusText}`);
            }

            console.log(`Uploaded: ${product.name}`);
            successCount++;
        } catch (error) {
            console.error(error.message);
            errorCount++;
        }
    }

    console.log(`Upload complete! Success: ${successCount}, Failed: ${errorCount}`);
};

export default uploadProducts;
