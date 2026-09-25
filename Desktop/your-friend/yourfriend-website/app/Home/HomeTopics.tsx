"use client";

import { useEffect, useRef, useState } from "react";
import { exploreTopics } from "./homeData";
import styles from "./home.module.css";

export function HomeTopics() {
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
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.topicsSection} ${visible ? styles.topicsVisible : ""}`}
    >
      <div className={styles.sectionIntro}>
        <p className={styles.sectionEyebrow}>A SAFE CORNER</p>
        <h2>เรื่องไหนในใจก็เอามาคุยกับพี่หมีได้</h2>
        <p className={styles.topicsHint}>เลือกเรื่องที่ตรงกับใจตอนนี้ได้เลย</p>
      </div>

      <div className={styles.topicCloud}>
        {exploreTopics.map((topic, index) => (
          <span
            className={styles.topicChip}
            key={topic}
            style={{ transitionDelay: `${180 + index * 90}ms` }}
          >
            {topic}
          </span>
        ))}
      </div>

      <div className={styles.topicsPollen} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <span
            key={index}
            className={`${styles.topicPollenDot} ${styles[`topicPollenDot${index + 1}`]}`}
          />
        ))}
      </div>
    </section>
  );
}
