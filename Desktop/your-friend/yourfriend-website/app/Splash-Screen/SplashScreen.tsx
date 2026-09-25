"use client";

import Image from "next/image";
import styles from "../Home/home.module.css";

type SplashScreenProps = {
  leaving: boolean;
  onContinue: () => void;
};

export function SplashScreen({ leaving, onContinue }: SplashScreenProps) {
  return (
    <section
      className={`${styles.splashScreen} ${leaving ? styles.splashLeaving : ""}`}
      role="button"
      tabIndex={0}
      aria-label="กดเพื่อไปต่อ"
      onClick={onContinue}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onContinue();
      }}
    >
      <div className={styles.splashImageWrap} aria-hidden="true">
        <Image
          src="/splash-screen/01a0d79a-8d71-724d-b95a-dde746630355-ezgif.com-video-to-gif-converter.gif"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className={styles.splashImage}
        />
      </div>

      <div className={styles.splashIntro}>
        <Image
          src="/logo/logo2.png"
          alt="โลโก้ Your Friend"
          width={68}
          height={68}
          className={styles.splashlogo2}
          priority
        />
        <h1 className={styles.splashName}>
          <span>Your</span>
          <span>Friend</span>
        </h1>
      </div>

      <p className={styles.splashHint}>กดเพื่อไปต่อ</p>
    </section>
  );
}
