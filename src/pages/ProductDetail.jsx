import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProductById } from '../services/api';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, getCartCount } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('M');

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const data = await fetchProductById(id);
                if (data) {
                    setProduct(data);
                    // Set default size if available, or stay as M
                    if (data.sizes && data.sizes.length > 0) {
                        setSelectedSize(data.sizes[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <Link to="/shop" className="text-primary underline">Return to Shop</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!product.stock || product.stock <= 0) {
            alert('Sorry, this item is out of stock.');
            return;
        }
        // Normalize product data for cart (ensure name/image are consistent if schema differs)
        const cartItem = {
            ...product,
            name: product.title || product.name,
            image: product.imageUrl || product.image
        };
        addToCart(cartItem, selectedSize);
        alert('Added to cart!');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-primary dark:text-white antialiased">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link className="flex items-center gap-2" to="/">
                            <span className="text-2xl font-bold tracking-tighter">LUXE</span>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
                            <Link className="hover:text-gold-accent transition-colors" to="/shop">New Arrivals</Link>
                            <Link className="hover:text-gold-accent transition-colors" to="/shop">Collections</Link>
                            <Link className="hover:text-gold-accent transition-colors" to="/shop">Men</Link>
                            <Link className="hover:text-gold-accent transition-colors" to="/shop">Women</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center border-b border-neutral-300 dark:border-neutral-700 pb-1">
                            <span className="material-symbols-outlined text-xl opacity-60">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-sm w-32 placeholder:text-neutral-400 outline-none" placeholder="Search" type="text" />
                        </div>
                        <Link to="/cart" className="relative hover:text-gold-accent transition-colors">
                            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary dark:bg-white text-white dark:text-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                        <Link to="/profile" className="hover:text-gold-accent transition-colors">
                            <span className="material-symbols-outlined text-2xl">person</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 mb-12">
                    <Link className="hover:text-primary transition-colors" to="/">Home</Link>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <Link className="hover:text-primary transition-colors" to="/shop">Shop</Link>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <Link className="hover:text-primary transition-colors" to="/shop">{product.category}</Link>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                    <span className="text-primary dark:text-white font-bold">{product.title || product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Side: Image Gallery */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="aspect-[3/4] w-full bg-neutral-100 overflow-hidden rounded-lg">
                            <div className="w-full h-full bg-center bg-no-repeat bg-cover" data-alt={product.title || product.name} style={{ backgroundImage: `url("${product.imageUrl || product.image}")` }}>
                            </div>
                        </div>
                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-neutral-200 rounded-md cursor-pointer ring-1 ring-primary/20 hover:ring-primary transition-all overflow-hidden">
                                    <div className="w-full h-full bg-center bg-cover" data-alt={`${product.title || product.name} view ${i}`} style={{ backgroundImage: `url("${product.imageUrl || product.image}")` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Product Info */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32 space-y-8">
                            <div>
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 block mb-3">{product.category} Collection</span>
                                <h1 className="font-serif text-5xl lg:text-6xl text-primary dark:text-white leading-tight mb-4">
                                    {product.title || product.name}
                                </h1>
                                <p className="text-2xl font-medium text-gold-accent">${(product.price).toLocaleString()}.00</p>
                                {/* Stock Indicator */}
                                {product.stock <= 0 && (
                                    <p className="text-red-500 text-sm font-bold uppercase tracking-widest mt-2">Out of Stock</p>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold uppercase tracking-widest">Select Size</span>
                                    <Link className="text-xs underline text-neutral-500 hover:text-primary transition-colors" to="#">Size Guide</Link>
                                </div>
                                <div className="flex gap-4">
                                    {/* Fallback to S,M,L,XL if sizes not in db */}
                                    {(product.sizes || ['S', 'M', 'L', 'XL']).map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            disabled={product.stock <= 0}
                                            className={`size-12 rounded-full border flex items-center justify-center text-sm font-bold transition-all 
                                                ${selectedSize === size
                                                    ? 'border-primary bg-primary text-white dark:border-white dark:bg-white dark:text-primary'
                                                    : 'border-neutral-300 hover:border-primary'}
                                                ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    className={`w-full py-5 rounded-lg flex items-center justify-center gap-2 font-bold tracking-[0.2em] text-sm uppercase shadow-xl shadow-black/10 transition-all
                                        ${product.stock > 0
                                            ? 'bg-primary text-white hover:bg-neutral-800 dark:bg-white dark:text-primary dark:hover:bg-neutral-200'
                                            : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'}
                                    `}
                                >
                                    <span className="material-symbols-outlined">shopping_bag</span>
                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <Link to="/checkout" className="block w-full text-center py-5 border border-primary dark:border-white text-primary dark:text-white font-bold uppercase tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-none">
                                    Express Checkout
                                </Link>
                            </div>

                            {/* Accordion Info */}
                            <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800 pt-2">
                                <details className="group py-4" open>
                                    <summary className="flex justify-between items-center cursor-pointer list-none">
                                        <span className="text-sm font-bold uppercase tracking-widest">Product Description</span>
                                        <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                                    </summary>
                                    <div className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                                        {product.description}
                                    </div>
                                </details>
                                <details className="group py-4">
                                    <summary className="flex justify-between items-center cursor-pointer list-none">
                                        <span className="text-sm font-bold uppercase tracking-widest">Composition & Care</span>
                                        <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                                    </summary>
                                    <div className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                                        {product.details}
                                    </div>
                                </details>
                                <details className="group py-4">
                                    <summary className="flex justify-between items-center cursor-pointer list-none">
                                        <span className="text-sm font-bold uppercase tracking-widest">Shipping & Returns</span>
                                        <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                                    </summary>
                                    <div className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                                        Complementary standard shipping on all orders over $300. 14-day returns policy applies.
                                    </div>
                                </details>
                            </div>

                            <div className="flex gap-8 pt-4 opacity-70">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">workspace_premium</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Premium Quality</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">eco</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Eco-Conscious</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">local_shipping</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Fast Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <section className="mt-32 pb-20">
                    <h2 className="font-serif text-3xl mb-12">Complete the Look</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Product 1 */}
                        <Link to="/product/7" className="group cursor-pointer block">
                            <div className="aspect-[3/4] overflow-hidden bg-neutral-100 rounded-lg mb-4">
                                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" data-alt="Fashion accessory to complete the look" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAiFmdIR-wt1obM5rEmZpGZxJVVIhbsOk120ESw1277SfCrSxWCEx7YCcHcXN3-Y3xem0piME3kRSqGw8UCLA3h2JLZVEzr96d7ZF0ie6x9m_xvv0mnVpcRRk9UY52-iTrhCBsu9zkUucU_OHhHU7hBdz-nTkK8aq3C0C-dv2hD_l2PtANLCOM82hWqeNuQzQqfpDAFoIZQJXTcPvgKydJRsSP04uHAQZ8m8fDSuwPpRgnavApKWBhj5HuGYOohCvpqX1ClWdGOAy4F")' }}></div>
                            </div>
                            <h3 className="text-sm font-bold uppercase mb-1">Tailored Wool Trousers</h3>
                            <p className="text-sm text-neutral-500">$320.00</p>
                        </Link>
                        {/* Product 2 */}
                        <Link to="/product/8" className="group cursor-pointer block">
                            <div className="aspect-[3/4] overflow-hidden bg-neutral-100 rounded-lg mb-4">
                                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" data-alt="Luxury shoes accessory" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1UGvJXSaaWIWGKeT_0twfITvSQu13RiWRvuq855FGIrk34giT5tkmQa7CDmvh5qMtvFMWCclhbWnBXDAepf7QdhqyW3fGA5-CrKLrCq33xxeTiILC2ZkipxazB7VeZ398y8d45OrRVvLxObNbisIo_Eu2z5hgX4fylbD0DRMupwx7NpJrcs1R4r9kkreisoK4xqGcDCR1l3s90JvUTpfwmST-eiU3pUx922rq8jiRQvEHjSSRG7gCyj5-RJI8WU3ucN8zUuPa9tFq")' }}></div>
                            </div>
                            <h3 className="text-sm font-bold uppercase mb-1">Calfskin Pointed Mules</h3>
                            <p className="text-sm text-neutral-500">$580.00</p>
                        </Link>
                        {/* Product 3 */}
                        <Link to="/product/9" className="group cursor-pointer block">
                            <div className="aspect-[3/4] overflow-hidden bg-neutral-100 rounded-lg mb-4">
                                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" data-alt="Luxury leather handbag" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVKqOOTAFhl-WmG9mZ9ZDbKYtfJF4qSduhPRCnSDtEE2-0vuQrzeWXzrwOX0fKr-S8N2_49WbDdW3TR3BubENjhhrrTRtxD7mPRE6xlEoTyOyxUOuviUHppmLumPbu4BhY4-27uN7qiggUDQG6x48wrq21O8Cafis9WSrfQlPMqZfTJuA3x0uvem3PxVyG6yqBa4s5NuGCcKvGdxY0WCajHSc2kpq5P74ZdAG6sSBC4WDMZZL5O39Tqt2YqzaLWUlNi5gg_h5PJgXF")' }}></div>
                            </div>
                            <h3 className="text-sm font-bold uppercase mb-1">Structured Leather Bag</h3>
                            <p className="text-sm text-neutral-500">$1,200.00</p>
                        </Link>
                        {/* Product 4 */}
                        <Link to="/product/10" className="group cursor-pointer block">
                            <div className="aspect-[3/4] overflow-hidden bg-neutral-100 rounded-lg mb-4">
                                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" data-alt="Fashion sunglasses" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNIazEthqysLxh6AwnM5jwt7cLSajS-YYMbiuHjWsiodzqclBrK6k803QkqZlYZaJECK3BD73ViFfwgG7cRchiJRnY8Lef7LkZFf-h6Y7-ntLZ9rOZtP4BqNSkYL0JiNBxdhSW1ptNjE6_5QmDa4k4cr2o_9TA-A2ocR1EoNQeiZCz0-aXkg47PhTVIKnJ5KxFOLoR7Cn5VhOHVviYW91eptrBFdMSLn-h6c_C5qkgxDOYdkZ91XHmW9KJFbq4WTNl36-9YkdsBux1")' }}></div>
                            </div>
                            <h3 className="text-sm font-bold uppercase mb-1">Oversized Square Shades</h3>
                            <p className="text-sm text-neutral-500">$295.00</p>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-primary text-white py-16 px-12 mt-20">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div>
                        <h4 className="text-lg font-bold mb-6">LUXE</h4>
                        <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">Elevating the everyday through curated minimalist design and exceptional quality.</p>
                    </div>
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-widest mb-6">Support</h5>
                        <ul className="space-y-4 text-sm text-neutral-400">
                            <li><Link className="hover:text-white transition-colors" to="#">Contact Us</Link></li>
                            <li><Link className="hover:text-white transition-colors" to="#">Shipping & Returns</Link></li>
                            <li><Link className="hover:text-white transition-colors" to="#">FAQ</Link></li>
                            <li><Link className="hover:text-white transition-colors" to="#">Size Guide</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-widest mb-6">Company</h5>
                        <ul className="space-y-4 text-sm text-neutral-400">
                            <li><Link className="hover:text-white transition-colors" to="#">About Us</Link></li>
                            <li><Link className="hover:text-white transition-colors" to="#">Sustainability</Link></li>
                            <li><Link className="hover:text-white transition-colors" to="#">Stores</Link></li>
                            <li><Link className="hover:text-white transition-colors" to="#">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-xs font-bold uppercase tracking-widest mb-6">Newsletter</h5>
                        <div className="flex border-b border-neutral-700 pb-2">
                            <input className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 placeholder:text-neutral-600 outline-none" placeholder="Email address" type="email" />
                            <button className="material-symbols-outlined">arrow_forward</button>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <span className="material-symbols-outlined text-neutral-400 cursor-pointer hover:text-white">public</span>
                            <span className="material-symbols-outlined text-neutral-400 cursor-pointer hover:text-white">share</span>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-neutral-800 text-[10px] text-neutral-600 flex justify-between uppercase tracking-widest">
                    <span>© 2024 LUXE ATELIER. ALL RIGHTS RESERVED.</span>
                    <div className="flex gap-6">
                        <Link to="#">Privacy Policy</Link>
                        <Link to="#">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
