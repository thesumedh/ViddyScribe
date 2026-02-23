'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './VideoPlayer.module.css';

interface Description {
    id: string;
    timestamp: number;
    text: string;
}

interface VideoPlayerProps {
    videoFile: File;
    demoUrl?: string | null;
    descriptions?: Description[];
    isProcessing?: boolean;
}

export default function VideoPlayer({
    videoFile,
    demoUrl,
    descriptions = [],
    isProcessing = false
}: VideoPlayerProps) {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentDescription, setCurrentDescription] = useState<Description | null>(null);

    useEffect(() => {
        if (demoUrl) {
            setVideoUrl(demoUrl);
            return;
        }

        if (videoFile && videoFile.size > 0) {
            const url = URL.createObjectURL(videoFile);
            setVideoUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [videoFile, demoUrl]);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100);
            setDuration(total);

            // Check for active description (within a 2-second window for demo)
            const active = descriptions.find(
                (desc) => current >= desc.timestamp && current < desc.timestamp + 3
            );

            if (active && active.id !== currentDescription?.id) {
                setCurrentDescription(active);
                // Here we'd trigger Web Speech API text-to-speech if enabled
                speakDescription(active.text);
            } else if (!active && currentDescription) {
                setCurrentDescription(null);
            }
        }
    };

    const speakDescription = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1; // Slightly faster for accessibility needs
            window.speechSynthesis.speak(utterance);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className={styles.playerWrapper}>
            <div className={styles.glassContainer}>
                <div className={styles.videoContainer}>
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className={styles.videoElement}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    />

                    {/* Processing Overlay Screen */}
                    {isProcessing && (
                        <div className={styles.processingOverlay}>
                            <div className={styles.spinner}></div>
                            <p>Gemini is analyzing video scenes...</p>
                        </div>
                    )}
                </div>

                {/* Custom Accessible Controls */}
                <div className={styles.controls}>
                    <div className={styles.timelineContainer}>
                        <div className={styles.timelineBackground}>
                            <div
                                className={styles.timelineProgress}
                                style={{ width: `${progress}%` }}
                            ></div>
                            {/* Event Markers */}
                            {duration > 0 && descriptions.map(desc => (
                                <div
                                    key={desc.id}
                                    className={styles.timelineMarker}
                                    style={{ left: `${(desc.timestamp / duration) * 100}%` }}
                                    title={desc.text}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.controlBar}>
                        <button
                            className={styles.controlBtn}
                            onClick={handlePlayPause}
                            aria-label={isPlaying ? 'Pause video' : 'Play video'}
                        >
                            {isPlaying ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                        <div className={styles.timeDisplay}>
                            {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Real-time Subtitles / Audio Description Display */}
            <div className={`${styles.descriptionPanel} ${currentDescription ? styles.activeDesc : ''}`}>
                <h3 className={styles.panelTitle}>
                    <span className={styles.audioIcon}>🔊</span>
                    Current Audio Description
                </h3>
                <p className={styles.panelText}>
                    {currentDescription ? currentDescription.text : 'Listening for scene changes...'}
                </p>
            </div>
        </div>
    );
}
