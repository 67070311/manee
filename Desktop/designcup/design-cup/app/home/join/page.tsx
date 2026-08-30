"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function Join() {
  return (
    <section className="w-full bg-white px-6 py-[34px]">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.985,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.35,
        }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative mx-auto flex h-[180px] w-full max-w-[1400px] items-center justify-between overflow-hidden rounded-[24px] px-[42px]"
      >
        {/* MAIN GRADIENT */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#7FACF7_0%,#B8CDF0_30%,#E3E3DF_57%,#EDE6D8_78%,#E9C89F_100%)]" />

        {/* LEFT BLUE GLOW */}
        <motion.div
          animate={{
            x: [0, 15, 0],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-[-100px] top-1/2 h-[270px] w-[360px] -translate-y-1/2 rounded-full bg-[#4285F4]/30 blur-[80px]"
        />

        {/* RIGHT GOLD GLOW */}
        <motion.div
          animate={{
            x: [0, -12, 0],
            opacity: [0.25, 0.48, 0.25],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute right-[-70px] top-1/2 h-[260px] w-[330px] -translate-y-1/2 rounded-full bg-[#F2B45D]/30 blur-[75px]"
        />

        {/* CENTER LIGHT */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[160px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-[55px]" />

        {/* DECORATIVE DOTS */}
        <motion.span
          animate={{
            y: [0, -6, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[43%] top-[32px] h-[5px] w-[5px] rounded-full bg-white/70"
        />

        <motion.span
          animate={{
            y: [0, 5, 0],
            opacity: [0.25, 0.65, 0.25],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[52%] bottom-[26px] h-[4px] w-[4px] rounded-full bg-white/60"
        />

        <motion.div
          animate={{
            rotate: [0, 90, 180],
            scale: [0.8, 1.05, 0.8],
            opacity: [0.2, 0.55, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute right-[26%] top-[30px]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M12 2C12.8 7.8 16.2 11.2 22 12C16.2 12.8 12.8 16.2 12 22C11.2 16.2 7.8 12.8 2 12C7.8 11.2 11.2 7.8 12 2Z"
              fill="rgba(255,255,255,0.75)"
            />
          </svg>
        </motion.div>

        {/* LEFT CONTENT */}
        <div className="relative z-10">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
          >
            <div className="mb-[8px] flex items-center gap-[7px]">
              <span className="h-[6px] w-[6px] rounded-full bg-white/80" />

              <span className="text-[10px] font-medium uppercase tracking-[1.4px] text-white/70">
                Design Community
              </span>
            </div>

            <h2 className="text-[34px] font-medium leading-[1.15] tracking-[-0.8px] text-white">
              Ready for the challenge?
            </h2>

            <p className="mt-[12px] text-[15px] font-normal text-white/80">
              Join thousands of designers and showcase your creativity.
            </p>
          </motion.div>
        </div>

        {/* RIGHT BUTTON */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
            delay: 0.25,
          }}
          className="relative z-10"
        >
          <motion.div
            whileHover={{
              scale: 1.035,
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/challenges/active"
              className="group flex h-[58px] min-w-[230px] items-center justify-center gap-[12px] rounded-full border-[4px] border-white/70 bg-white/95 px-[26px] text-[14px] font-medium text-[#287CFF] shadow-[0_10px_30px_rgba(35,70,120,0.12)] backdrop-blur-md transition hover:bg-white"
            >
              Join Now
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#EEF5FF] transition-all duration-300 group-hover:translate-x-[3px] group-hover:bg-[#287CFF] group-hover:text-white">
                <Icon icon="solar:arrow-right-linear" width="16" height="16" />
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* BOTTOM HIGHLIGHT */}
        <div className="pointer-events-none absolute bottom-0 left-[12%] h-px w-[76%] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
