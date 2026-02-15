import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
    const subtotal = getCartTotal();
    const tax = subtotal * 0.08; // Assuming 8% tax
    const total = subtotal + tax;

    return (
        <div className="bg-background-light dark:bg-background-dark text-primary dark:text-white transition-colors duration-300">
            <div className="layout-container flex h-full grow flex-col min-h-screen">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-6 md:px-10 py-4 sticky top-0 z-50">
                    <div className="flex items-center gap-12">
                        <Link className="flex items-center gap-2" to="/">
                            <div className="size-6 text-primary dark:text-white">
                                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C11.2727 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-black leading-tight tracking-tighter">LUXE</h2>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-8 uppercase text-[11px] tracking-[0.2em] font-medium">
                            <Link className="hover:opacity-60 transition-opacity" to="/shop">New Arrivals</Link>
                            <Link className="hover:opacity-60 transition-opacity" to="/shop">Collections</Link>
                            <Link className="hover:opacity-60 transition-opacity" to="/shop">Men</Link>
                            <Link className="hover:opacity-60 transition-opacity" to="/shop">Women</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center border-b border-neutral-300 dark:border-neutral-700 pb-1">
                            <span className="material-symbols-outlined opacity-50">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-[10px] tracking-widest placeholder:text-neutral-400 w-32 outline-none" placeholder="SEARCH" type="text" />
                        </div>
                        <div className="flex gap-4">
                            <Link to="/profile" className="hover:opacity-60 transition-opacity">
                                <span className="material-symbols-outlined">person</span>
                            </Link>
                            <button className="hover:opacity-60 transition-opacity relative">
                                <span className="material-symbols-outlined">shopping_bag</span>
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white dark:bg-white dark:text-black text-[8px] rounded-full size-3.5 flex items-center justify-center font-bold">
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-12 md:py-20">
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-light tracking-tight text-primary dark:text-white mb-2 uppercase">Your Shopping Bag</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm uppercase tracking-widest">{getCartCount()} Items selected</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Shopping Items List */}
                        <div className="flex-grow space-y-8">
                            {cart.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                                    <p className="text-xl mb-4">Your bag is empty.</p>
                                    <Link to="/shop" className="text-sm font-bold uppercase tracking-widest underline underline-offset-4 hover:text-accent-gold transition-colors">Start Shopping</Link>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
                                        <div className="w-32 h-44 md:w-40 md:h-52 bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex-shrink-0">
                                            <img className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-500" data-alt={item.name} src={item.image} />
                                        </div>
                                        <div className="flex flex-col justify-between py-1 flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">LUXE MAINLINE</h3>
                                                    <p className="text-lg font-medium leading-tight">{item.name}</p>
                                                    <div className="mt-2 space-y-1 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                                        <p>Size: {item.selectedSize}</p>
                                                    </div>
                                                </div>
                                                <p className="text-lg font-semibold">${item.price}</p>
                                            </div>
                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                                        className="p-1 hover:text-neutral-400"
                                                    >
                                                        <span className="material-symbols-outlined !text-sm">remove</span>
                                                    </button>
                                                    <span className="mx-4 text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                                        className="p-1 hover:text-neutral-400"
                                                    >
                                                        <span className="material-symbols-outlined !text-sm">add</span>
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                                                    className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-red-500 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="w-full lg:w-[400px]">
                            <div className="bg-white dark:bg-neutral-900 p-8 sticky top-28 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                                <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 border-b border-neutral-100 dark:border-neutral-800 pb-4">Order Summary</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm uppercase tracking-widest opacity-70">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm uppercase tracking-widest opacity-70">
                                        <span>Estimated Shipping</span>
                                        <span className="text-green-600 dark:text-green-400">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between text-sm uppercase tracking-widest opacity-70">
                                        <span>Estimated Tax</span>
                                        <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xl font-bold uppercase tracking-widest pt-6 border-t border-neutral-100 dark:border-neutral-800 mb-10">
                                    <span>Total</span>
                                    <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <Link to="/checkout" className="block w-full text-center bg-primary text-white dark:bg-white dark:text-black py-5 text-xs font-bold uppercase tracking-[0.3em] hover:opacity-90 transition-opacity mb-4">
                                    Proceed to Checkout
                                </Link>
                                <div className="flex flex-col gap-4 mt-8 opacity-60">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined !text-lg">lock</span>
                                        <span className="text-[10px] uppercase tracking-widest">Secure Checkout Guaranteed</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined !text-lg">local_shipping</span>
                                        <span className="text-[10px] uppercase tracking-widest">Free Express Shipping on $500+</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined !text-lg">replay</span>
                                        <span className="text-[10px] uppercase tracking-widest">30-Day Effortless Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="mt-auto py-10 px-10 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-8">
                            <p className="text-[10px] uppercase tracking-widest opacity-50">© 2024 LUXE Premium Brand</p>
                            <Link className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity" to="#">Privacy Policy</Link>
                            <Link className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity" to="#">Terms of Service</Link>
                        </div>
                        <div className="flex gap-6 opacity-50">
                            <Link className="hover:opacity-100 transition-opacity" to="#"><span className="material-symbols-outlined">public</span></Link>
                            <Link className="hover:opacity-100 transition-opacity" to="#"><span className="material-symbols-outlined">mail</span></Link>
                            <Link className="hover:opacity-100 transition-opacity" to="#"><span className="material-symbols-outlined">chat</span></Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
