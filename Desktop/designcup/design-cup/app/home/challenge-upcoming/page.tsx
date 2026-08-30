"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";

export default function ChallengeUpcoming() {
  return (
    <section className="w-full bg-white px-6 py-[90px]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative mx-auto h-[500px] w-full max-w-[1180px] overflow-hidden rounded-[38px] bg-[#287CFF]"
      >
        {/* CENTER CONTENT */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <div className="flex w-full max-w-[650px] flex-col items-center text-center text-white">
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.12,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center text-[48px] font-medium leading-[1.28] tracking-[-1.2px]"
            >
              Ready for the Next
              <br />
              Challenge?
            </motion.h2>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.25,
                duration: 0.65,
              }}
              className="mt-[28px] flex flex-col items-center"
            >
              <p className="text-center text-[16px] font-normal text-white/90">
                Start in
              </p>

              <div className="mt-[12px] flex items-start justify-center gap-[42px]">
                <TimeItem value="14" label="Days" />
                <TimeItem value="28" label="Hours" />
                <TimeItem value="45" label="Minutes" />
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.4,
                duration: 0.65,
              }}
              className="mt-[42px] flex items-center justify-center gap-[16px]"
            >
              {/* Active Challenges */}
              <Link
                href="/challenges/active"
                className="
                  group
                  flex
                  h-[56px]
                  min-w-[230px]
                  items-center
                  justify-center
                  gap-[8px]
                  whitespace-nowrap
                  rounded-[16px]
                  bg-white
                  px-[22px]
                  text-[16px]
                  font-medium
                  text-[#1768DA]
                  transition-all
                  duration-300
                  hover:-translate-y-[3px]
                  hover:shadow-[0_14px_32px_rgba(0,0,0,0.14)]
                "
              >
                <span className="whitespace-nowrap">
                  View Active Challenges
                </span>

                <Icon
                  icon="solar:arrow-right-linear"
                  width="18"
                  height="18"
                  className="
                    w-0
                    shrink-0
                    -translate-x-[6px]
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:w-[18px]
                    group-hover:translate-x-0
                    group-hover:opacity-100
                  "
                />
              </Link>

              {/* Notify */}
              <button
                type="button"
                className="
                  group
                  flex
                  h-[56px]
                  min-w-[250px]
                  items-center
                  justify-center
                  gap-[8px]
                  whitespace-nowrap
                  rounded-[16px]
                  bg-[#075FCF]
                  px-[22px]
                  text-[16px]
                  font-medium
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-[3px]
                  hover:bg-[#0457BF]
                  hover:shadow-[0_14px_32px_rgba(0,0,0,0.14)]
                "
              >
                <span className="whitespace-nowrap">
                  Get Notified of Upcoming
                </span>

                <Icon
                  icon="solar:bell-bing-bold-duotone"
                  width="19"
                  height="19"
                  className="
                    w-0
                    shrink-0
                    -translate-x-[6px]
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:w-[19px]
                    group-hover:translate-x-0
                    group-hover:opacity-100
                  "
                />
              </button>
            </motion.div>
          </div>
        </div>

        {/* CHARACTER */}
        <motion.div
          initial={{
            opacity: 0,
            x: 70,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{ once: true }}
          transition={{
            delay: 0.2,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="pointer-events-none absolute bottom-[10px] right-[38px] z-20"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 0.8, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative h-[390px] w-[250px]"
          >
            <Image
              src="/home/challenge-upcoming/character.png"
              alt="Designer ready for next challenge"
              fill
              sizes="250px"
              priority
              className="object-contain object-bottom"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function TimeItem({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.25,
      }}
      className="flex min-w-[62px] flex-col items-center text-center"
    >
      <p className="text-center text-[30px] font-medium leading-none text-white">
        {value}
      </p>

      <p className="mt-[10px] text-center text-[16px] font-normal text-white/85">
        {label}
      </p>
    </motion.div>
  );
}
