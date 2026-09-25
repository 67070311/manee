import styles from "./home.module.css";

export function HomeHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.brandDot} aria-hidden="true" />
        <div>
          <p className={styles.brandEyebrow}>YOUR FRIEND</p>
          <p className={styles.brandName}>พี่หมีอยู่ตรงนี้</p>
        </div>
      </div>
      <button className={styles.menuButton} type="button" aria-label="เปิดเมนู">
        <span />
        <span />
      </button>
    </header>
  );
}
