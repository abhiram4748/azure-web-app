import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, getUserProfile } from '../services/firestore';
import { auth } from '../firebase';

export default function Checkout() {
    const { cart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const subtotal = getCartTotal();
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    const [paymentMethod, setPaymentMethod] = useState('card');

    // User state for autofill
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Here we could autofill the form with profile data
            }
        });
        return () => unsubscribe();
    }, []);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!user) {
            alert("Please log in to place an order.");
            navigate('/profile');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                userId: user.uid,
                items: cart,
                totalAmount: total,
                // In a real app, collect actual form data here
                shippingAddress: {
                    name: "Test User", // Replace with state from form inputs
                    email: user.email,
                    address: "123 Fashion St",
                }
            };

            await createOrder(orderData);

            clearCart();
            alert("Order placed successfully! Thank you for shopping with LUXE.");
            navigate('/profile');
        } catch (error) {
            console.error("Order failed", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-primary antialiased">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-neutral-800">
                <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link className="flex items-center gap-2" to="/">
                        <div className="size-6 text-primary dark:text-white">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tighter dark:text-white uppercase">Luxe</h1>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link className="text-xs font-semibold tracking-widest text-neutral-500 hover:text-primary transition-colors flex items-center gap-1 uppercase" to="/cart">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Bag
                        </Link>
                        <div className="h-4 w-px bg-neutral-200"></div>
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                            <span className="material-symbols-outlined text-base">lock</span>
                            SECURE CHECKOUT
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Checkout Form */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* Progress Stepper */}
                        <div className="flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400">
                            <span className="text-primary">01 Information</span>
                            <span className="w-8 h-px bg-neutral-200"></span>
                            <span>02 Shipping</span>
                            <span className="w-8 h-px bg-neutral-200"></span>
                            <span>03 Payment</span>
                        </div>

                        {/* Section: Shipping Address */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold tracking-tight">Shipping Address</h2>
                                <p className="text-sm text-neutral-500">Already have an account? <Link className="text-primary underline underline-offset-4" to="/profile">Log in</Link></p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="floating-label-group col-span-2 relative">
                                    <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="email" placeholder="Email Address" type="text" />
                                    <label htmlFor="email" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">Email Address</label>
                                </div>
                                <div className="floating-label-group relative">
                                    <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="fname" placeholder="First Name" type="text" />
                                    <label htmlFor="fname" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">First Name</label>
                                </div>
                                <div className="floating-label-group relative">
                                    <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="lname" placeholder="Last Name" type="text" />
                                    <label htmlFor="lname" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">Last Name</label>
                                </div>
                                <div className="floating-label-group col-span-2 relative">
                                    <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="address" placeholder="Address" type="text" />
                                    <label htmlFor="address" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">Address</label>
                                </div>
                                <div className="floating-label-group col-span-2 relative">
                                    <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="apartment" placeholder="Apartment, suite, etc. (optional)" type="text" />
                                    <label htmlFor="apartment" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">Apartment, suite, etc. (optional)</label>
                                </div>
                                <div className="floating-label-group relative">
                                    <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="city" placeholder="City" type="text" />
                                    <label htmlFor="city" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">City</label>
                                </div>
                                <div className="floating-label-group relative">
                                    <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="zip" placeholder="Postal Code" type="text" />
                                    <label htmlFor="zip" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">Postal Code</label>
                                </div>
                            </div>
                        </section>

                        {/* Section: Shipping Method */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-semibold tracking-tight">Delivery Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer bg-white border-primary border-opacity-100 ring-1 ring-primary transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="size-4 rounded-full border-4 border-primary"></div>
                                        <div>
                                            <p className="text-sm font-semibold">Standard Shipping</p>
                                            <p className="text-xs text-neutral-500">3-5 business days</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">Free</p>
                                </label>
                                <label className="flex items-center justify-between p-4 border rounded-lg border-neutral-200 cursor-pointer bg-white hover:border-neutral-300 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="size-4 rounded-full border border-neutral-300"></div>
                                        <div>
                                            <p className="text-sm font-semibold text-neutral-600">Express Delivery</p>
                                            <p className="text-xs text-neutral-500">1-2 business days</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium">$25.00</p>
                                </label>
                            </div>
                        </section>

                        {/* Section: Payment */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-semibold tracking-tight">Payment Method</h2>

                            {/* Payment Method Selector */}
                            <div className="grid grid-cols-4 gap-3">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex items-center justify-center h-14 rounded-lg border transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary dark:border-white dark:ring-white dark:bg-white/10' : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600'}`}
                                    aria-label="Pay with Card"
                                >
                                    <span className="material-symbols-outlined text-2xl text-primary dark:text-white">credit_card</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`flex items-center justify-center h-14 rounded-lg border transition-all ${paymentMethod === 'paypal' ? 'border-[#003087] bg-[#003087]/5 ring-1 ring-[#003087] dark:border-blue-400 dark:ring-blue-400 dark:bg-blue-400/10' : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600'}`}
                                    aria-label="Pay with PayPal"
                                >
                                    <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-5" />
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('apple')}
                                    className={`flex items-center justify-center h-14 rounded-lg border transition-all ${paymentMethod === 'apple' ? 'border-black bg-black/5 ring-1 ring-black dark:border-white dark:ring-white dark:bg-white/10' : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600'}`}
                                    aria-label="Pay with Apple Pay"
                                >
                                    <svg viewBox="0 0 384 512" fill="currentColor" height="24" className="text-black dark:text-white">
                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('google')}
                                    className={`flex items-center justify-center h-14 rounded-lg border transition-all ${paymentMethod === 'google' ? 'border-neutral-500 bg-neutral-100 ring-1 ring-neutral-500 dark:border-neutral-400 dark:ring-neutral-400 dark:bg-neutral-800' : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600'}`}
                                    aria-label="Pay with Google Pay"
                                >
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Pay" className="h-5" />
                                </button>
                            </div>

                            {/* Card Payment Form */}
                            {paymentMethod === 'card' && (
                                <div className="p-6 bg-neutral-50 border border-neutral-100 rounded-xl space-y-4 animate-fadeIn">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs text-neutral-500 uppercase tracking-widest">Enter Card Details</p>
                                        <div className="flex gap-2 opacity-60">
                                            <img alt="Visa" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHG_B02sSEFPzAqVrSL-dqVeWjUf7FI_xzXDMHE6i1JGoiY2VzJo0gFV_xkhdQaD4ocKL_okMaw4SR68S-0NUCZlS78KDmombIBOuxU4vSE7_vrWC2O3m0wutjiIbGwkQ-0rZr67xA3V9PPf9bhbrtLRHBxORPXjz2h-Av6hfwNqFN4dVYdZ-I8A6Ytpo5X9ROWLcmOLvnDa0irz5SubYJmdz3c-U6riDBkXtkxKnZAv3pFGFy-yqarlszU_Vz8OaumUaD8PeRNDrp" />
                                            <img alt="Mastercard" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdmiDj8aHiQ18rgUe0E48lVLGg6c4sd24EpLUSHRW4dPg-RFwd-N_ex2LBnGjcLuCIs9yFSISDiJ-5-53EIPx3m78VNMi7e7qaIXSjzMka7RgnHACZnX4kAjHR40C1T_sAF2e2hBzBMLRvYfrpWOkqN9psKrbeIu5Sm6nJ6Nnd8fJ4c1YBm0RJiXxgbzb1dukYMfcasMSk0oI4jaD9_uV92vG7Ra7UqIh9Jw6aRnXX2zZwD27SHot0gk-jCeipGU8Un3dSbWSGtCAR" />
                                        </div>
                                    </div>
                                    <div className="floating-label-group relative">
                                        <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="card" placeholder="Card Number" type="text" />
                                        <label htmlFor="card" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">Card Number</label>
                                        <span className="material-symbols-outlined absolute right-4 top-4 text-neutral-400">credit_card</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="floating-label-group relative">
                                            <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="expiry" placeholder="Expiry (MM/YY)" type="text" />
                                            <label htmlFor="expiry" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">Expiry (MM/YY)</label>
                                        </div>
                                        <div className="floating-label-group relative">
                                            <input className="w-full h-14 px-4 rounded-lg border-neutral-200 bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none peer placeholder-transparent" id="cvv" placeholder="CVV" type="text" />
                                            <label htmlFor="cvv" className="absolute left-4 top-4 text-neutral-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-primary peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-1 pointer-events-none">CVV</label>
                                            <span className="material-symbols-outlined absolute right-4 top-4 text-neutral-400">help_outline</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PayPal Message */}
                            {paymentMethod === 'paypal' && (
                                <div className="p-8 bg-[#003087]/5 border border-[#003087]/20 rounded-xl text-center space-y-4 animate-fadeIn">
                                    <p className="text-sm text-[#003087] font-medium">You will be redirected to PayPal to verify your payment.</p>
                                </div>
                            )}

                            {/* Apple Pay Message */}
                            {paymentMethod === 'apple' && (
                                <div className="p-8 bg-neutral-100 border border-neutral-200 rounded-xl text-center space-y-4 animate-fadeIn">
                                    <p className="text-sm text-neutral-800 font-medium">Pay securely with Apple Pay.</p>
                                </div>
                            )}
                        </section>

                        <div className="pt-4">
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className={`w-full bg-primary text-white py-5 rounded-lg font-bold tracking-[0.2em] text-sm transition-all uppercase shadow-xl shadow-black/10 ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-neutral-800'}`}
                            >
                                {loading ? 'Processing...' : `Place Order • $${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </button>
                            <p className="text-[10px] text-center text-neutral-400 mt-4 uppercase tracking-widest">
                                By clicking place order you agree to our terms and conditions
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white dark:bg-neutral-900 border border-border-light dark:border-neutral-800 rounded-xl p-8">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 pb-4 border-b border-neutral-50">Order Summary</h3>
                                {/* Product List */}
                                <div className="space-y-6 mb-8">
                                    {cart.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="relative group">
                                                <div className="size-24 bg-neutral-100 rounded-lg overflow-hidden">
                                                    <img alt={item.name} className="w-full h-full object-cover mix-blend-multiply" data-alt={item.name} src={item.image} />
                                                </div>
                                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] size-5 flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-sm font-semibold">{item.name}</h4>
                                                        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Size: {item.selectedSize}</p>
                                                    </div>
                                                    <p className="text-sm font-medium">${item.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Promo Code */}
                                <div className="flex gap-2 mb-8">
                                    <input className="flex-1 h-12 bg-neutral-50 border-neutral-100 rounded-lg px-4 text-sm focus:ring-primary focus:border-primary outline-none" placeholder="Promo code" type="text" />
                                    <button className="px-6 h-12 bg-neutral-100 text-neutral-600 font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors uppercase tracking-widest">Apply</button>
                                </div>
                                {/* Cost Breakdown */}
                                <div className="space-y-3 pt-6 border-t border-neutral-50">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">Subtotal</span>
                                        <span className="font-medium">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">Shipping</span>
                                        <span className="text-neutral-400 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-500">Taxes (Estimated)</span>
                                        <span className="font-medium">${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-4 text-primary">
                                        <span>Total</span>
                                        <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 opacity-40">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">shield</span>
                                    <span className="text-[10px] font-bold tracking-widest uppercase">Secure SSL Encryption</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">package_2</span>
                                    <span className="text-[10px] font-bold tracking-widest uppercase">30-Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="max-w-[1200px] mx-auto px-6 py-12 border-t border-border-light mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-neutral-400 uppercase tracking-widest">© 2024 LUXE ATELIER. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                        <Link className="hover:text-primary transition-colors" to="#">Privacy Policy</Link>
                        <Link className="hover:text-primary transition-colors" to="#">Terms of Service</Link>
                        <Link className="hover:text-primary transition-colors" to="#">Contact Us</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
