"use client";

import Image from "next/image";
import { useState } from "react";
import { journeyNodes, START_NODE_ID } from "./questionData";
import styles from "./futureFog.module.css";

type FutureFogQuestionProps = {
  onBack: () => void;
  onSummary: () => void;
};

function progressFromLabel(label: string) {
  if (label.startsWith("1")) return 33;
  if (label.startsWith("2")) return 66;
  return 100;
}

function imageForNode(nodeId: string, stepLabel: string) {
  if (nodeId === "encourage-more") return "/question/2.1.1.png";
  if (nodeId === "closing") return "/question/end-page.png";
  if (nodeId === "branch-b") return "/question/2.2.png";
  if (nodeId === "branch-c") return "/question/2.3.png";
  if (stepLabel.startsWith("1")) return "/question/start-page.png";
  if (stepLabel.startsWith("3")) return "/question/more-question.png";
  return "/question/2.1.png";
}

function BearChoiceIcon() {
  return (
    <svg className={styles.bearChoiceIcon} viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="10" cy="10" r="5" className={styles.bearEar} />
      <circle cx="26" cy="10" r="5" className={styles.bearEar} />
      <circle cx="18" cy="19" r="12" className={styles.bearHead} />
    </svg>
  );
}

export function FutureFogQuestion({ onBack, onSummary }: FutureFogQuestionProps) {
  const [currentNodeId, setCurrentNodeId] = useState(START_NODE_ID);
  const [history, setHistory] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const node = journeyNodes[currentNodeId];
  const selectedChoiceId = answers[node.id] ?? null;
  const progress = progressFromLabel(node.stepLabel);
  const isClosing = node.id === "closing";
  const isEncourageMore = node.id === "encourage-more";
  const isFirstQuestion = node.id === "future-fog";
  const isFlashlightPage = node.id === "branch-a" || node.id === "branch-b" || node.id === "branch-c";
  const sceneImage = imageForNode(node.id, node.stepLabel);
  const useLightPrompt = node.stepLabel.startsWith("2");

  const goToNode = (nextId: string) => {
    setHistory((previous) => [...previous, currentNodeId]);
    setCurrentNodeId(nextId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (history.length === 0) {
      onBack();
      return;
    }

    const previousNodeId = history[history.length - 1];
    setHistory((previous) => previous.slice(0, -1));
    setCurrentNodeId(previousNodeId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (node.type === "message") {
      if (node.nextId) goToNode(node.nextId);
      return;
    }

    if (!selectedChoiceId) return;
    const choice = node.choices?.find((item) => item.id === selectedChoiceId);
    if (!choice) return;
    goToNode(choice.nextId);
  };

  return (
    <main className={styles.page}>
      <section className={styles.mobileFrame}>
        <header className={styles.topbar}>
          <button
            className={styles.iconButton}
            type="button"
            onClick={handleBack}
            aria-label={history.length === 0 ? "กลับหน้าแรก" : "ย้อนกลับ"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5 8 12l7 7" />
            </svg>
          </button>
          <span className={styles.brand}>YOUR FRIEND</span>
          <span className={styles.counter}>{node.stepLabel}</span>
        </header>

        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={`${styles.scene} ${isEncourageMore ? styles.sceneFull : ""}`}>
          <Image
            src={sceneImage}
            alt="พี่หมีออกเดินทาง"
            fill
            priority
            sizes="(max-width: 430px) 100vw, 430px"
            className={styles.sceneImage}
          />
          {isFirstQuestion ? (
            <div className={styles.ambientMotes} aria-hidden="true">
              <span className={`${styles.ambientBug} ${styles.ambientBugOne}`} />
              <span className={`${styles.ambientBug} ${styles.ambientBugTwo}`} />
              <span className={`${styles.ambientBug} ${styles.ambientBugThree}`} />
              <span className={`${styles.ambientBug} ${styles.ambientBugFour}`} />
              <span className={`${styles.ambientBug} ${styles.ambientBugFive}`} />
              <span className={`${styles.ambientBug} ${styles.ambientBugSix}`} />
              <span className={`${styles.ambientBug} ${styles.ambientBugSeven}`} />
              <span className={`${styles.ambientBug} ${styles.ambientBugEight}`} />
              <span className={`${styles.ambientBug} ${styles.ambientBugNine}`} />
              <span className={`${styles.ambientBug} ${styles.ambientBugTen}`} />
            </div>
          ) : null}

          {isFlashlightPage ? (
            <div className={styles.fireflyEffects} aria-hidden="true">
              <span className={`${styles.firefly} ${styles.fireflyOne}`} />
              <span className={`${styles.firefly} ${styles.fireflyTwo}`} />
              <span className={`${styles.firefly} ${styles.fireflyThree}`} />
              <span className={`${styles.firefly} ${styles.fireflyFour}`} />
              <span className={`${styles.firefly} ${styles.fireflyFive}`} />
              <span className={`${styles.firefly} ${styles.fireflySix}`} />
              <span className={`${styles.firefly} ${styles.fireflySeven}`} />
              <span className={`${styles.firefly} ${styles.fireflyEight}`} />
              <span className={`${styles.firefly} ${styles.fireflyNine}`} />
              <span className={`${styles.firefly} ${styles.fireflyTen}`} />
            </div>
          ) : null}

          {isEncourageMore ? (
            <div className={styles.nightEffects} aria-hidden="true">
              <span className={`${styles.twinkle} ${styles.twinkleOne}`} />
              <span className={`${styles.twinkle} ${styles.twinkleTwo}`} />
              <span className={`${styles.twinkle} ${styles.twinkleThree}`} />
              <span className={`${styles.twinkle} ${styles.twinkleFour}`} />
              <span className={`${styles.twinkle} ${styles.twinkleFive}`} />
              <span className={`${styles.twinkle} ${styles.twinkleSix}`} />
              <span className={`${styles.twinkle} ${styles.twinkleSeven}`} />
              <span className={`${styles.twinkle} ${styles.twinkleEight}`} />
              <span className={`${styles.twinkle} ${styles.twinkleNine}`} />
              <span className={`${styles.twinkle} ${styles.twinkleTen}`} />
              <span className={`${styles.shootingStar} ${styles.shootingStarOne}`} />
              <span className={`${styles.shootingStar} ${styles.shootingStarTwo}`} />
              <span className={`${styles.shootingStar} ${styles.shootingStarThree}`} />
            </div>
          ) : null}

          {isClosing ? (
            <div className={styles.gardenEffects} aria-hidden="true">
              <span className={`${styles.butterfly} ${styles.butterflyOne}`} />
              <span className={`${styles.butterfly} ${styles.butterflyTwo}`} />
              <span className={`${styles.butterfly} ${styles.butterflyThree}`} />
              <span className={`${styles.pollen} ${styles.pollenOne}`} />
              <span className={`${styles.pollen} ${styles.pollenTwo}`} />
              <span className={`${styles.pollen} ${styles.pollenThree}`} />
              <span className={`${styles.pollen} ${styles.pollenFour}`} />
              <span className={`${styles.pollen} ${styles.pollenFive}`} />
              <span className={`${styles.pollen} ${styles.pollenSix}`} />
              <span className={`${styles.pollen} ${styles.pollenSeven}`} />
              <span className={`${styles.pollen} ${styles.pollenEight}`} />
              <span className={`${styles.pollen} ${styles.pollenNine}`} />
              <span className={`${styles.pollen} ${styles.pollenTen}`} />
            </div>
          ) : null}

          <div
            className={`${styles.questionOverlay} ${useLightPrompt ? styles.questionOverlayLight : ""} ${isEncourageMore ? styles.questionOverlayCompact : ""} ${isClosing ? styles.questionOverlayCentered : ""}`}
            key={`prompt-${node.id}`}
          >
            {node.eyebrow ? <p className={styles.eyebrow}>{node.eyebrow}</p> : null}
            <h1>{node.title}</h1>
            {node.prompt ? <p className={styles.prompt}>{node.prompt}</p> : null}
          </div>

          {isEncourageMore ? (
            <div className={styles.floatingNavigation}>
              <button className={styles.floatingSecondary} type="button" onClick={handleBack}>
                ย้อนกลับ
              </button>
              <button className={styles.floatingPrimary} type="button" onClick={handleNext}>
                ไปต่อ
              </button>
            </div>
          ) : null}
        </div>

        {!isEncourageMore ? (
          <section className={styles.answerArea} key={`answer-${node.id}`}>
            {node.type === "question" && node.choices ? (
              <div className={styles.choices}>
                {node.choices.map((choice, index) => {
                  const active = selectedChoiceId === choice.id;
                  const showLabel = node.showChoiceLabels !== false && choice.label;

                  return (
                    <button
                      key={choice.id}
                      type="button"
                      className={`${styles.choice} ${!showLabel ? styles.choiceNoLabel : ""} ${active ? styles.choiceActive : ""}`}
                      style={{ animationDelay: `${1550 + index * 190}ms` }}
                      onClick={() =>
                        setAnswers((previous) => ({
                          ...previous,
                          [node.id]: choice.id,
                        }))
                      }
                      aria-pressed={active}
                    >
                      {showLabel ? <span className={styles.choiceKey}>{choice.label}</span> : null}
                      <span className={styles.choiceText}>{choice.text}</span>
                      <span className={styles.choiceCheck}>{active ? <BearChoiceIcon /> : null}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className={styles.navigation}>
              <button className={styles.secondaryButton} type="button" onClick={handleBack}>
                {history.length === 0 ? "กลับหน้าแรก" : "ย้อนกลับ"}
              </button>

              {isClosing ? (
                <button className={styles.primaryButton} type="button" onClick={onSummary}>
                  ดูผลสรุป
                </button>
              ) : (
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={handleNext}
                  disabled={node.type === "question" && !selectedChoiceId}
                >
                  {node.type === "message" ? "ไปต่อ" : "ถัดไป"}
                </button>
              )}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
