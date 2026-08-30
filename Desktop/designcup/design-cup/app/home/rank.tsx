"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, type TransitionEvent } from "react";

type Winner = {
  rank: number;
  image: string;
  avatar: string;
  name: string;
  username: string;
};

/*
  เรียงใหม่เพื่อให้ตอน Rank 1 อยู่ตรงกลาง:
  ซ้ายใกล้ = Rank 3
  ขวาใกล้ = Rank 2

  Layout จะประมาณ:
  5   3   1   2   4
*/
const winners: Winner[] = [
  {
    rank: 1,
    image: "/home/rank/1.png",
    avatar: "https://i.pravatar.cc/120?img=12",
    name: "Leo Botosh",
    username: "@anngeidt",
  },
  {
    rank: 2,
    image: "/home/rank/2.png",
    avatar: "https://i.pravatar.cc/120?img=47",
    name: "Leo Botosh",
    username: "@anngeidt",
  },
  {
    rank: 4,
    image: "/home/rank/4.png",
    avatar: "https://i.pravatar.cc/120?img=32",
    name: "Leo Botosh",
    username: "@anngeidt",
  },
  {
    rank: 5,
    image: "/home/rank/5.png",
    avatar: "https://i.pravatar.cc/120?img=11",
    name: "Leo Botosh",
    username: "@anngeidt",
  },
  {
    rank: 3,
    image: "/home/rank/3.png",
    avatar: "https://i.pravatar.cc/120?img=15",
    name: "Leo Botosh",
    username: "@anngeidt",
  },
];

const weeklyAvatars = [
  "https://i.pravatar.cc/80?img=5",
  "https://i.pravatar.cc/80?img=9",
  "https://i.pravatar.cc/80?img=21",
  "https://i.pravatar.cc/80?img=31",
  "https://i.pravatar.cc/80?img=45",
];

const rankColors: Record<number, string> = {
  1: "#F6BE17",
  2: "#4285F4",
  3: "#FF7B24",
  4: "#8D8D8D",
  5: "#FFAA69",
};

const carouselItems = Array.from({ length: 9 }, () => winners).flat();

const ITEM_WIDTH = 238;
const CENTER_START_INDEX = 20;

const particles = [
  {
    left: "7%",
    top: "22%",
    size: 5,
    delay: 0.2,
  },
  {
    left: "14%",
    top: "46%",
    size: 3,
    delay: 1.1,
  },
  {
    left: "22%",
    top: "17%",
    size: 4,
    delay: 0.7,
  },
  {
    left: "78%",
    top: "18%",
    size: 4,
    delay: 0.4,
  },
  {
    left: "86%",
    top: "42%",
    size: 3,
    delay: 1.4,
  },
  {
    left: "93%",
    top: "25%",
    size: 5,
    delay: 0.9,
  },
];

export default function Rank() {
  const [activeIndex, setActiveIndex] = useState(CENTER_START_INDEX);

  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.15,
  });

  const nextWinner = () => {
    setTransitionEnabled(true);
    setActiveIndex((current) => current + 1);
  };

  const previousWinner = () => {
    setTransitionEnabled(true);
    setActiveIndex((current) => current - 1);
  };

  const normalizeIndex = (index: number) => {
    const modulo = ((index % winners.length) + winners.length) % winners.length;

    return CENTER_START_INDEX + modulo;
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.currentTarget !== trackRef.current) {
      return;
    }

    if (event.propertyName !== "transform") {
      return;
    }

    if (activeIndex > 9 && activeIndex < 35) {
      return;
    }

    const newIndex = normalizeIndex(activeIndex);

    setTransitionEnabled(false);
    setActiveIndex(newIndex);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    });
  };

  const currentWinner = carouselItems[activeIndex] ?? winners[0];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white px-6 py-[78px]"
    >
      {/* LARGE BACKGROUND GLOW */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.75,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                scale: 1,
              }
            : {}
        }
        transition={{
          duration: 1.3,
          ease: "easeOut",
        }}
        className="pointer-events-none absolute left-1/2 top-[300px] h-[480px] w-[1050px] -translate-x-1/2 rounded-full bg-[#EAF3FF] blur-[110px]"
      />

      {/* SOFT BLUE TOP LIGHT */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
              }
            : {}
        }
        transition={{
          duration: 1.4,
          delay: 0.2,
        }}
        className="pointer-events-none absolute left-1/2 top-[180px] h-[280px] w-[580px] -translate-x-1/2 rounded-full bg-[#D9EAFF]/60 blur-[90px]"
      />

      {/* PARTICLES */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            initial={{
              opacity: 0,
            }}
            animate={
              isInView
                ? {
                    opacity: [0.15, 0.75, 0.15],
                    scale: [0.7, 1.4, 0.7],
                    y: [0, -10, 0],
                  }
                : {}
            }
            transition={{
              duration: 3.2,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full bg-[#74ADFF]"
          />
        ))}
      </div>

      {/* LEFT SPARKLE */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={
          isInView
            ? {
                opacity: [0.25, 1, 0.25],
                scale: [0.65, 1.1, 0.65],
                rotate: [0, 90, 180],
              }
            : {}
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-[10%] top-[240px]"
      >
        <svg width="28" height="28" viewBox="0 0 24 24">
          <path
            d="M12 2C12.8 7.8 16.2 11.2 22 12C16.2 12.8 12.8 16.2 12 22C11.2 16.2 7.8 12.8 2 12C7.8 11.2 11.2 7.8 12 2Z"
            fill="#B6D4FF"
          />
        </svg>
      </motion.div>

      {/* RIGHT SPARKLE */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={
          isInView
            ? {
                opacity: [0.2, 0.85, 0.2],
                scale: [0.6, 1, 0.6],
                rotate: [0, -90, -180],
              }
            : {}
        }
        transition={{
          duration: 4.5,
          delay: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[11%] top-[300px]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path
            d="M12 2C12.8 7.8 16.2 11.2 22 12C16.2 12.8 12.8 16.2 12 22C11.2 16.2 7.8 12.8 2 12C7.8 11.2 11.2 7.8 12 2Z"
            fill="#D4E7FF"
          />
        </svg>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        {/* WEEKLY BADGE */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
            scale: 0.95,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
              : {}
          }
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="flex w-full justify-center"
        >
          <motion.div
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            className="flex h-[42px] items-center rounded-full border border-[#E5EEFC] bg-white px-[16px] shadow-[0_8px_25px_rgba(40,124,255,0.07)]"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon
                icon="solar:star-ring-bold-duotone"
                width="18"
                height="18"
                className="mr-[9px] text-[#287CFF]"
              />
            </motion.div>

            <span className="whitespace-nowrap text-[14px] font-normal text-[#171717]">
              Weekly Design Challenges
            </span>

            <div className="ml-[12px] flex items-center">
              {weeklyAvatars.map((avatar, index) => (
                <motion.img
                  key={avatar}
                  src={avatar}
                  alt=""
                  initial={{
                    opacity: 0,
                    x: -8,
                    scale: 0.7,
                  }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          x: 0,
                          scale: 1,
                        }
                      : {}
                  }
                  transition={{
                    delay: 0.2 + index * 0.07,
                  }}
                  className={`h-[25px] w-[25px] rounded-full border-2 border-white object-cover ${
                    index === 0 ? "" : "-ml-[6px]"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* HEADING */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: "easeOut",
          }}
          className="mx-auto mt-[32px] text-center"
        >
          <h2 className="text-[34px] font-medium leading-[1.25] tracking-[-1px] text-[#111111]">
            Top 5 Winner In{" "}
            <span className="text-[#287CFF]">“Car Landing Page”</span>
          </h2>

          <p className="mt-[11px] text-[14px] leading-[1.6] text-[#777777]">
            Outstanding designs from Challenge Car Landing Page. Congratulations
            to all winners!
          </p>
        </motion.div>

        {/* SHOWCASE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 75,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 1,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative"
        >
          {/* CAROUSEL STAGE */}
          <div className="relative mt-[72px] h-[575px] w-full overflow-x-clip">
            {/* BACKGROUND ARC */}
            <svg
              className="pointer-events-none absolute left-1/2 top-[65px] h-[310px] w-[1050px] -translate-x-1/2 opacity-70"
              viewBox="0 0 1050 310"
              fill="none"
            >
              <path
                d="M70 255C235 80 815 80 980 255"
                stroke="#D9E9FF"
                strokeWidth="2"
                strokeDasharray="6 12"
              />

              <path
                d="M160 260C305 145 745 145 890 260"
                stroke="#EDF5FF"
                strokeWidth="1.5"
              />
            </svg>

            {/* CENTER SPOTLIGHT */}
            <div className="pointer-events-none absolute left-1/2 top-[55px] h-[390px] w-[290px] -translate-x-1/2 rounded-full bg-[#DCEBFF]/65 blur-[58px]" />

            {/* GOLD SPOTLIGHT */}
            <motion.div
              animate={{
                opacity: [0.25, 0.5, 0.25],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute left-1/2 top-[100px] h-[250px] w-[220px] -translate-x-1/2 rounded-full bg-[#FFE6A1]/35 blur-[60px]"
            />

            {/* LEFT CONTROL */}
            <motion.button
              type="button"
              onClick={previousWinner}
              aria-label="Previous winner"
              whileHover={{
                scale: 1.08,
                x: -3,
              }}
              whileTap={{
                scale: 0.93,
              }}
              className="absolute left-[18px] top-1/2 z-[80] flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-[#D9E5F5] bg-white/90 text-[#171717] shadow-[0_12px_35px_rgba(40,124,255,0.12)] backdrop-blur-md"
            >
              <Icon icon="solar:alt-arrow-left-linear" width="24" height="24" />
            </motion.button>

            {/* RIGHT CONTROL */}
            <motion.button
              type="button"
              onClick={nextWinner}
              aria-label="Next winner"
              whileHover={{
                scale: 1.08,
                x: 3,
              }}
              whileTap={{
                scale: 0.93,
              }}
              className="absolute right-[18px] top-1/2 z-[80] flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-[#D9E5F5] bg-white/90 text-[#171717] shadow-[0_12px_35px_rgba(40,124,255,0.12)] backdrop-blur-md"
            >
              <Icon
                icon="solar:alt-arrow-right-linear"
                width="24"
                height="24"
              />
            </motion.button>

            {/* TRACK */}
            <div
              ref={trackRef}
              onTransitionEnd={handleTransitionEnd}
              className="absolute bottom-[40px] left-1/2 flex w-max items-end will-change-transform"
              style={{
                transform: `translate3d(${-(
                  activeIndex * ITEM_WIDTH +
                  ITEM_WIDTH / 2
                )}px, 0, 0)`,

                transition: transitionEnabled
                  ? "transform 950ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "none",
              }}
            >
              {carouselItems.map((winner, index) => {
                const distance = Math.abs(index - activeIndex);

                const isCenter = distance === 0;

                const isNear = distance === 1;

                const isOuter = distance === 2;

                let scale = isCenter ? 1 : isNear ? 0.82 : isOuter ? 0.7 : 0.6;

                if (winner.rank === 1) {
                  scale *= 1.09;
                }

                /*
                    เพิ่มความเด่น Rank 2/3
                    นิดเดียว ไม่แซง Rank 1
                  */
                if (winner.rank === 2 || winner.rank === 3) {
                  scale *= 1.025;
                }

                const opacity = distance <= 2 ? 1 : 0;

                const zIndex = isCenter ? 50 : isNear ? 35 : isOuter ? 20 : 0;

                const rankLift =
                  winner.rank === 1
                    ? -28
                    : winner.rank === 2
                      ? -16
                      : winner.rank === 3
                        ? -16
                        : winner.rank === 4
                          ? 6
                          : 2;

                return (
                  <div
                    key={`${winner.rank}-${index}`}
                    className="relative flex h-[490px] w-[238px] shrink-0 items-end justify-center"
                    style={{
                      zIndex,
                    }}
                  >
                    {/* COMPLETE CARD */}
                    <div
                      className="flex w-[224px] origin-bottom flex-col items-center will-change-transform"
                      style={{
                        transform: `translate3d(0, ${rankLift}px, 0) scale(${scale})`,
                        opacity,

                        transition: transitionEnabled
                          ? `
                                  transform 950ms cubic-bezier(0.16, 1, 0.3, 1),
                                  opacity 550ms cubic-bezier(0.16, 1, 0.3, 1)
                                `
                          : "none",
                      }}
                    >
                      {/* DESIGN */}
                      <div className="relative w-[224px] pt-[43px]">
                        {/* CROWN - RANK 1 */}
                        {winner.rank === 1 && (
                          <motion.div
                            animate={{
                              y: [0, -3, 0],
                              rotate: [-4, 4, -4],
                            }}
                            transition={{
                              duration: 2.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="absolute left-1/2 top-[0px] z-40 -translate-x-1/2 text-[#F6BE17]"
                          >
                            <Icon
                              icon="solar:crown-bold"
                              width="28"
                              height="28"
                            />
                          </motion.div>
                        )}

                        {/* RANK 1 AURA */}
                        {winner.rank === 1 && (
                          <>
                            <div className="pointer-events-none absolute left-1/2 top-[43px] z-10 h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD661]/25 blur-[18px]" />

                            <motion.div
                              animate={{
                                scale: [1, 1.25, 1],
                                opacity: [0.3, 0, 0.3],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                              className="pointer-events-none absolute left-1/2 top-[43px] z-20 h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F6BE17]"
                            />
                          </>
                        )}

                        {/* RANK 2 DECORATION */}
                        {winner.rank === 2 && (
                          <>
                            <div className="pointer-events-none absolute left-1/2 top-[43px] z-10 h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4285F4]/15 blur-[15px]" />

                            <motion.div
                              animate={{
                                opacity: [0.25, 0.8, 0.25],
                                scale: [0.8, 1.05, 0.8],
                                rotate: [0, 90, 180],
                              }}
                              transition={{
                                duration: 3.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="pointer-events-none absolute right-[53px] top-[6px] z-40"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24">
                                <path
                                  d="M12 2C12.8 7.8 16.2 11.2 22 12C16.2 12.8 12.8 16.2 12 22C11.2 16.2 7.8 12.8 2 12C7.8 11.2 11.2 7.8 12 2Z"
                                  fill="#79A9F7"
                                />
                              </svg>
                            </motion.div>
                          </>
                        )}

                        {/* RANK 3 DECORATION */}
                        {winner.rank === 3 && (
                          <>
                            <div className="pointer-events-none absolute left-1/2 top-[43px] z-10 h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF7B24]/13 blur-[15px]" />

                            <motion.div
                              animate={{
                                opacity: [0.2, 0.75, 0.2],
                                scale: [0.75, 1, 0.75],
                                rotate: [0, -90, -180],
                              }}
                              transition={{
                                duration: 3.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="pointer-events-none absolute left-[53px] top-[8px] z-40"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24">
                                <path
                                  d="M12 2C12.8 7.8 16.2 11.2 22 12C16.2 12.8 12.8 16.2 12 22C11.2 16.2 7.8 12.8 2 12C7.8 11.2 11.2 7.8 12 2Z"
                                  fill="#FFAE78"
                                />
                              </svg>
                            </motion.div>
                          </>
                        )}

                        {/* RANK NUMBER */}
                        <div
                          style={{
                            backgroundColor: rankColors[winner.rank],
                          }}
                          className={`absolute left-1/2 top-[43px] z-30 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white font-medium text-white ${
                            winner.rank === 1
                              ? "h-[66px] w-[66px] text-[16px] shadow-[0_8px_24px_rgba(246,190,23,0.35)]"
                              : winner.rank === 2
                                ? "h-[60px] w-[60px] text-[14px] shadow-[0_7px_20px_rgba(66,133,244,0.22)]"
                                : winner.rank === 3
                                  ? "h-[60px] w-[60px] text-[14px] shadow-[0_7px_20px_rgba(255,123,36,0.20)]"
                                  : "h-[58px] w-[58px] text-[14px] shadow-[0_5px_15px_rgba(0,0,0,0.08)]"
                          }`}
                        >
                          {winner.rank}
                        </div>

                        {/* DESIGN IMAGE */}
                        <div
                          className={`overflow-hidden rounded-[10px] bg-white ${
                            winner.rank === 1
                              ? "shadow-[0_18px_48px_rgba(246,190,23,0.14)]"
                              : winner.rank === 2
                                ? "shadow-[0_12px_30px_rgba(66,133,244,0.09)]"
                                : winner.rank === 3
                                  ? "shadow-[0_12px_30px_rgba(255,123,36,0.08)]"
                                  : ""
                          }`}
                        >
                          <Image
                            src={winner.image}
                            alt={`Rank ${winner.rank} design`}
                            width={1435}
                            height={2424}
                            priority={winner.rank === 1}
                            className="h-[350px] w-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                          />
                        </div>
                      </div>

                      {/* PROFILE */}
                      <div
                        className={`relative z-20 -mt-[34px] flex w-[172px] flex-col items-center rounded-[8px] bg-white px-[14px] pb-[14px] pt-[36px] ${
                          winner.rank === 1
                            ? "shadow-[0_14px_35px_rgba(40,124,255,0.11)]"
                            : "shadow-[0_8px_22px_rgba(0,0,0,0.06)]"
                        }`}
                      >
                        <img
                          src={winner.avatar}
                          alt={winner.name}
                          className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white object-cover ${
                            winner.rank === 1
                              ? "h-[56px] w-[56px]"
                              : "h-[52px] w-[52px]"
                          }`}
                        />

                        <p className="whitespace-nowrap text-[14px] font-medium text-[#171717]">
                          {winner.name}
                        </p>

                        <p className="mt-[3px] whitespace-nowrap text-[12px] font-normal text-[#777777]">
                          {winner.username}
                        </p>

                        <Link
                          href={`/winners/${winner.rank}`}
                          className="mt-[11px] flex h-[36px] items-center justify-center rounded-[4px] bg-[#287CFF] px-[16px] text-[13px] font-normal text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#176DE8]"
                        >
                          See More
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTTOM STATUS */}
            <div className="absolute bottom-0 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-[14px] rounded-full border border-[#E3ECF9] bg-white/85 px-[16px] py-[7px] shadow-[0_8px_24px_rgba(40,124,255,0.07)] backdrop-blur-md">
              <span className="text-[12px] font-medium text-[#287CFF]">
                {String(currentWinner.rank).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-[5px]">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <div
                    key={rank}
                    className={`h-[4px] rounded-full transition-all duration-300 ${
                      currentWinner.rank === rank
                        ? "w-[20px] bg-[#287CFF]"
                        : "w-[4px] bg-[#D8E4F5]"
                    }`}
                  />
                ))}
              </div>

              <span className="text-[12px] text-[#A1A9B5]">05</span>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM ACTIONS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            delay: 0.9,
            duration: 0.7,
          }}
          className="mt-[32px] flex items-center justify-center gap-[18px]"
        >
          <motion.div
            whileHover={{
              y: -3,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/challenges/active"
              className="flex h-[48px] w-[180px] items-center justify-center rounded-full bg-[#287CFF] text-[14px] font-normal text-white shadow-[0_10px_25px_rgba(40,124,255,0.2)] transition-colors hover:bg-[#176DE8]"
            >
              View Challenge
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/winners"
              className="flex h-[48px] w-[180px] items-center justify-center rounded-full border border-[#E4EBF6] bg-white text-[14px] font-normal text-[#287CFF] transition-colors hover:bg-[#F5F8FF]"
            >
              See All Winners
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
