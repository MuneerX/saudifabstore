'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './IntroVideo.module.css';

interface IntroVideoProps {
  onComplete: () => void;
  onAlmostComplete?: () => void;
}

export default function IntroVideo({ onComplete, onAlmostComplete }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [almostCompleteCalled, setAlmostCompleteCalled] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [networkSlow, setNetworkSlow] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Detect mobile device and network conditions
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    (window.innerWidth <= 768 && window.innerHeight <= 1024);
      setIsMobile(mobile);
    };

    const checkNetwork = () => {
      // Check for slow connection
      if ('connection' in navigator) {
        const connection = (navigator as Navigator & { connection?: { effectiveType: string; downlink: number } }).connection;
        if (connection) {
          const slowConnection = connection.effectiveType === 'slow-2g' ||
                                connection.effectiveType === '2g' ||
                                connection.downlink < 1.5;
          setNetworkSlow(slowConnection);
        }
      }
    };

    checkMobile();
    checkNetwork();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        console.log('Video loaded successfully');
        setIsLoaded(true);
        setVideoError(false);
        video.currentTime = 0;
      };

      const handleError = (e: Event) => {
        console.error('Video loading error:', e);
        setVideoError(true);

        // Retry loading up to 3 times
        if (loadAttempts < 3) {
          setLoadAttempts(prev => prev + 1);
          setTimeout(() => {
            if (video.src) {
              video.load();
            }
          }, 2000);
        } else {
          // Fallback: skip video after multiple failures
          console.log('Video failed to load after retries, skipping...');
          setIsLoaded(true);
        }
      };

      const handleEnded = () => {
        console.log('Video ended');
        onComplete();
      };

      const handleTimeUpdate = () => {
        if (video.duration) {
          const timeRemaining = video.duration - video.currentTime;

          // Stop video 1 second before actual end
          if (timeRemaining <= 1.0 && !video.paused) {
            video.pause();
            // Call onComplete to show homepage immediately
            onComplete();
          }
        }
      };

      // Manual load for mobile devices
      if (isMobile && !videoError) {
        video.load();
      }

      // Fallback timeout - longer for mobile
      const timeoutDuration = isMobile ? 10000 : 5000;
      const timeout = setTimeout(() => {
        if (!isLoaded && !videoError) {
          console.log('Video load timeout, falling back...');
          setIsLoaded(true);
        }
      }, timeoutDuration);

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        clearTimeout(timeout);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [onComplete, isLoaded, isMobile, loadAttempts, videoError]);

  const handleEnter = async () => {
    if (!isLoaded) return;

    setShowContent(false);

    const video = videoRef.current;
    if (video) {
      try {
        // Mobile-specific handling
        if (isMobile) {
          // On mobile, videos often need user interaction and may not autoplay
          // We'll handle this by ensuring the video is ready and then playing it
          if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
            try {
              // First try to play with audio
              video.muted = false;
              video.volume = 0.7; // Start at 70% volume for mobile
              await video.play();
              setIsPlaying(true);
              setAudioEnabled(true);
              console.log('Mobile video with audio started successfully');
            } catch (audioError) {
              console.warn('Audio autoplay failed, trying muted playback:', audioError);
              try {
                // Fallback: try muted playback
                video.muted = true;
                video.volume = 0;
                await video.play();
                setIsPlaying(true);
                console.log('Mobile video started muted as fallback');
              } catch (mutedError) {
                console.error('Mobile video play failed completely:', mutedError);
                // Final fallback: skip to homepage
                onComplete();
              }
            }
          } else {
            // Wait for video to be ready
            const handleCanPlay = async () => {
              video.removeEventListener('canplay', handleCanPlay);
              try {
                // Try to play with audio first
                video.muted = false;
                video.volume = 0.7;
                await video.play();
                setIsPlaying(true);
                setAudioEnabled(true);
                console.log('Mobile video with audio started successfully');
              } catch (audioError) {
                console.warn('Audio autoplay failed, trying muted playback:', audioError);
                try {
                  // Fallback: try muted playback
                  video.muted = true;
                  video.volume = 0;
                  await video.play();
                  setIsPlaying(true);
                  console.log('Mobile video started muted as fallback');
                } catch (mutedError) {
                  console.error('Mobile video play failed completely:', mutedError);
                  // Final fallback: skip to homepage
                  onComplete();
                }
              }
            };
            video.addEventListener('canplay', handleCanPlay);
            video.load();
            return;
          }
        } else {
          // Desktop handling
          video.volume = 0;
          await video.play();
          setIsPlaying(true);

          // Fade in audio over 2 seconds
          const fadeDuration = 2000;
          const startTime = Date.now();

          const fadeIn = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / fadeDuration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            video.volume = easedProgress;

            if (progress < 1) {
              requestAnimationFrame(fadeIn);
            }
          };

          requestAnimationFrame(fadeIn);
        }

        // Start preloading homepage content immediately when video starts
        if (onAlmostComplete && !almostCompleteCalled) {
          setAlmostCompleteCalled(true);
          onAlmostComplete();
        }

      } catch (error) {
        console.error('Video play failed:', error);
        // On mobile, if autoplay fails, skip to homepage
        if (isMobile) {
          onComplete();
        }
      }
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const enableAudio = async () => {
    const video = videoRef.current;
    if (video) {
      try {
        video.muted = false;
        video.volume = 0.7;
        setAudioEnabled(true);
        console.log('Audio enabled for mobile device');
      } catch (error) {
        console.error('Failed to enable audio:', error);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate subtle movement (max 10px in any direction)
    const moveX = (mouseX / rect.width) * 10;
    const moveY = (mouseY / rect.height) * 10;

    setMousePosition({ x: moveX, y: moveY });
  };

  return (
    <div className={styles.container} onMouseMove={handleMouseMove}>
      {/* Video Background */}
      <video
        ref={videoRef}
        className={styles.video}
        playsInline
        preload={isMobile ? "none" : networkSlow ? "metadata" : "auto"}
        muted={false} // Don't mute by default, handle audio policy per platform
        loop={false}
        onError={() => setVideoError(true)}
        controls={false} // Explicitly disable controls
        disablePictureInPicture // Disable picture-in-picture
        disableRemotePlayback // Disable remote playback
      >
        {/* Primary video source */}
        <source src="/intro.mp4" type="video/mp4" />

        {/* Fallback for browsers that don't support MP4 */}
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay - Removed */}

      {/* Loading State */}
      {!isLoaded && !videoError && (
        <div className={styles.loading}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>
              {networkSlow && isMobile ? 'Slow connection detected...' :
               isMobile ? 'Loading video...' : 'Loading experience...'}
            </p>
            {loadAttempts > 0 && (
              <p className={styles.loadingText}>
                Retrying... ({loadAttempts}/3)
              </p>
            )}
            {networkSlow && isMobile && (
              <button
                onClick={handleSkip}
                className={styles.skipButton}
              >
                Skip Video (Slow Connection)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Video Error State */}
      {videoError && !isLoaded && (
        <div className={styles.loading}>
          <div className={styles.loadingContent}>
            <div className={styles.errorIcon}>⚠️</div>
            <p className={styles.loadingText}>Video failed to load</p>
            <button
              onClick={() => {
                setVideoError(false);
                setLoadAttempts(0);
                const video = videoRef.current;
                if (video) {
                  video.load();
                }
              }}
              className={styles.retryButton}
            >
              Retry
            </button>
            <button
              onClick={handleSkip}
              className={styles.skipButton}
            >
              Skip Video
            </button>
          </div>
        </div>
      )}

      {/* Skip Button - Always visible when video is loaded */}
      {isLoaded && (
        <div className={styles.playingOverlay}>
          <button
            onClick={handleSkip}
            className={styles.skipIntroButton}
          >
            Skip Intro
          </button>
        </div>
      )}

      {/* Main Content - Always render for fade animation */}
      {isLoaded && (
        <div
          className={styles.content}
          style={{
            opacity: showContent ? 1 : 0,
            transition: showContent ? 'none' : 'opacity 3s ease-out',
            pointerEvents: showContent ? 'auto' : 'none'
          }}
        >
          {/* Center Content - Only ENTER button and scroll indicator */}
          <div className={styles.center}>
            <div className={styles.centerContent}>
              {/* CTA Button */}
              <button
                onClick={handleEnter}
                className={styles.ctaButton}
                disabled={!showContent}
              >
                <span
                  ref={textRef}
                  className={styles.ctaText}
                  style={{
                    transform: showContent
                      ? `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                      : `translate(${mousePosition.x}px, ${mousePosition.y}px) translateY(-50px) scale(0.8) rotate(-2deg)`,
                    opacity: showContent ? 1 : 0,
                    filter: showContent ? 'none' : 'blur(8px)',
                    transition: showContent
                      ? 'transform 0.3s ease-out'
                      : 'opacity 3s ease-out, transform 3s ease-out, filter 3s ease-out'
                  }}
                >
                  ENTER
                </span>
              </button>

              {/* Scroll Indicator */}
              <div
                className={styles.scrollIndicator}
                style={{
                  opacity: showContent ? 1 : 0,
                  transition: showContent ? 'none' : 'opacity 3s ease-out'
                }}
              >
                <div className={styles.scrollIcon}>
                  <div className={styles.scrollDot}></div>
                </div>
                <p className={styles.scrollText}>Click to start</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Playing State Overlay */}
      {isPlaying && (
        <div className={styles.playingOverlay}>
          <button
            onClick={handleSkip}
            className={styles.skipIntroButton}
          >
            Skip Intro
          </button>
        </div>
      )}
    </div>
  );
}