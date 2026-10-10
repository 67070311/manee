"use client";

import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let frame = 0;
    let restartTimer: ReturnType<typeof setTimeout> | null = null;

    const updateOpacity = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        const fade = 0.5;
        const time = video.currentTime;
        const remaining = video.duration - time;

        let opacity = 1;
        if (time < fade) opacity = Math.max(0, Math.min(1, time / fade));
        if (remaining < fade) opacity = Math.max(0, Math.min(1, remaining / fade));

        video.style.opacity = String(opacity);
      }

      frame = requestAnimationFrame(updateOpacity);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      restartTimer = setTimeout(() => {
        video.currentTime = 0;
        void video.play();
      }, 100);
    };

    video.addEventListener("ended", handleEnded);
    frame = requestAnimationFrame(updateOpacity);
    void video.play().catch(() => {});

    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener("ended", handleEnded);
      if (restartTimer) clearTimeout(restartTimer);
    };
  }, []);

  return (
    <div className="heroVideoLayer" aria-hidden="true">
      <video
        ref={videoRef}
        className="heroVideo"
        src={VIDEO_URL}
        muted
        playsInline
        autoPlay
        preload="auto"
      />
      <div className="heroVideoOverlay" />
    </div>
  );
}
