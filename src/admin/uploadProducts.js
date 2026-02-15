import { db } from '../firebase.js';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { products } from '../data/products.js';

const uploadProducts = async () => {
    console.log("Starting product upload...");
    const batch = writeBatch(db);

    products.forEach((product) => {
        const productRef = doc(db, "products", product.id.toString());
        const newProduct = {
            title: product.name,
            price: product.price,
            imageUrl: product.image,
            category: product.category,
            description: product.description,
            stock: 20,
            isActive: true,
            createdAt: new Date(), // using client date for seeding, serverTimestamp better for real apps but ok here
            // keep id for reference if needed, though docId is the main id
            id: product.id
        };
        batch.set(productRef, newProduct);
    });

    try {
        await batch.commit();
        console.log("Successfully uploaded all products to Firestore!");
    } catch (error) {
        console.error("Error uploading products: ", error);
    }
};

// Execute if run directly (though Vite makes this tricky, we might need a button or just call it temporarily from main)
export default uploadProducts;
