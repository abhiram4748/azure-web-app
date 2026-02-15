import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Home() {
    const { getCartCount } = useCart();

    return (
        <div className="layout-container flex h-full grow flex-col">
            {/* Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-solid border-primary/5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-20 py-4">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2">
                        <h2 className="text-primary dark:text-white text-2xl font-bold tracking-[0.2em] font-serif">LUXE</h2>
                    </div>
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link className="text-primary/70 hover:text-primary dark:text-white/70 dark:hover:text-white text-xs font-medium uppercase tracking-widest transition-colors" to="/shop">Collections</Link>
                        <Link className="text-primary/70 hover:text-primary dark:text-white/70 dark:hover:text-white text-xs font-medium uppercase tracking-widest transition-colors" to="/shop">Men</Link>
                        <Link className="text-primary/70 hover:text-primary dark:text-white/70 dark:hover:text-white text-xs font-medium uppercase tracking-widest transition-colors" to="/shop">Women</Link>
                        <Link className="text-primary/70 hover:text-primary dark:text-white/70 dark:hover:text-white text-xs font-medium uppercase tracking-widest transition-colors" to="/journal">Journal</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center border-b border-primary/20 dark:border-white/20 pb-1">
                        <span className="material-symbols-outlined text-xl opacity-60">search</span>
                        <input className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-primary/40 dark:placeholder:text-white/40 w-32 outline-none" placeholder="Search..." type="text" />
                    </div>
                    <Link to="/cart" className="flex items-center justify-center p-1 relative">
                        <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                        {getCartCount() > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white dark:bg-white dark:text-black text-[9px] rounded-full size-4 flex items-center justify-center font-bold">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>
                    <Link to="/profile" className="flex items-center justify-center p-1">
                        <span className="material-symbols-outlined text-2xl">person</span>
                    </Link>
                    <button className="lg:hidden flex items-center justify-center p-1">
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 mt-0">
                {/* Hero Section */}
                <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105" data-alt="High-end editorial fashion model in minimalist setting" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDSaxlJFHEnxopc_5iCq8kagCgA9HPWSWQbProPmB4j642ByKzpYbVUgjGUu_paNzB13RGSzbyWad08ZbuOGWPWZEB97MecSX2uOQll9D-l9kapb4eTpC4MFuFtkx1_0LHgXc4FDmUXy71OAoonNNU3eTrSUsXZSzkWDQvVxEoACG7Tx5JINjNpK1sMQVPRmshIegRn6R0jNpo-6zuVlsshVot931_A4p7-5gL32Yc2tAEwTKarfsmw9d77G1Hvjl7lLPV7G1jJKf8S')" }}>
                    </div>
                    <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                        <h1 className="font-serif text-5xl md:text-8xl font-normal leading-tight tracking-tight mb-8">
                            THE ESSENCE OF STYLE
                        </h1>
                        <p className="text-sm md:text-base font-light tracking-[0.3em] uppercase mb-12 opacity-90">
                            Redefining luxury through minimalist design
                        </p>
                        <Link to="/shop" className="inline-block px-10 py-4 bg-white text-primary text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all duration-300">
                            Shop Now
                        </Link>
                    </div>
                </section>

                {/* Collections Grid */}
                <section className="px-6 md:px-20 py-24 bg-white dark:bg-background-dark">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Men */}
                        <Link to="/shop" className="group cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                <img alt="Men's collection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Modern tailoring male model in charcoal suit" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj3Qc7lmBgwLJCpS2D7hIZAvR7tD86hlHKN_oXZ2SoSiqLSS7UJCznAnEHUyX0y-aQMi1NYWVKev1QPG0r7WQXH9lSvuH4QOmfss15KxUPKqcoQWl8NYeNM0qxqqrRbk6yGxZqcpwZZpbHKcqbJpDuvuQ7viHleOyiQJovbuhXGs-SZH1FPXYS1TOyWuZTD6XJdljNM-IQ9-bTxUXV3B7koM4HhEYfvb16T2XaU4mhMJvPv2uvgvR14D0edkZvvywHt0NKnW1bpVZw" />
                            </div>
                            <h3 className="font-serif text-2xl mb-1">Modern Tailoring</h3>
                            <p className="text-xs uppercase tracking-widest text-primary/60 dark:text-white/60">Men's Collection</p>
                        </Link>
                        {/* Women */}
                        <Link to="/shop" className="group cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                <img alt="Women's collection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Woman wearing silk minimalist dress editorial photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnI_lk0exHkMHJ-nJUR42py7fmBxh8ycYE4hPDcufKiz6zTW3X6OzIandEQasqSunLd8vvuzLRnTgm6dvoYjJcE32nfVThon1OfUCwcORxuU9l_Z0Hez4H0v29Y5nxR4cakZKT31bSrBKGy8E2DznBYzQ-OuPakfiQUjKCFyQYNrYz7HEvFosk9tEcF5h3J52lA8lFpfynKZOOZPANiHoEDTHTd3sqoOu804mQnM6kdi1-pKO9VQAvX8GP3v3uNWpKYtZP0nIrbCWj" />
                            </div>
                            <h3 className="font-serif text-2xl mb-1">The Silk Collection</h3>
                            <p className="text-xs uppercase tracking-widest text-primary/60 dark:text-white/60">Women's Collection</p>
                        </Link>
                        {/* Accessories */}
                        <Link to="/shop" className="group cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                                <img alt="Accessories collection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Close up of luxury minimalist leather accessories" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkn_-9hxCeUKE17x9o1aCsuwZ0fsq6u_L4akvZXp5eYyr8qBThgYaopa6Yi_tDGHQecc2fKkk4bfsL0CvYVFBxfzsGuh9g60fNQa8KcXqxNXbDJmTzpgVsxKqGZWeMJszldBnxHEFnSXYHRnlK0P-dYK9SeCcqGevQ7nOKMOHOnbW3Iu35cG23OS_u-HW1FTz2imalaFHAHY2Ozl0xNw1diOTE5BOqACQlKRReQyhP27fQfMpNXnaD02lX-iSWBl_mdB3c8dvWsvpc" />
                            </div>
                            <h3 className="font-serif text-2xl mb-1">Essential Details</h3>
                            <p className="text-xs uppercase tracking-widest text-primary/60 dark:text-white/60">Accessories</p>
                        </Link>
                    </div>
                </section>

                {/* Trending Products Grid */}
                <section className="px-6 md:px-20 py-24 bg-background-light dark:bg-background-dark/50">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-xs uppercase tracking-[0.4em] text-accent-gold font-semibold mb-4 block">Selected Pieces</span>
                            <h2 className="font-serif text-4xl md:text-5xl">Trending Products</h2>
                        </div>
                        <Link className="hidden md:block text-xs font-bold uppercase tracking-widest border-b border-primary dark:border-white pb-1 hover:opacity-60 transition-opacity" to="/shop">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Product 1 */}
                        <Link to="/product/1" className="group">
                            <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-white dark:bg-background-dark shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                                <img alt="Cashmere Coat" className="w-full h-full object-cover" data-alt="Minimalist long cashmere overcoat in camel color" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBPZvMwfBfKiAzrxH84gFdt12q3Jrd6qFcU9Izl80spxi3nB5XLTB2GgO-IaM0hSlMt90Ggwh_doKJNg7voEtFbbHoIideLmRa17zQeNqbvGQdFhv6l-0bkTXBoc3q97Ij6PflmNttXqsDYOHUqvciHyaxyxy2MdrL2CNnqRKU2gq6ptTlX0XexgcXkFazs30SCdtmntVgBvynIFn4dahN7O-znkhNpFBVTRNOEpknQ0DhPngQwyZFsjlL_4ihHWWLDV4yzxojgrpF" />
                                <button className="absolute bottom-0 left-0 right-0 py-4 bg-primary text-white text-[10px] uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    Quick Add
                                </button>
                            </div>
                            <div className="font-poppins">
                                <h4 className="text-sm font-medium mb-1 tracking-tight">Classic Cashmere Overcoat</h4>
                                <p className="text-accent-gold text-sm font-semibold">$1,250</p>
                            </div>
                        </Link>
                        {/* Product 2 */}
                        <Link to="/product/2" className="group">
                            <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-white dark:bg-background-dark shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                                <img alt="Silk Scarf" className="w-full h-full object-cover" data-alt="Luxury white silk scarf detail shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9s5WHCQiJuK5lkOY3SI-Fv3qIPE_f9Zg-OQX82OChUGsWwIIDThcV1UjYSFWna63W3pw2PfODPghikr47pmYwQmGEwR3Nz5vJFUTcxnTz0-d8QMHCq6xl9EQM9FV0w7BmT7aaaLUJAyKOd58tPt2szh5JPuje8JwVub9MaVJfCZTWWyCodMlzOMr1Yeo1XOB4YXEZFLdzauufH1fHn4duP4S94lgGFUDVi7DTIy4B0bftIOEbwDAt-Fhs8iT5jwX2rgC07IfHa0Lh" />
                                <button className="absolute bottom-0 left-0 right-0 py-4 bg-primary text-white text-[10px] uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    Quick Add
                                </button>
                            </div>
                            <div className="font-poppins">
                                <h4 className="text-sm font-medium mb-1 tracking-tight">Raw Edge Silk Scarf</h4>
                                <p className="text-accent-gold text-sm font-semibold">$320</p>
                            </div>
                        </Link>
                        {/* Product 3 */}
                        <Link to="/product/3" className="group">
                            <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-white dark:bg-background-dark shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                                <img alt="Leather Boots" className="w-full h-full object-cover" data-alt="Sleek black minimalist leather boots" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhgSJSVeD-LXdjtwOhENNphbZ614FMiIj0PzNRlL_tJD81_K36ihbACMNGTo5c7mAw04ns63WKG_uwJDONxxEU2wGmVzEbmJSGwJeuSmjLZtRb3Gel8GDdyKfX0FcezhS5A85JdnJ5C1FWYGJzdO8jr8KNQa5gLYrcWuZSstl_yu9-ZrAUa7Lz5V3B9uFdNHlrP-fvyvyZaYFK8QZmofC-GDZIL3prCQhBpnqgTxBDx43Dw3fylE4_zjyqEYHszbQfftwu4LFPVMzf" />
                                <button className="absolute bottom-0 left-0 right-0 py-4 bg-primary text-white text-[10px] uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    Quick Add
                                </button>
                            </div>
                            <div className="font-poppins">
                                <h4 className="text-sm font-medium mb-1 tracking-tight">Sculpted Heel Ankle Boot</h4>
                                <p className="text-accent-gold text-sm font-semibold">$890</p>
                            </div>
                        </Link>
                        {/* Product 4 */}
                        <Link to="/product/4" className="group">
                            <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-white dark:bg-background-dark shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                                <img alt="Structured Tote" className="w-full h-full object-cover" data-alt="Structured tan leather luxury tote bag" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGKkvhst0R-SWy97mkc6RwiFC_-9X-WPxFaaYEwpYhmGYgjOyHioGLaXwWsf4ZXMOjdKxRLIQ3rnoWbEkXYXuMPk4r3HzhEVW-OTs7yjL8Cagihzc3H7-AOiHzNt28UIEjVNxlurjgd54F9gDIp3-PX2F3XCmr_vxsWrfwiu7hyc_jjkjPfsFRpfgfunNmWg4smD_MBEOGhFgx8r9XGhbAXpbHvLzDYtVQ_wHls8LVUgOdj2nGBw35VDY8R76_kAyRc3knDS3vCEVk" />
                                <button className="absolute bottom-0 left-0 right-0 py-4 bg-primary text-white text-[10px] uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    Quick Add
                                </button>
                            </div>
                            <div className="font-poppins">
                                <h4 className="text-sm font-medium mb-1 tracking-tight">Structured Essential Tote</h4>
                                <p className="text-accent-gold text-sm font-semibold">$1,400</p>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* Brand Philosophy */}
                <section className="py-32 bg-primary text-white text-center px-6">
                    <div className="max-w-3xl mx-auto">
                        <span className="text-xs tracking-[0.5em] opacity-50 uppercase mb-8 block">Our Ethos</span>
                        <h2 className="font-serif text-3xl md:text-5xl leading-relaxed italic mb-12">
                            "Elegance is not standing out, but being remembered."
                        </h2>
                        <p className="text-sm font-light leading-loose opacity-70 tracking-wide max-w-xl mx-auto">
                            We believe in the power of restraint. Our pieces are designed for the modern individual who values craftsmanship over trends and quality over quantity.
                        </p>
                    </div>
                </section>
            </main>

            {/* Magazine Style Footer */}
            <footer className="bg-white dark:bg-background-dark border-t border-primary/5 pt-24 pb-12 px-6 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    <div className="col-span-1 lg:col-span-1">
                        <h2 className="font-serif text-3xl tracking-[0.2em] mb-8">LUXE</h2>
                        <p className="text-xs leading-relaxed text-primary/60 dark:text-white/60 mb-8 max-w-[240px]">
                            The pinnacle of minimalist luxury fashion. Founded on the principles of timeless design and exceptional materials.
                        </p>
                        <div className="flex gap-4">
                            <a className="w-8 h-8 flex items-center justify-center border border-primary/10 rounded-full hover:bg-primary hover:text-white transition-all" href="#"><span className="material-symbols-outlined text-sm">public</span></a>
                            <a className="w-8 h-8 flex items-center justify-center border border-primary/10 rounded-full hover:bg-primary hover:text-white transition-all" href="#"><span className="material-symbols-outlined text-sm">share</span></a>
                            <a className="w-8 h-8 flex items-center justify-center border border-primary/10 rounded-full hover:bg-primary hover:text-white transition-all" href="#"><span className="material-symbols-outlined text-sm">camera</span></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Explore</h4>
                        <ul className="space-y-4 text-xs font-medium text-primary/50 dark:text-white/50">
                            <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">Our Story</Link></li>
                            <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">Retail Locations</Link></li>
                            <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">Sustainability</Link></li>
                            <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Customer Care</h4>
                        <ul className="space-y-4 text-xs font-medium text-primary/50 dark:text-white/50">
                            <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">Shipping & Returns</Link></li>
                            <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">Size Guide</Link></li>
                            <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">Contact Us</Link></li>
                            <li><Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">FAQ</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Newsletter</h4>
                        <p className="text-xs text-primary/60 dark:text-white/60 mb-6">Join the LUXE circle for exclusive releases.</p>
                        <form className="flex border-b border-primary/20 dark:border-white/20 pb-2">
                            <input className="bg-transparent border-none focus:ring-0 text-xs flex-grow px-0 outline-none" placeholder="Your email address" type="email" />
                            <button className="text-xs font-bold uppercase tracking-widest ml-4" type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-primary/5 text-[10px] uppercase tracking-[0.2em] text-primary/40 dark:text-white/40">
                    <p>© 2024 LUXE ATELIER. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                        <Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">Privacy Policy</Link>
                        <Link className="hover:text-primary dark:hover:text-white transition-colors" to="#">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
