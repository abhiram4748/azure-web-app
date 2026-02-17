import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for persisted user in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Mock Login
        const mockUser = {
            uid: 'test-user-' + Math.random().toString(36).substr(2, 9),
            email: email,
            displayName: email.split('@')[0],
            photoURL: null
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return mockUser;
    };

    const signup = async (email, password) => {
        // Mock Signup - same as login for now
        return login(email, password);
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const googleSignIn = async () => {
        // Mock Google Sign In
        const mockUser = {
            uid: 'google-user-' + Math.random().toString(36).substr(2, 9),
            email: 'user@gmail.com',
            displayName: 'Google User',
            photoURL: null
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { user: mockUser };
    };

    const value = {
        user,
        login,
        signup,
        logout,
        googleSignIn,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
