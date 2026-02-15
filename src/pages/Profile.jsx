import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { createUserProfile, getUserProfile, getUserOrders, updateUserProfile } from '../services/firestore';

export default function Profile() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Ensure profile exists
                await createUserProfile(currentUser);
                // Fetch profile data
                const profile = await getUserProfile(currentUser.uid);
                setUserProfile(profile);
                if (profile) {
                    setEditForm({
                        name: profile.name || '',
                        phone: profile.phone || '',
                        address: profile.address || ''
                    });
                }
                // Fetch orders
                const userOrders = await getUserOrders(currentUser.uid);
                setOrders(userOrders);
            } else {
                setUserProfile(null);
                setOrders([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let userCredential;
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Create profile immediately on signup
                await createUserProfile(userCredential.user);
            }
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Error signing out: ", err);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await createUserProfile(result.user);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await updateUserProfile(user.uid, editForm);
            setUserProfile({ ...userProfile, ...editForm });
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-primary dark:text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-10 shadow-sm mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="size-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-3xl shrink-0">
                                <span className="opacity-50">👤</span>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl font-serif text-primary dark:text-white mb-2">Welcome, {userProfile?.name || user.email?.split('@')[0]}</h1>
                                <p className="text-neutral-500 font-mono text-xs">{user.email}</p>
                            </div>
                            <div className="md:ml-auto">
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-primary dark:text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Account Settings */}
                        <div className="md:col-span-1 space-y-4">
                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-sm font-bold uppercase tracking-widest">Account Details</h2>
                                    <button
                                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                        className="text-primary dark:text-white text-xs underline font-bold"
                                    >
                                        {isEditing ? 'Save' : 'Edit'}
                                    </button>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Email</label>
                                        <p className="text-neutral-600 dark:text-neutral-300">{user.email}</p>
                                    </div>

                                    {isEditing ? (
                                        <>
                                            <div>
                                                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 focus:border-primary outline-none py-1 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="w-full bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 focus:border-primary outline-none py-1 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Address</label>
                                                <textarea
                                                    value={editForm.address}
                                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                    className="w-full bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 focus:border-primary outline-none py-1 transition-colors resize-none"
                                                    rows="2"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Name</label>
                                                <p className="text-neutral-600 dark:text-neutral-300">{userProfile?.name || 'Not set'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Phone</label>
                                                <p className="text-neutral-600 dark:text-neutral-300">{userProfile?.phone || 'Not set'}</p>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Address</label>
                                                <p className="text-neutral-600 dark:text-neutral-300">{userProfile?.address || 'Not set'}</p>
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                        <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Member Since</label>
                                        <p className="text-neutral-600 dark:text-neutral-300">{userProfile?.createdAt?.toDate ? userProfile.createdAt.toDate().toLocaleDateString() : 'Just now'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order History */}
                        {/* Order History */}
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-serif text-primary dark:text-white">Order History</h2>
                                <a href="/" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-primary dark:hover:text-white transition-colors">
                                    ← Back to Home
                                </a>
                            </div>
                            {orders.length === 0 ? (
                                <p className="text-neutral-500">No orders found.</p>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 transition-all hover:shadow-md">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800 gap-4">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                                    <div>
                                                        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Order ID</p>
                                                        <p className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300">#{order.id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Date</p>
                                                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                                                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Pending'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Total</p>
                                                        <p className="text-sm font-bold text-primary dark:text-white">${order.totalAmount?.toLocaleString()}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    <span className="px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                                                        {order.status || 'Processing'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {order.items?.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-4 group">
                                                        <div className="size-16 bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden shrink-0">
                                                            <img
                                                                src={item.image || item.imageUrl}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-primary dark:text-white truncate mb-1">{item.title || item.name}</h4>
                                                            <p className="text-xs text-neutral-500">
                                                                Qty: {item.quantity}
                                                                {item.selectedSize && <span className="mx-2">•</span>}
                                                                {item.selectedSize && `Size: ${item.selectedSize}`}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-medium text-primary dark:text-white">${item.price * item.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20"></div>

                <h2 className="text-3xl font-serif text-center mb-2 text-primary dark:text-white">
                    {isLogin ? 'Welcome Back' : 'Join Luxe'}
                </h2>
                <p className="text-center text-xs uppercase tracking-widest text-neutral-400 mb-8">
                    {isLogin ? 'Sign in to access your account' : 'Create an account to start shopping'}
                </p>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-xs p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-neutral-400 text-primary dark:text-white"
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-neutral-400 text-primary dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-primary text-white dark:bg-white dark:text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-primary/10"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-100 dark:border-neutral-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-400">Or continue with</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-4 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mb-6"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Google
                </button>

                <div className="text-center">
                    <p className="text-xs text-neutral-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="ml-2 font-bold text-primary dark:text-white underline underline-offset-4 hover:opacity-70 transition-opacity"
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
