'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import VideoUploader from '@/components/VideoUploader/VideoUploader';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer';
import { useSearchParams, useRouter } from 'next/navigation';
import { DEMO_VIDEO_URL, DEMO_DESCRIPTIONS } from '@/lib/demoData';
import { parseSRT } from '@/lib/srtParser';
import styles from './app.module.css';

function AppContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isDemoMode = searchParams.get('demo') === 'true';

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [demoUrl, setDemoUrl] = useState<string | null>(null);
    const [descriptions, setDescriptions] = useState(isDemoMode ? DEMO_DESCRIPTIONS : []);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isDemoMode) {
            setDemoUrl(DEMO_VIDEO_URL);
            setDescriptions(DEMO_DESCRIPTIONS);
        }
    }, [isDemoMode]);

    const handleVideoSelect = async (file: File) => {
        setVideoFile(file);
        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('video', file);

            const response = await fetch('/api/analyze-video', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setDescriptions(data.descriptions);
            } else {
                console.error('Failed to analyze video');
            }
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSrtSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const text = await file.text();
            const parsedDescriptions = parseSRT(text);
            setDescriptions(parsedDescriptions);
        }
    };

    return (
        <div className={styles.dashboardLayout}>
            {/* SaaS Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logo}>
                        <span className="outfit">Vidbuddy</span>
                    </Link>
                </div>

                <nav className={styles.sidebarNav}>
                    <button className={`${styles.navItem} ${styles.activeNavItem}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 17h20M2 12h20M2 7h20" /></svg>
                        Workspace
                    </button>
                    <button className={styles.navItem}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                        Upload History
                    </button>
                    <button className={styles.navItem}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        Settings
                    </button>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>T</div>
                        <div className={styles.userInfo}>
                            <strong>TerraCode Team</strong>
                            <span>Free Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                <header className={styles.contentHeader}>
                    <h2>{isDemoMode ? 'Interactive Demo' : 'New Project'}</h2>
                    {isDemoMode && (
                        <button
                            className="btn-primary"
                            onClick={() => router.push('/app')}
                            style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                        >
                            Exit Demo Mode
                        </button>
                    )}
                </header>

                <div className={styles.workspace}>
                    <div className={styles.processingSection}>
                        <div className={styles.headerText} style={{ marginBottom: '32px', textAlign: 'left', maxWidth: '100%' }}>
                            <h2 className="outfit">Interactive Session</h2>
                            <p style={{ color: '#94a3b8' }}>Video analysis complete. Turn on speakers to hear the generated audio descriptions.</p>
                        </div>

                        <VideoPlayer
                            videoFile={new File([""], "demo.mp4", { type: "video/mp4" })}
                            demoUrl={"/original.mp4"}
                            descriptions={descriptions}
                            isProcessing={false}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AppPage() {
    return (
        <Suspense fallback={<div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Loading Workspace...</div>}>
            <AppContent />
        </Suspense>
    );
}
