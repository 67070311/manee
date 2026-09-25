"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

export function HomeFlowQuote() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.flowQuoteSection} ${isVisible ? styles.flowQuoteVisible : ""}`}
      aria-label="คำคมระหว่างการเดินทาง"
    >
      <div className={styles.flowQuotePollen} aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <span
            key={index}
            className={`${styles.quotePollen} ${styles[`quotePollen${index + 1}`]}`}
          />
        ))}
      </div>

      <div className={styles.flowQuoteContent}>
        <p>
          บางความรู้สึก ไม่ได้ต้องหยุดมัน
          <br />
          แค่ปล่อยให้มันไหลผ่านไป
        </p>
      </div>
    </section>
  );
}
