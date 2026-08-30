"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Body() {
  return (
    <div className="relative w-full py-[18px]">
      {/* MAIN BAR */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
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
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative mx-auto flex min-h-[116px] w-full items-center justify-between overflow-hidden rounded-[20px] border border-[#E7EDF7] bg-[#F9FBFF] px-[28px]"
      >
        {/* LEFT LIGHT */}
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
            delay: 0.1,
          }}
          className="pointer-events-none absolute left-[-80px] top-1/2 h-[180px] w-[280px] -translate-y-1/2 rounded-full bg-[#DCEBFF] blur-[80px]"
        />

        {/* CENTER LIGHT */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: 0.2,
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[130px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[50px]"
        />

        {/* LEFT CONTENT */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{
            delay: 0.15,
          }}
          className="relative z-10 flex items-center gap-[14px]"
        >
          {/* ICON */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
              rotate: -8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -2,
              rotate: 4,
            }}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] bg-[#287CFF] text-white shadow-[0_8px_22px_rgba(40,124,255,0.22)]"
          >
            <Icon
              icon="solar:clock-circle-bold-duotone"
              width="24"
              height="24"
            />
          </motion.div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[1px] text-[#8B96A8]">
              Submission opens in
            </p>

            <p className="mt-[3px] text-[16px] font-medium text-[#171717]">
              Ready for the next challenge?
            </p>
          </div>
        </motion.div>

        {/* COUNTDOWN */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-10 flex items-center gap-[7px]"
        >
          {/* DAYS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.32,
            }}
            className="flex min-w-[67px] flex-col items-center"
          >
            <span className="text-[28px] font-medium leading-none text-[#287CFF]">
              14
            </span>

            <span className="mt-[5px] text-[10px] text-[#7C8593]">DAYS</span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: 0.38,
            }}
            className="mb-[17px] text-[17px] text-[#CCD5E2]"
          >
            :
          </motion.span>

          {/* HOURS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.42,
            }}
            className="flex min-w-[67px] flex-col items-center"
          >
            <span className="text-[28px] font-medium leading-none text-[#287CFF]">
              28
            </span>

            <span className="mt-[5px] text-[10px] text-[#7C8593]">HOURS</span>
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: 0.48,
            }}
            className="mb-[17px] text-[17px] text-[#CCD5E2]"
          >
            :
          </motion.span>

          {/* MINUTES */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.52,
            }}
            className="flex min-w-[67px] flex-col items-center"
          >
            <span className="text-[28px] font-medium leading-none text-[#287CFF]">
              45
            </span>

            <span className="mt-[5px] text-[10px] text-[#7C8593]">MINUTES</span>
          </motion.div>
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          initial={{
            opacity: 0,
            x: 22,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.42,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-10 flex items-center gap-[9px]"
        >
          <motion.div
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/challenge/upload"
              className="group flex h-[43px] items-center gap-[7px] rounded-[12px] bg-[#287CFF] px-[17px] text-white shadow-[0_7px_20px_rgba(40,124,255,0.18)] transition-colors duration-300 hover:bg-[#176DE8]"
            >
              <Icon
                icon="solar:upload-minimalistic-bold-duotone"
                width="18"
                height="18"
                className="transition-transform duration-300 group-hover:-translate-y-[2px]"
              />

              <span className="text-[12px] font-medium">Upload design</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/challenge/brief"
              className="group flex h-[43px] items-center gap-[6px] rounded-[12px] border border-[#DDE6F3] bg-white px-[15px] text-[12px] font-medium text-[#287CFF] transition-colors duration-300 hover:border-[#C7D8F1]"
            >
              Brief
              <Icon
                icon="solar:arrow-right-up-linear"
                width="15"
                height="15"
                className="transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* DECORATIVE SHAPES */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="shape-float absolute left-[31%] top-[14px] h-[5px] w-[5px] rounded-full bg-[#73A8FF]/40" />

          <span className="shape-float-slow absolute left-[39%] bottom-[12px] h-[7px] w-[7px] rotate-45 bg-[#FF9A3D]/50" />

          <span className="shape-float absolute right-[31%] top-[14px] h-[10px] w-[10px] rounded-full border-2 border-[#8CC9BA]/50" />

          <svg
            viewBox="0 0 50 20"
            className="shape-wave absolute right-[24%] bottom-[4px] h-[15px] w-[38px]"
          >
            <path
              d="M2 12C7 2 12 18 17 8C22 -2 27 16 32 6C37 -4 42 14 48 4"
              fill="none"
              stroke="#F8739D"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>
        </div>
      </motion.div>

      {/* BOTTOM META */}
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
          delay: 0.58,
        }}
        className="mt-[9px] flex items-center justify-center gap-[18px]"
      >
        <div className="flex items-center gap-[5px] text-[10px] text-[#9AA3B1]">
          <Icon
            icon="solar:users-group-rounded-linear"
            width="13"
            height="13"
          />

          <span>Open for all designers</span>
        </div>

        <span className="h-[3px] w-[3px] rounded-full bg-[#D5DCE7]" />

        <div className="flex items-center gap-[5px] text-[10px] text-[#9AA3B1]">
          <Icon icon="solar:cup-star-linear" width="13" height="13" />

          <span>Top 5 designs will be featured</span>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes floatShape {
          0% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(5px, -5px, 0);
          }

          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes floatSlow {
          0% {
            transform: translate3d(0, 0, 0) rotate(45deg);
          }

          50% {
            transform: translate3d(-5px, 4px, 0) rotate(60deg);
          }

          100% {
            transform: translate3d(0, 0, 0) rotate(45deg);
          }
        }

        @keyframes waveMove {
          0% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(7px, -3px, 0);
          }

          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .shape-float {
          animation: floatShape 4s ease-in-out infinite;
        }

        .shape-float-slow {
          animation: floatSlow 5.5s ease-in-out infinite;
        }

        .shape-wave {
          animation: waveMove 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
