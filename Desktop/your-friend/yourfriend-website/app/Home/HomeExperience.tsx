"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FutureFogQuestion } from "../Question/FutureFogQuestion";
import { SummaryPage } from "../Question/SummaryPage";
import { SplashScreen } from "../Splash-Screen/SplashScreen";
import { HomeHero } from "./HomeHero";
import { HomeJourney } from "./HomeJourney";
import { HomeFlowQuote } from "./HomeFlowQuote";
import { HomeTopics } from "./HomeTopics";
import { HomeQuote } from "./HomeQuote";
import styles from "./home.module.css";

type View = "home" | "futureFog" | "summary";

export function HomeExperience() {
  const [showSplash, setShowSplash] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [view, setView] = useState<View>("home");
  const closingRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showSplash || view !== "home") return;

    const targets = [closingRef.current, footerRef.current, endRef.current].filter(
      (target): target is HTMLElement => Boolean(target),
    );

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [showSplash, view]);

  const continueFromSplash = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => setShowSplash(false), 520);
  };

  const openFutureFog = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView("futureFog");
  };

  const openSummary = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView("summary");
  };

  const backHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView("home");
  };

  const backToQuestions = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setView("futureFog");
  };

  if (showSplash) {
    return <SplashScreen leaving={leaving} onContinue={continueFromSplash} />;
  }

  if (view === "futureFog") {
    return <FutureFogQuestion onBack={backHome} onSummary={openSummary} />;
  }

  if (view === "summary") {
    return <SummaryPage onBack={backToQuestions} onHome={backHome} />;
  }

  return (
    <main className={`${styles.page} ${styles.homeEntering}`}>
      <HomeHero onStart={openFutureFog} />
      <div className={styles.mobileCanvas}>
        <HomeJourney />
        <HomeFlowQuote />
        <HomeTopics />
        <HomeQuote />

        <section ref={closingRef} className={`${styles.closingCta} ${styles.revealBlock}`}>
          <p className={styles.closingEyebrow}>READY WHEN YOU ARE</p>
          <h2>
            ถ้าพร้อมแล้ว
            <br />
            พี่หมีจะเดินไปกับเธอเอง
          </h2>
          <p className={styles.closingText}>
            ใช้เวลาประมาณ 5–10 นาที ค่อย ๆ ตอบตามความรู้สึกของตัวเองได้เลย ไม่มีคำตอบที่ถูกหรือผิด
          </p>
          <button type="button" className={styles.closingButton} onClick={openFutureFog}>
            <span>เริ่มออกเดินทาง</span>
            <span className={styles.closingButtonIcon} aria-hidden="true">
              <img src="https://api.iconify.design/solar:arrow-right-linear.svg" alt="" />
            </span>
          </button>
          <small className={styles.closingNote}>พื้นที่นี้มีไว้ให้เธอค่อย ๆ รู้จักตัวเองมากขึ้น</small>
        </section>

        <footer ref={footerRef} className={`${styles.footer} ${styles.revealBlock}`}>
          <span>Your Friend</span>
          <span>พื้นที่เล็ก ๆ ของหัวใจ</span>
        </footer>

        <div ref={endRef} className={`${styles.endArtwork} ${styles.revealBlock}`} aria-hidden="true">
          <Image
            src="/home/End.png"
            alt=""
            width={430}
            height={287}
            sizes="(max-width: 430px) 100vw, 430px"
            className={styles.endArtworkImage}
          />
        </div>
      </div>
    </main>
  );
}
