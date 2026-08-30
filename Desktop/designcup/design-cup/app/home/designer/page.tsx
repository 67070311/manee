"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";

type Designer = {
  id: number;
  name: string;
  avatar: string;
  wins: number;
  followers: number;
  specialty: string;
};

const designers: Designer[] = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    wins: 32,
    followers: 68.4,
    specialty: "UI/UX",
  },
  {
    id: 2,
    name: "Liam Carter",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    wins: 29,
    followers: 61.8,
    specialty: "Landing",
  },
  {
    id: 3,
    name: "Maya Thompson",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    wins: 27,
    followers: 58.2,
    specialty: "Branding",
  },
  {
    id: 4,
    name: "Noah Williams",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    wins: 24,
    followers: 52.7,
    specialty: "Mobile",
  },
  {
    id: 5,
    name: "Sophia Brown",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    wins: 21,
    followers: 48.9,
    specialty: "Visual",
  },
  {
    id: 6,
    name: "Ethan Walker",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    wins: 19,
    followers: 44.5,
    specialty: "E-commerce",
  },
  {
    id: 7,
    name: "Emma Davis",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    wins: 17,
    followers: 39.8,
    specialty: "Poster",
  },
  {
    id: 8,
    name: "Daniel Kim",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    wins: 15,
    followers: 35.2,
    specialty: "Product",
  },
  {
    id: 9,
    name: "Olivia Martin",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    wins: 13,
    followers: 31.6,
    specialty: "Branding",
  },
  {
    id: 10,
    name: "James Wilson",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    wins: 11,
    followers: 27.1,
    specialty: "UI Design",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 55,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function DesignerSection() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const sortedDesigners = useMemo(() => {
    return [...designers].sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      return b.followers - a.followers;
    });
  }, []);

  const slideLeft = () => {
    sliderRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-[92px]">
      {/* Decorative background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="pointer-events-none absolute left-[-100px] top-[80px] h-[240px] w-[240px] rounded-full bg-[#EAF2FF] blur-[70px]"
      />

      <motion.div
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[-80px] bottom-[20px] h-[220px] w-[220px] rounded-full bg-[#F0F5FF] blur-[70px]"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-[40px]">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-[18px]">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
                rotate: -10,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              animate={{
                y: [0, -3, 0],
              }}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#EAF2FF]"
            >
              <Icon
                icon="solar:fire-bold-duotone"
                width="24"
                height="24"
                className="text-[#287CFF]"
              />
            </motion.div>

            <div className="flex items-center gap-[18px]">
              <motion.h2
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-[36px] font-medium tracking-[-1px] text-[#287CFF]"
              >
                Top Designers
              </motion.h2>

              <motion.p
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.16,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-[16px] font-normal text-[#8A8A8A]"
              >
                Meet the most active and talented designers in our community
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              x: 18,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >
            <Link
              href="/designers"
              className="flex items-center gap-[7px] text-[16px] font-normal text-[#287CFF] transition-all duration-300 hover:gap-[10px]"
            >
              View All
              <Icon icon="solar:arrow-right-linear" width="18" height="18" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Slider */}
        <motion.div
          initial={{
            opacity: 0,
            y: 45,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.85,
            delay: 0.18,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mt-[58px]"
        >
          {/* Left */}
          <motion.button
            type="button"
            onClick={slideLeft}
            aria-label="Previous designers"
            whileHover={{
              scale: 1.08,
              x: -2,
            }}
            whileTap={{
              scale: 0.92,
            }}
            className="absolute left-[-22px] top-1/2 z-20 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-[#E1E7F0] bg-white text-[#171717] shadow-[0_4px_18px_rgba(0,0,0,0.07)]"
          >
            <Icon icon="solar:alt-arrow-left-linear" width="21" height="21" />
          </motion.button>

          {/* Cards */}
          <motion.div
            ref={sliderRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            className="
              flex
              snap-x
              snap-mandatory
              gap-[26px]
              overflow-x-auto
              scroll-smooth
              px-[4px]
              py-[14px]
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {sortedDesigners.map((designer) => (
              <motion.div
                key={designer.id}
                variants={cardVariants}
                className="shrink-0"
              >
                <Link
                  href={`/designers/${designer.id}`}
                  className="
                    group
                    relative
                    flex
                    w-[235px]
                    shrink-0
                    snap-start
                    flex-col
                    items-center
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-[#EEF2F8]
                    bg-white
                    px-[22px]
                    pb-[22px]
                    pt-[28px]
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.16,1,0.3,1)]
                    hover:-translate-y-[8px]
                    hover:border-[#D8E6FF]
                    hover:shadow-[0_18px_40px_rgba(40,124,255,0.10)]
                  "
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[105px] bg-[linear-gradient(180deg,#F3F7FF_0%,rgba(243,247,255,0)_100%)] opacity-70" />

                  {/* Avatar */}
                  <div className="relative z-10">
                    <div className="relative h-[112px] w-[112px] overflow-hidden rounded-full bg-[#F2F4F8] ring-[5px] ring-[#F6F9FF] transition-all duration-500 group-hover:ring-[#E5EFFF]">
                      <img
                        src={designer.avatar}
                        alt={designer.name}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      />
                    </div>

                    {/* Active dot */}
                    <div className="absolute bottom-[7px] right-[7px] h-[16px] w-[16px] rounded-full border-[3px] border-white bg-[#45D39B]" />
                  </div>

                  {/* Name */}
                  <h3 className="relative z-10 mt-[22px] text-[16px] font-medium text-[#171717]">
                    {designer.name}
                  </h3>

                  {/* Specialty */}
                  <div className="relative z-10 mt-[8px] rounded-full bg-[#F3F7FF] px-[12px] py-[5px] text-[13px] font-normal text-[#287CFF]">
                    {designer.specialty}
                  </div>

                  {/* Divider */}
                  <div className="relative z-10 my-[18px] h-px w-full bg-[#EEF1F5]" />

                  {/* Stats */}
                  <div className="relative z-10 flex w-full items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FFF7D8]">
                        <Icon
                          icon="solar:cup-star-bold-duotone"
                          width="18"
                          height="18"
                          className="text-[#F4B400]"
                        />
                      </div>

                      <div>
                        <p className="text-[16px] font-medium text-[#171717]">
                          {designer.wins}
                        </p>

                        <p className="text-[12px] text-[#8D8D8D]">Wins</p>
                      </div>
                    </div>

                    <div className="h-[34px] w-px bg-[#EDF0F4]" />

                    <div className="flex items-center gap-[8px]">
                      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#E8F1FF]">
                        <Icon
                          icon="solar:users-group-rounded-bold-duotone"
                          width="18"
                          height="18"
                          className="text-[#287CFF]"
                        />
                      </div>

                      <div>
                        <p className="text-[16px] font-medium text-[#171717]">
                          {designer.followers}k
                        </p>

                        <p className="text-[12px] text-[#8D8D8D]">Followers</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom hover */}
                  <div className="relative z-10 mt-[20px] flex h-[40px] w-full items-center justify-center gap-[8px] rounded-full bg-[#F7F9FC] text-[14px] text-[#666666] transition-all duration-300 group-hover:bg-[#287CFF] group-hover:text-white">
                    View Profile
                    <Icon
                      icon="solar:arrow-right-linear"
                      width="16"
                      height="16"
                      className="transition-transform duration-300 group-hover:translate-x-[3px]"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Right */}
          <motion.button
            type="button"
            onClick={slideRight}
            aria-label="Next designers"
            whileHover={{
              scale: 1.08,
              x: 2,
            }}
            whileTap={{
              scale: 0.92,
            }}
            className="absolute right-[-22px] top-1/2 z-20 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full border border-[#E1E7F0] bg-white text-[#171717] shadow-[0_4px_18px_rgba(0,0,0,0.07)]"
          >
            <Icon icon="solar:alt-arrow-right-linear" width="21" height="21" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
