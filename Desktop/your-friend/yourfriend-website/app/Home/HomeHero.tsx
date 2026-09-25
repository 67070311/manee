import Image from "next/image";
import styles from "./home.module.css";

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4.1 3.2-6 7.5-6s6.7 1.9 7.5 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <img src="https://api.iconify.design/solar:arrow-right-linear.svg" alt="" />
  );
}

type HomeHeroProps = {
  onStart: () => void;
};

export function HomeHero({ onStart }: HomeHeroProps) {
  return (
    <section
      className={styles.homeArtworkSection}
      aria-label="หน้าแรก Your Friend"
    >
      <Image
        src="/home/Hero.png"
        alt="พี่หมีโบกมืออยู่กลางทุ่งดอกไม้"
        fill
        priority
        sizes="(max-width: 430px) 100vw, 430px"
        className={styles.homeArtworkImage}
      />

      <div className={styles.homeTopbar}>
        <div className={styles.homeBrand}>
          <Image
            src="/logo/logo2.png"
            alt="Your Friend"
            width={34}
            height={34}
            className={styles.homeBrandlogo2}
            priority
          />
          <span className={styles.homeBrandText}>YourFriend</span>
        </div>
        <div className={styles.homeActionGroup}>
          <button
            className={styles.homeIconButton}
            type="button"
            aria-label="การแจ้งเตือน"
          >
            <BellIcon />
            <span className={styles.notificationDot} />
          </button>
          <button
            className={styles.homeIconButton}
            type="button"
            aria-label="โปรไฟล์"
          >
            <ProfileIcon />
          </button>
        </div>
      </div>

      <div className={styles.homeHeroContent}>
        <p className={styles.homeHeroKicker}>พื้นที่เล็ก ๆ ให้เทอได้พักใจ</p>
        <h1 className={styles.homeHeroTitle}>
          พร้อมออกเดินทาง
          <br />
          กันไหม?
        </h1>
        <p className={styles.homeHeroDescription}>
          ค่อย ๆ ทำความรู้จักความรู้สึกของตัวเอง สำรวจเรื่องที่อยู่ในใจ
          และเรียนรู้วิธีดูแลตัวเองในแต่ละวันไปพร้อมกับพี่หมี
        </p>
        <button
          className={styles.homeHeroButton}
          type="button"
          onClick={onStart}
        >
          <span>ร่วมผจญภัยไปกับเรา</span>
          <span className={styles.homeHeroButtonIcon} aria-hidden="true">
            <ArrowIcon />
          </span>
        </button>
      </div>
    </section>
  );
}
