"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CloudUpload } from "lucide-react";

export default function ActiveChallengeHero() {
  return (
    <section className="w-full bg-white px-[40px] py-[64px]">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          relative
          mx-auto
          min-h-[560px]
          w-full
          max-w-[1410px]
          overflow-hidden
          rounded-[24px]
          bg-[#EFFBFF]
        "
      >
        {/* CONTENT */}
        <div className="relative z-10 flex min-h-[560px] w-[53%] flex-col justify-center px-[64px] py-[56px]">
          {/* STATUS */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.1,
              duration: 0.55,
            }}
            className="flex items-center gap-[20px]"
          >
            <div className="flex h-[52px] items-center justify-center rounded-[9px] bg-[#287CFF] px-[22px] text-[16px] font-medium tracking-[0.5px] text-white">
              SUBMISSION OPEN
            </div>

            <div className="flex h-[52px] items-center justify-center rounded-[9px] border border-[#D5DCE8] bg-white/80 px-[24px] text-[16px] font-medium text-[#111111]">
              AUG 1 - AUG 14, 2026
            </div>
          </motion.div>

          {/* TITLE */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.6,
            }}
            className="mt-[52px] text-[48px] font-semibold leading-[1.7] tracking-[-1.5px] text-black"
          >
            Design a Food
            <br />
            Delivery App
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
              duration: 0.6,
            }}
            className="mt-[20px] max-w-[600px] text-[16px] font-normal leading-[1.7] text-[#565656]"
          >
            Create a modern food delivery mobile app that helps users discover
            restaurants, browse menus, and place orders quickly with a smooth
            and enjoyable experience
          </motion.p>

          {/* ACTIONS */}
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
              duration: 0.6,
            }}
            className="mt-[42px] flex items-center gap-[42px]"
          >
            <Link
              href="/challenge/upload-design"
              className="
                group
                flex
                h-[58px]
                min-w-[235px]
                items-center
                justify-center
                gap-[10px]
                rounded-full
                border-[2px]
                border-[#287CFF]
                bg-[#287CFF]
                px-[24px]
                text-[16px]
                font-medium
                text-white
                ring-[5px]
                ring-[#DDEBFF]
                transition-all
                duration-300
                hover:-translate-y-[2px]
                hover:bg-[#1769E8]
                hover:shadow-[0_12px_30px_rgba(40,124,255,0.20)]
              "
            >
              <CloudUpload
                size={21}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:-translate-y-[2px]"
              />
              Upload your design!
            </Link>

            <Link
              href="/challenge/active/brief"
              className="group flex items-center gap-[7px] text-[16px] font-medium text-[#287CFF] underline underline-offset-[5px]"
            >
              Read Brief
              <ArrowUpRight
                size={16}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
              />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute bottom-0 right-0 top-0 w-[51%]"
        >
          <motion.div
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative h-full w-full"
          >
            <Image
              src="/challenge/hero.png"
              alt="Food delivery mobile app challenge"
              fill
              priority
              sizes="50vw"
              className="object-contain object-center"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
