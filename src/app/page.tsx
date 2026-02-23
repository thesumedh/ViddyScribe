'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import styles from './page.module.css';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import { parseSRT } from '@/lib/srtParser';
import { DEMO_DESCRIPTIONS } from '@/lib/demoData';

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeError, setShowYoutubeError] = useState(false);
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <main className={styles.main}>
      <Navbar />

      <section className={styles.hero}>
        <div className="container">
          <motion.div
            className={styles.heroContent}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className={styles.badgeContainer} variants={itemVariants}>
              <div className={styles.badgePulse}></div>
              <div className={styles.badge}>
                ✨ <strong>Winner of Best Web App</strong> - Google Gemini API Developer Competition
              </div>
            </motion.div>

            <motion.h1 className={styles.mainTitle} variants={itemVariants}>
              Get your Videos <br /><span className={styles.gradientText}>Audio Described</span> in Seconds
            </motion.h1>

            <motion.p className={styles.subtitle} variants={itemVariants}>
              Fast & Accurate Audio Descriptions for WCAG, ADA Title II, EAA, and AODA compliance
            </motion.p>

            <motion.div className={styles.ctaGroup} variants={itemVariants}>
              <Link href="/app" className={`btn-primary ${styles.heroBtn}`}>
                Get Started
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants} className={styles.trustedBy}>
              Trusted by 5,000+ users and organizations worldwide
            </motion.div>

            {/* NEW DEMO HERO: Left/Right Videos */}
            <motion.div variants={itemVariants} className={styles.homeDemoGrid}>



              {/* 2. Side-by-Side Videos */}
              <div className={styles.parallelVideoGridHome}>
                <div className={styles.parallelCol}>
                  <div className={styles.colHeader}>
                    <h3>Original Video</h3>
                    <span className={styles.badgeNotCompliant}>Not Compliant</span>
                  </div>
                  <div className={styles.videoWrapFixed}>
                    <video controls src="/original.mp4" className={styles.fixedVideo} preload="metadata" />
                  </div>
                </div>

                <div className={styles.parallelCol}>
                  <div className={styles.colHeader}>
                    <h3>Audio Described</h3>
                    <span className={styles.badgeCompliant}>Accessible</span>
                  </div>
                  <div className={styles.videoWrapFixed}>
                    <video controls src="/described.mp4" className={styles.fixedVideo} preload="metadata" />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                {/* YouTube Import Simulator */}
                <div className={styles.youtubeCard} style={{ width: '100%' }}>
                  <div className={styles.ytIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582 6.186a2.506 2.506 0 0 0-1.762-1.766C18.265 4 12 4 12 4s-6.264 0-7.82.42a2.506 2.506 0 0 0-1.762 1.766C2 7.74 2 12 2 12s0 4.26.418 5.814a2.506 2.506 0 0 0 1.762 1.766C5.736 20 12 20 12 20s6.265 0 7.82-.42a2.506 2.506 0 0 0 1.762-1.766C22 16.26 22 12 22 12s0-4.26-.418-5.814zM9.99 15.474v-6.95l6.332 3.475-6.332 3.475z" /></svg>
                    <span style={{ fontWeight: 600, marginLeft: '8px' }}>Realtime YouTube Integration</span>
                  </div>

                  <div className={styles.ytInputGroupWrapper}>
                    <div className={styles.ytInputGroup}>
                      <input
                        type="text"
                        placeholder="Paste YouTube URL here..."
                        className={styles.ytInput}
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                      />
                      <button
                        className="btn-primary"
                        style={{ padding: '0 20px', borderRadius: '0 8px 8px 0' }}
                        onClick={() => setShowYoutubeError(true)}
                      >
                        Import
                      </button>
                    </div>

                    {showYoutubeError && (
                      <div className={styles.ytError}>
                        <span style={{ fontWeight: 600 }}>Limited due to API quota.</span><br />
                        Please ask for realtime working site @thesumedh on github.
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className={styles.features}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Why enterprises choose ViddyScribe</h2>
          </motion.div>
          <motion.div
            className={styles.featureGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div className={styles.featureCard} variants={itemVariants} whileHover={{ y: -8 }}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className="outfit">Unbelievably Fast</h3>
              <p>Videos described in seconds, not days. It's fast. Add videos & generate. Done. Process batches or use the API to scale.</p>
            </motion.div>
            <motion.div className={styles.featureCard} variants={itemVariants} whileHover={{ y: -8 }}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3 className="outfit">Accurate & Compliant</h3>
              <p>Natural voices. 52 languages. State-of-the-art AI Descriptions. Google featured us as the top accessibility solution.</p>
            </motion.div>
            <motion.div className={styles.featureCard} variants={itemVariants} whileHover={{ y: -8 }}>
              <div className={styles.featureIcon}>⚙️</div>
              <h3 className="outfit">Full Control</h3>
              <p>Full Control over your outputs. Edit your descriptions, timestamp placements and more before exporting.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerContainer}`}>
          <div className={styles.footerBrand}>
            <div className={styles.logoIcon}>
              <span className="outfit" style={{ fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>VS</span>
            </div>
            <span className="outfit" style={{ fontWeight: 700, color: '#fff' }}>ViddyScribe</span>
            <p className={styles.footerTagline}>AI-powered accessibility tools that turn any video into an inclusive experience.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkColumn}>
              <h4>Product</h4>
              <Link href="#">Audio Descriptions</Link>
              <Link href="#">Closed Captions</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Solutions</h4>
              <Link href="#">Enterprise</Link>
              <Link href="#">Individuals</Link>
            </div>
            <div className={styles.linkColumn}>
              <h4>Resources</h4>
              <Link href="#">Blog</Link>
              <Link href="#">Support</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 ViddyScribe | <Link href="#">Terms</Link> | <Link href="#">Privacy</Link></p>
        </div>
      </footer>

      {/* Decorative background elements */}
      <div className={styles.glowBlob} style={{ top: '20%', left: '10%', background: 'rgba(109, 40, 217, 0.15)' }} />
      <div className={styles.glowBlob} style={{ top: '40%', right: '10%', background: 'rgba(236, 72, 153, 0.15)' }} />
    </main>
  );
}
