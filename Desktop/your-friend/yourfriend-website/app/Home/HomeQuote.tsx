"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

export function HomeQuote() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.quoteSection} ${visible ? styles.quoteVisible : ""}`}
    >
      <div className={styles.quoteMark}>“</div>
      <p className={styles.quoteText}>
        บางวัน แค่ยอมให้ตัวเองพัก
        <br />
        ก็ถือว่าเดินมาไกลมากแล้วนะ
      </p>
      <p className={styles.quoteBy}>— จากพี่หมี</p>
    </section>
  );
}
