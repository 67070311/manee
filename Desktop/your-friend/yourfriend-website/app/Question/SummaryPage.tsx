"use client";

import Image from "next/image";
import styles from "./summary.module.css";

type SummaryPageProps = {
  onBack: () => void;
  onHome: () => void;
};

const iconify = (name: string, color?: string) => {
  const base = `https://api.iconify.design/${name}.svg`;
  return color ? `${base}?color=${encodeURIComponent(color)}` : base;
};

function Icon({ name, color, alt = "" }: { name: string; color?: string; alt?: string }) {
  return <img src={iconify(name, color)} alt={alt} aria-hidden={alt ? undefined : true} />;
}

export function SummaryPage({ onBack, onHome }: SummaryPageProps) {
  const shareSummary = async () => {
    const text = "แผนที่ก้าวต่อไปของน้องพิมพ์ — YourFriend";

    try {
      if (navigator.share) {
        await navigator.share({ title: "YourFriend", text });
        return;
      }
      await navigator.clipboard?.writeText(text);
    } catch {
      // User cancelled sharing or the browser blocked the share action.
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.mobileFrame}>
        <header className={styles.topbar}>
          <button className={styles.backButton} type="button" onClick={onBack} aria-label="ย้อนกลับ">
            <Icon name="solar:arrow-left-linear" color="#607d50" />
          </button>

          <div className={styles.brandWrap}>
            <Image src="/logo/logo2.png" alt="YourFriend" width={30} height={30} />
            <strong>YourFriend</strong>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>YOUR NEXT MAP</p>
            <h1>
              แผนที่ก้าวต่อไป
              <br />
              ของน้องพิมพ์
            </h1>
            <p className={styles.heroSub}>ยินดีด้วย! เธอเดินฝ่าหมอกควันครบ 14 วันแล้ว</p>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src="/summary/hero.png"
              alt="แผนที่ก้าวต่อไปของน้องพิมพ์"
              width={430}
              height={560}
              priority
              sizes="(max-width: 430px) 100vw, 430px"
              className={styles.heroImage}
            />
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.summarySection}>
            <div className={styles.sectionHeading}>
              <span>01</span>
              <div>
                <small>TRUE NORTH</small>
                <h2>เป้าหมายที่แท้จริง</h2>
              </div>
            </div>

            <div className={`${styles.card} ${styles.goalCard}`}>
              <div className={`${styles.iconTile} ${styles.greenTile}`}>
                <Icon name="solar:leaf-bold-duotone" color="#5f9654" />
              </div>
              <div>
                <p className={styles.cardEyebrow}>สิ่งที่ใจของเธอกำลังมุ่งไป</p>
                <p className={styles.goalText}>
                  “ตามหาความสำเร็จที่สร้างความมั่นคงเพื่อดูแลครอบครัว พร้อมกับได้ยืนยันความสามารถ
                  และอิสระในการตัดสินใจของตนเอง”
                </p>
              </div>
            </div>
          </section>

          <section className={styles.summarySection}>
            <div className={styles.sectionHeading}>
              <span>02</span>
              <div>
                <small>YOUR STRENGTHS</small>
                <h2>จุดแข็งที่เห็นชัด</h2>
              </div>
            </div>

            <article className={`${styles.strengthCard} ${styles.blueCard}`}>
              <div className={`${styles.iconTile} ${styles.blueTile}`}>
                <Icon name="solar:waterdrops-bold-duotone" color="#4f96c8" />
              </div>
              <div className={styles.strengthBody}>
                <span className={styles.skillTag}>Cognitive Adaptability</span>
                <h3>การไหลตามกระแส</h3>
                <p>
                  เธอมีทักษะ Cognitive Reframing ที่เด่นมาก เมื่อเจอกับแผนที่ล้มเหลว เธอมองหา
                  “โอกาสที่ซ่อนอยู่” และปรับเปลี่ยนกลยุทธ์ได้อย่างรวดเร็ว โดยไม่สูญเสียทัศนคติเชิงบวก
                </p>
              </div>
            </article>

            <article className={`${styles.strengthCard} ${styles.pinkCard}`}>
              <div className={`${styles.iconTile} ${styles.pinkTile}`}>
                <Icon name="solar:heart-shine-bold-duotone" color="#d36891" />
              </div>
              <div className={styles.strengthBody}>
                <span className={styles.skillTag}>Reflective Awareness</span>
                <h3>การตระหนักรู้อย่างลึกซึ้ง</h3>
                <p>
                  เธอยอมรับความกังวลและความผิดพลาดของตนเองเป็น “ส่วนหนึ่งของการเรียนรู้” อย่างซื่อสัตย์
                  ทำให้เข้าใจสาเหตุที่แท้จริงของแรงกดดัน และจัดการกับมันได้ตั้งแต่ต้นเหตุ
                </p>
              </div>
            </article>
          </section>

          <section className={styles.summarySection}>
            <div className={styles.sectionHeading}>
              <span>03</span>
              <div>
                <small>BEST ENVIRONMENT</small>
                <h2>พื้นที่ที่เหมาะกับเธอ</h2>
              </div>
            </div>

            <div className={`${styles.card} ${styles.environmentCard}`}>
              <div className={styles.environmentIntro}>
                <div className={`${styles.iconTile} ${styles.yellowTile}`}>
                  <Icon name="solar:sun-2-bold-duotone" color="#e7a928" />
                </div>
                <div>
                  <small>ที่ที่เธอจะเติบโตได้ดีที่สุด</small>
                  <h3>อิสระ + ทีมที่ปลอดภัย</h3>
                </div>
              </div>

              <div className={styles.environmentList}>
                <div className={styles.environmentItem}>
                  <span className={`${styles.miniIcon} ${styles.greenMini}`}>
                    <Icon name="solar:buildings-3-bold-duotone" color="#5e9a57" />
                  </span>
                  <div>
                    <strong>High Autonomy</strong>
                    <p>ที่ทำงานที่ให้อิสระในการตัดสินใจ</p>
                  </div>
                </div>
                <div className={styles.environmentItem}>
                  <span className={`${styles.miniIcon} ${styles.blueMini}`}>
                    <Icon name="solar:shield-check-bold-duotone" color="#4a95c9" />
                  </span>
                  <div>
                    <strong>Safe-to-Fail Culture</strong>
                    <p>ทีมที่เปิดพื้นที่ให้ลอง ผิด และเรียนรู้ได้</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.actionsSection}>
            <div className={styles.nextStepHeading}>
              <span className={styles.sparkIcon}><Icon name="solar:stars-bold-duotone" color="#80a447" /></span>
              <div>
                <small>WHAT&apos;S NEXT?</small>
                <h2>เก็บแผนที่นี้ไว้กับเธอ</h2>
              </div>
            </div>

            <div className={styles.actionGrid}>
              <button type="button" className={styles.actionCard} onClick={() => window.print()}>
                <span className={`${styles.actionIcon} ${styles.greenTile}`}>
                  <Icon name="solar:download-minimalistic-bold-duotone" color="#5d9952" />
                </span>
                <strong>บันทึกผลสรุป</strong>
                <small>เก็บเฉพาะแผนที่ด้านบน</small>
              </button>

              <button type="button" className={styles.actionCard} onClick={shareSummary}>
                <span className={`${styles.actionIcon} ${styles.instagramTile}`}>
                  <Icon name="skill-icons:instagram" />
                </span>
                <strong>แชร์ลง IG Story</strong>
                <small>บอกเล่าเรื่องราวของเธอ</small>
              </button>
            </div>

            <button type="button" className={styles.premiumAction}>
              <span className={styles.premiumIcon}><Icon name="solar:crown-star-bold-duotone" color="#ffe28a" /></span>
              <span>
                <small>PREMIUM MATCH</small>
                <strong>ส่งโปรไฟล์ให้บริษัทที่ตรงใจ</strong>
              </span>
              <span className={styles.arrowIcon}><Icon name="solar:arrow-right-linear" color="#ffffff" /></span>
            </button>

            <button type="button" className={styles.homeAction} onClick={onHome}>
              <span><Icon name="solar:home-2-bold-duotone" color="#6f915e" /></span>
              <strong>กลับหน้าแรก</strong>
            </button>
          </section>

          <footer className={styles.footer}>
            <div className={styles.footerBrand}>
              <Image src="/logo/logo2.png" alt="YourFriend" width={28} height={28} />
              <strong>YourFriend</strong>
            </div>
            <p>เพื่อนที่อบอุ่น เข้าใจ และไม่ตัดสิน</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
