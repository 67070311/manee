"use client";

import { useEffect, useRef } from "react";
import { journeySteps } from "./homeData";
import styles from "./home.module.css";

export function HomeJourney() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add(styles.journeyVisible);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.journey} id="journey">
      <div className={`${styles.sectionIntro} ${styles.journeyReveal}`}>
        <p className={styles.sectionEyebrow}>OUR LITTLE JOURNEY</p>
        <h2>ค่อย ๆ ทำความรู้จักใจตัวเอง</h2>
        <p>ไม่ใช่แบบทดสอบที่ต้องทำให้ผ่าน แต่เป็นพื้นที่ให้เทอได้หยุดและฟังตัวเองมากขึ้น</p>
      </div>

      <div className={styles.stepList}>
        {journeySteps.map((step, index) => (
          <article
            className={`${styles.stepItem} ${styles.journeyReveal}`}
            style={{ transitionDelay: `${180 + index * 130}ms` }}
            key={step.number}
          >
            <span className={styles.stepNumber}>{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
