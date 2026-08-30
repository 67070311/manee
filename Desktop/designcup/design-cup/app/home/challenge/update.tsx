"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function Update() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 45,
        scale: 0.985,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative mt-[28px] h-[270px] w-full overflow-hidden rounded-[18px] bg-[#C96A19]"
    >
      {/* RIGHT IMAGE */}
      <motion.img
        src="/home/challenge/bg.png"
        alt="Food delivery app challenge"
        initial={{
          opacity: 0,
          scale: 1.06,
          x: 20,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
          x: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 1.05,
          delay: 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute inset-y-0 right-0 h-full w-[63%] object-cover object-center"
      />

      {/* DARK / ORANGE GRADIENT */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#B85F15_0%,#C86818_34%,rgba(207,105,22,0.94)_49%,rgba(226,116,22,0.62)_63%,rgba(240,129,24,0.15)_78%,rgba(255,255,255,0)_100%)]" />

      {/* SOFT LIGHT */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 1.1,
          delay: 0.15,
        }}
        animate={{
          x: [0, 10, 0],
          y: [0, -6, 0],
        }}
        className="pointer-events-none absolute left-[22%] top-1/2 h-[260px] w-[420px] -translate-y-1/2 rounded-full bg-[#FFB04F]/10 blur-[60px]"
      />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full w-[51%] flex-col justify-center px-[32px] text-white">
        {/* SMALL LABEL */}
        <motion.div
          initial={{
            opacity: 0,
            x: -18,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.14,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-[10px] flex items-center gap-[7px]"
        >
          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-[6px] w-[6px] rounded-full bg-[#FFD4A5]"
          />

          <span className="text-[11px] font-medium uppercase tracking-[1.3px] text-white/70">
            Weekly Challenge
          </span>
        </motion.div>

        {/* TITLE */}
        <motion.h3
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.22,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-[22px] font-medium leading-[1.2]"
        >
          Design a Food Delivery App
        </motion.h3>

        {/* BRIEF BADGE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 14,
            scale: 0.95,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-[14px]"
        >
          <motion.div
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            className="inline-flex h-[34px] items-center gap-[7px] rounded-full bg-white px-[14px]"
          >
            <span className="text-[14px]">🎨</span>

            <span className="text-[13px] font-medium text-[#287CFF]">
              Challenge Brief
            </span>
          </motion.div>
        </motion.div>

        {/* DESCRIPTION */}
        <motion.p
          initial={{
            opacity: 0,
            y: 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
            delay: 0.38,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-[14px] max-w-[500px] text-[13px] font-normal leading-[1.55] text-white/95"
        >
          Design a modern food delivery mobile app that helps users discover
          restaurants, browse menus, and place orders quickly with a smooth and
          intuitive experience.
        </motion.p>

        <motion.p
          initial={{
            opacity: 0,
            y: 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.65,
            delay: 0.46,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-[8px] max-w-[480px] text-[13px] font-normal leading-[1.55] text-white/90"
        >
          Focus on simplicity, usability, and an enjoyable ordering journey.
        </motion.p>

        {/* READ MORE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.54,
          }}
        >
          <Link
            href="/challenge/brief"
            className="group mt-[14px] inline-flex w-fit items-center gap-[6px] text-[13px] font-medium text-white"
          >
            <span className="border-b border-white/70 pb-[2px]">
              Read challenge details
            </span>

            <Icon
              icon="solar:arrow-right-up-linear"
              width="15"
              height="15"
              className="transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
            />
          </Link>
        </motion.div>
      </div>

      {/* DECORATIVE DOTS */}
      <motion.span
        animate={{
          y: [0, -5, 0],
          opacity: [0.2, 0.55, 0.2],
        }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[52%] top-[22%] h-[5px] w-[5px] rounded-full bg-white/25"
      />

      <motion.span
        animate={{
          y: [0, 4, 0],
          opacity: [0.18, 0.45, 0.18],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[58%] top-[67%] h-[4px] w-[4px] rounded-full bg-white/20"
      />

      <motion.span
        animate={{
          x: [0, 4, 0],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[47%] top-[47%] h-[3px] w-[3px] rounded-full bg-white/20"
      />
    </motion.div>
  );
}
