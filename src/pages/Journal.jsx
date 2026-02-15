import { Link } from 'react-router-dom';

const articles = [
    {
        id: 1,
        title: "The Art of Minimalism in 2024",
        excerpt: "Exploring how the 'less is more' philosophy is evolving in modern fashion and design.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSaxlJFHEnxopc_5iCq8kagCgA9HPWSWQbProPmB4j642ByKzpYbVUgjGUu_paNzB13RGSzbyWad08ZbuOGWPWZEB97MecSX2uOQll9D-l9kapb4eTpC4MFuFtkx1_0LHgXc4FDmUXy71OAoonNNU3eTrSUsXZSzkWDQvVxEoACG7Tx5JINjNpK1sMQVPRmshIegRn6R0jNpo-6zuVlsshVot931_A4p7-5gL32Yc2tAEwTKarfsmw9d77G1Hvjl7lLPV7G1jJKf8S",
        date: "OCTOBER 12, 2024",
        category: "DESIGN"
    },
    {
        id: 2,
        title: "Sustainability: A Commitment to the Future",
        excerpt: "Why ethically sourced materials are the cornerstone of true luxury.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj3Qc7lmBgwLJCpS2D7hIZAvR7tD86hlHKN_oXZ2SoSiqLSS7UJCznAnEHUyX0y-aQMi1NYWVKev1QPG0r7WQXH9lSvuH4QOmfss15KxUPKqcoQWl8NYeNM0qxqqrRbk6yGxZqcpwZZpbHKcqbJpDuvuQ7viHleOyiQJovbuhXGs-SZH1FPXYS1TOyWuZTD6XJdljNM-IQ9-bTxUXV3B7koM4HhEYfvb16T2XaU4mhMJvPv2uvgvR14D0edkZvvywHt0NKnW1bpVZw",
        date: "SEPTEMBER 28, 2024",
        category: "SUSTAINABILITY"
    },
    {
        id: 3,
        title: "Winter Essentials: Layering with Silk",
        excerpt: "How to style our signature silk pieces for the colder months without compromising on warmth.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnI_lk0exHkMHJ-nJUR42py7fmBxh8ycYE4hPDcufKiz6zTW3X6OzIandEQasqSunLd8vvuzLRnTgm6dvoYjJcE32nfVThon1OfUCwcORxuU9l_Z0Hez4H0v29Y5nxR4cakZKT31bSrBKGy8E2DznBYzQ-OuPakfiQUjKCFyQYNrYz7HEvFosk9tEcF5h3J52lA8lFpfynKZOOZPANiHoEDTHTd3sqoOu804mQnM6kdi1-pKO9VQAvX8GP3v3uNWpKYtZP0nIrbCWj",
        date: "SEPTEMBER 15, 2024",
        category: "STYLE GUIDE"
    }
];

export default function Journal() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-primary dark:text-white font-display">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/5 px-6 md:px-20 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold tracking-[0.2em] font-serif">LUXE</Link>
                <Link to="/" className="text-xs uppercase tracking-widest hover:text-accent-gold transition-colors">Back to Home</Link>
            </header>

            <main className="pt-32 pb-20 px-6 md:px-20 max-w-[1440px] mx-auto">
                <div className="text-center mb-24">
                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent-gold mb-4 block">The Journal</span>
                    <h1 className="font-serif text-5xl md:text-7xl mb-6">Stories & Style</h1>
                    <p className="max-w-xl mx-auto text-neutral-500 font-light leading-relaxed">
                        Curated articles on fashion, lifestyle, and the art of living well.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                    {articles.map(article => (
                        <article key={article.id} className="group cursor-pointer">
                            <div className="aspect-[4/5] overflow-hidden mb-8 bg-neutral-100">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                                <span>{article.category}</span>
                                <span className="w-px h-3 bg-neutral-300"></span>
                                <span>{article.date}</span>
                            </div>
                            <h2 className="font-serif text-2xl mb-4 group-hover:text-accent-gold transition-colors">{article.title}</h2>
                            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                                {article.excerpt}
                            </p>
                            <span className="text-xs font-bold uppercase tracking-widest border-b border-primary dark:border-white pb-1 group-hover:border-accent-gold group-hover:text-accent-gold transition-colors inline-block">
                                Read Story
                            </span>
                        </article>
                    ))}
                </div>
            </main>

            <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 text-center">
                <div className="flex justify-center gap-8 mb-8 text-neutral-400">
                    <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">public</span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">share</span>
                    <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">camera</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest opacity-40">© 2024 LUXE ATELIER. The Journal.</p>
            </footer>
        </div>
    );
}
