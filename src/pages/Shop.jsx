import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    // Extract unique categories from products
    const categories = ['All', ...new Set(products.map(p => p.category))];

    const filteredProducts = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-primary antialiased min-h-screen">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-neutral-800">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link className="flex items-center gap-2" to="/">
                        <div className="size-8 text-primary dark:text-white">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tighter dark:text-white uppercase">Luxe</h1>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.1em] uppercase">
                        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
                        <Link className="text-primary dark:text-white" to="/shop">Shop</Link>
                        <Link className="hover:text-primary transition-colors" to="/journal">Journal</Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link className="hover:text-primary transition-colors" to="/profile">
                            <span className="material-symbols-outlined text-xl">person</span>
                        </Link>
                        <Link className="hover:text-primary transition-colors relative" to="/cart">
                            <span className="material-symbols-outlined text-xl">shopping_bag</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 block mb-4">The Collection</span>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary dark:text-white leading-tight">
                            Elevated Essentials <br />For Modern Living
                        </h2>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                                    ? 'bg-primary text-white border-primary dark:bg-white dark:text-primary dark:border-white'
                                    : 'border-neutral-200 text-neutral-500 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                        {filteredProducts.map((product) => (
                            <Link key={product.id} to={`/product/${product.id}`} className="group block">
                                <div className="aspect-[3/4] overflow-hidden bg-neutral-100 mb-6 relative">
                                    <div
                                        className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url("${product.imageUrl || product.image}")` }}
                                    ></div>
                                    {!product.stock && (
                                        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                            Sold Out
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-serif text-primary dark:text-white mb-1 group-hover:underline underline-offset-4 decoration-1">
                                            {product.title || product.name}
                                        </h3>
                                        <p className="text-xs text-neutral-500 uppercase tracking-widest">{product.category}</p>
                                    </div>
                                    <span className="text-sm font-medium">${product.price}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-primary text-white py-24 px-6 mt-20">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div className="size-8">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44C7.25611 4 11.2727 44Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                            Luxury essentials designed for the modern individual. Crafted with purpose, worn with confidence.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
