"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const stars = [
  { left: "8%", top: "18%", size: 8, delay: 0.2, duration: 2.8 },
  { left: "14%", top: "38%", size: 5, delay: 1.1, duration: 3.2 },
  { left: "22%", top: "16%", size: 6, delay: 0.7, duration: 2.5 },
  { left: "32%", top: "30%", size: 4, delay: 1.5, duration: 3.4 },
  { left: "42%", top: "12%", size: 7, delay: 0.5, duration: 2.7 },
  { left: "55%", top: "22%", size: 5, delay: 1.8, duration: 3.1 },
  { left: "67%", top: "15%", size: 7, delay: 0.9, duration: 2.9 },
  { left: "76%", top: "33%", size: 4, delay: 1.4, duration: 3.4 },
  { left: "86%", top: "20%", size: 6, delay: 0.3, duration: 2.6 },
  { left: "92%", top: "45%", size: 5, delay: 1.7, duration: 3 },
];

const sparkles = [
  { left: "18%", top: "26%", delay: 0 },
  { left: "72%", top: "22%", delay: 1.2 },
  { left: "82%", top: "48%", delay: 0.6 },
  { left: "38%", top: "42%", delay: 1.8 },
];

export default function Hero() {
  return (
    <section className="relative min-h-[700px] w-full overflow-hidden bg-[linear-gradient(180deg,#DDF3FF_0%,#86B7F6_55%,#D9F2FF_100%)]">
      {/* BACKGROUND GLOW */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute left-1/2 top-[110px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/20 blur-[110px]"
      />

      {/* SMALL FLOATING STARS */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {stars.map((star, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              boxShadow: "0 0 12px rgba(255,255,255,0.9)",
            }}
            animate={{
              opacity: [0.2, 1, 0.3],
              scale: [0.7, 1.35, 0.8],
              y: [0, -5, 0],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* SPARKLE STARS */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {sparkles.map((sparkle, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: sparkle.left,
              top: sparkle.top,
            }}
            animate={{
              opacity: [0.15, 1, 0.15],
              scale: [0.6, 1.15, 0.6],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 3,
              delay: sparkle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12.8 7.8 16.2 11.2 22 12C16.2 12.8 12.8 16.2 12 22C11.2 16.2 7.8 12.8 2 12C7.8 11.2 11.2 7.8 12 2Z"
                fill="white"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* SHOOTING STAR 1 */}
      <motion.div
        className="pointer-events-none absolute left-[-180px] top-[120px] z-[1]"
        animate={{
          x: ["0vw", "125vw"],
          y: [0, 240],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 4.8,
          delay: 1.5,
          repeat: Infinity,
          repeatDelay: 6,
          ease: "easeInOut",
        }}
      >
        <div className="relative h-[2px] w-[130px] rotate-[18deg] bg-gradient-to-r from-transparent via-white/60 to-white">
          <div className="absolute right-[-3px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,1)]" />
        </div>
      </motion.div>

      {/* SHOOTING STAR 2 */}
      <motion.div
        className="pointer-events-none absolute left-[-220px] top-[260px] z-[1]"
        animate={{
          x: ["0vw", "125vw"],
          y: [0, 170],
          opacity: [0, 0.9, 0.9, 0],
        }}
        transition={{
          duration: 5.5,
          delay: 5.8,
          repeat: Infinity,
          repeatDelay: 8,
          ease: "easeInOut",
        }}
      >
        <div className="relative h-[1.5px] w-[100px] rotate-[14deg] bg-gradient-to-r from-transparent via-white/50 to-white">
          <div className="absolute right-[-2px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,1)]" />
        </div>
      </motion.div>

      {/* FLOATING DECORATION */}
      <motion.div
        animate={{
          y: [0, -16, 0],
          x: [0, 10, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[8%] top-[140px] z-[1] h-[90px] w-[90px] rounded-full bg-white/10 blur-[2px]"
      />

      {/* CHARACTER */}
      <motion.div
        initial={{
          opacity: 0,
          x: -80,
          y: 30,
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: {
            duration: 0.8,
          },
          x: {
            duration: 0.8,
            ease: "easeOut",
          },
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="absolute bottom-0 left-0 z-[2]"
      >
        <Image
          src="/home/hero.png"
          alt="Designer illustration"
          width={1580}
          height={1527}
          priority
          className="h-auto w-[290px] object-contain"
        />
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-[980px] flex-col items-center px-6 pt-[170px] text-center">
        {/* BADGE */}
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          whileHover={{
            scale: 1.03,
          }}
          className="flex h-[42px] w-[345px] items-center justify-center gap-[10px] rounded-full bg-white/35 backdrop-blur-sm"
        >
          <motion.div
            animate={{
              rotate: [0, 12, -12, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon
              icon="solar:star-ring-bold-duotone"
              width="22"
              height="22"
              className="text-[#287CFF]"
            />
          </motion.div>

          <span className="text-[16px] font-normal text-[#1D1D1D]">
            Weekly Design Challenges
          </span>
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.75,
            ease: "easeOut",
          }}
          className="mt-[34px] text-[48px] font-medium leading-[1.1] tracking-[-1.5px] text-black"
        >
          Compete Create Get Recognized
        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mt-[18px] max-w-[760px] text-[16px] font-normal leading-[1.65] text-white"
        >
          Discover thousands of inspiring designs, compete in weekly creative
          challenges, and showcase your
          <br />
          work to designers around the world.
        </motion.p>

        {/* SEARCH */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            delay: 0.45,
            duration: 0.75,
            ease: "easeOut",
          }}
          whileHover={{
            y: -2,
          }}
          className="mt-[24px] flex h-[66px] w-full max-w-[930px] items-center rounded-full bg-[#F8F8FF] p-[8px] shadow-[0_12px_35px_rgba(72,125,200,0.12)]"
        >
          {/* SEARCH ICON */}
          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: 5,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#287CFF]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />

              <path
                d="M16 16L20 20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          {/* INPUT */}
          <input
            type="text"
            placeholder="Search assets"
            className="h-full flex-1 bg-transparent px-[18px] text-[16px] font-normal text-[#2C2C2C] outline-none placeholder:text-[#6C728A]"
          />

          {/* MOST RECENT */}
          <motion.button
            type="button"
            whileHover={{
              scale: 1.03,
              y: -1,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="flex h-[50px] min-w-[158px] items-center justify-center gap-[10px] rounded-full border border-[#C8CEDA] bg-white px-5 text-[16px] font-normal text-[#454B59]"
          >
            <motion.svg
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 7H19"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M5 12H14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M5 17H9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </motion.svg>
            Most Recent
          </motion.button>
        </motion.div>

        {/* BUTTONS */}
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
            duration: 0.75,
            ease: "easeOut",
          }}
          className="mt-[54px] flex items-center gap-[24px]"
        >
          <motion.div
            whileHover={{
              y: -4,
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/challenges/active"
              className="flex h-[56px] w-[200px] items-center justify-center rounded-full bg-[#287CFF] text-[16px] font-normal text-white shadow-[0_10px_24px_rgba(40,124,255,0.25)] transition hover:bg-[#176DE8]"
            >
              Start Challenge
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              y: -4,
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/explore/landing-page"
              className="flex h-[56px] w-[200px] items-center justify-center rounded-full bg-white text-[16px] font-normal text-[#287CFF] shadow-[0_10px_24px_rgba(255,255,255,0.18)] transition hover:bg-[#F5F8FF]"
            >
              Explore Design
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
