import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const cartStateRef = import.meta.env ? useRef(cart) : { current: cart }; // Fallback for safety, though useRef is standard
    // Ensure useRef is imported

    // Keep cart ref in sync
    useEffect(() => {
        cartStateRef.current = cart;
    }, [cart]);

    // Monitor Auth State
    useEffect(() => {
        let unsubscribeSnapshot;

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            // Unsubscribe from previous snapshot listener if it exists to avoid memory leaks
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
                unsubscribeSnapshot = null;
            }

            if (currentUser) {
                // If user logs in, sync with Firestore
                const cartRef = doc(db, 'carts', currentUser.uid);

                // Listen to real-time updates from Firestore
                unsubscribeSnapshot = onSnapshot(cartRef, (docSnap) => {
                    if (docSnap.exists()) {
                        // Merge logic could go here, for now replacing with server state or keeping local if server is empty?
                        // Sticking to existing logic: Server wins if exists.
                        setCart(docSnap.data().items || []);
                    } else {
                        // If no cart exists in Firestore, create one with current local cart
                        // Use ref to get current cart value
                        const currentCart = cartStateRef.current;
                        if (currentCart.length > 0) {
                            setDoc(cartRef, { items: currentCart }, { merge: true });
                        }
                    }
                });
            } else {
                // User logged out, revert to local storage
                const savedCart = localStorage.getItem('cart');
                setCart(savedCart ? JSON.parse(savedCart) : []);
            }
        });

        return () => {
            if (unsubscribeSnapshot) unsubscribeSnapshot();
            unsubscribeAuth();
        };
    }, []); // Only run on mount

    // Sync to Local Storage (always backup) and Firestore (if logged in)
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));

        if (user) {
            const saveToFirestore = async () => {
                try {
                    const cartRef = doc(db, 'carts', user.uid);
                    await setDoc(cartRef, { items: cart }, { merge: true });
                } catch (error) {
                    console.error("Error syncing cart to Firestore:", error);
                }
            };
            saveToFirestore();
        }
    }, [cart, user]);

    const addToCart = (product, size, quantity = 1) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                item => item.id === product.id && item.selectedSize === size
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                return [...prevCart, { ...product, selectedSize: size, quantity }];
            }
        });
    };

    const removeFromCart = (productId, size) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.selectedSize === size)));
    };

    const updateQuantity = (productId, size, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                (item.id === productId && item.selectedSize === size)
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                : item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isMenuOpen,
        toggleMenu,
        closeMenu
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
