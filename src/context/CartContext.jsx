import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sync to Local Storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

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
