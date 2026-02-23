import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            {/* Accessibility Link */}
            <a href="#main-content" className={styles.skipLink}>
                Skip to main content
            </a>

            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logoGroup}>
                    <div className={styles.logoIcon}>
                        <span className="outfit" style={{ fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>VS</span>
                    </div>
                    <span className="outfit" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>ViddyScribe</span>
                </Link>

                <div className={styles.links}>
                    <Link href="#" className={styles.link}>For Individuals</Link>
                    <Link href="#" className={styles.link}>Pricing</Link>
                    <Link href="#" className={styles.link}>Blog</Link>
                </div>

                <div className={styles.actionGroup}>
                    <Link href="/login" className={styles.link}>Login</Link>
                    <Link href="/app" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
