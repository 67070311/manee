"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Shapes } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Landing Pages",
    description:
      "Design modern, high-converting landing pages for brands, products, and startups",
    image: "/home/challenge-categories/landing-page.png",
    href: "/explore?category=landing-page",
    label: "Web Design",
  },
  {
    title: "Mobile Apps",
    description:
      "Create intuitive mobile experiences with beautiful UI and smooth user flows",
    image: "/home/challenge-categories/mobile-app.png",
    href: "/explore?category=mobile-app",
    label: "Product Design",
  },
  {
    title: "E-commerce",
    description:
      "Design online shopping experiences, product pages, and checkout journeys",
    image: "/home/challenge-categories/e-commerce.png",
    href: "/explore?category=e-commerce",
    label: "Commerce",
  },
  {
    title: "Poster",
    description:
      "Create eye-catching posters for events, products, campaigns, and promotions",
    image: "/home/challenge-categories/poster.png",
    href: "/explore?category=poster",
    label: "Graphic Design",
  },
  {
    title: "Branding",
    description:
      "Craft visual identities including logos, colors, typography, and brand systems",
    image: "/home/challenge-categories/branding.png",
    href: "/explore?category=branding",
    label: "Brand Identity",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.97,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function ChallengeCategories() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F5F7FF] py-[86px]">
      {/* Background Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="pointer-events-none absolute left-1/2 top-[120px] h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[#DCE8FF]/55 blur-[120px]"
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
        className="pointer-events-none absolute left-[8%] top-[30%] h-[180px] w-[180px] rounded-full bg-white/70 blur-[60px]"
      />

      <motion.div
        animate={{
          y: [0, 10, 0],
          x: [0, -8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute bottom-[10%] right-[8%] h-[180px] w-[180px] rounded-full bg-[#E9EFFF]/70 blur-[70px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1220px] px-[32px]">
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
          className="mx-auto max-w-[760px] text-center"
        >
          {/* Category Badge */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: -10,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            className="mb-[12px] inline-flex items-center gap-[8px] rounded-full border border-[#D7E3F8] bg-white/90 px-[14px] py-[7px] shadow-[0_6px_20px_rgba(40,124,255,0.07)] backdrop-blur"
          >
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Shapes size={15} strokeWidth={2} className="text-[#287CFF]" />
            </motion.div>

            <span className="text-[11px] font-medium uppercase tracking-[1.2px] text-[#6C7482]">
              Explore by category
            </span>
          </motion.div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.75,
              delay: 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-[38px] font-medium tracking-[-1px] text-[#111111]"
          >
            Popular Challenge Categories
          </motion.h2>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
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
            className="mt-[14px] text-[15px] leading-[1.65] text-[#7D8490]"
          >
            Explore weekly creative challenges across popular design disciplines
            and showcase your best work.
          </motion.p>
        </motion.div>

        {/* Top Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-[54px] grid grid-cols-1 gap-[24px] md:grid-cols-3"
        >
          {categories.slice(0, 3).map((category) => (
            <motion.div key={category.title} variants={cardVariants}>
              <CategoryCard {...category} variant="default" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-[24px] grid grid-cols-1 gap-[24px] md:grid-cols-2"
        >
          {categories.slice(3).map((category) => (
            <motion.div key={category.title} variants={cardVariants}>
              <CategoryCard {...category} variant="wide" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategoryCard({
  title,
  description,
  image,
  href,
  label,
  variant,
}: {
  title: string;
  description: string;
  image: string;
  href: string;
  label: string;
  variant: "default" | "wide";
}) {
  const isWide = variant === "wide";

  return (
    <Link
      href={href}
      className="
        group
        relative
        block
        overflow-hidden
        rounded-[22px]
        border
        border-white/80
        bg-white
        shadow-[0_10px_28px_rgba(44,71,120,0.05)]
        transition-all
        duration-500
        ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:-translate-y-[7px]
        hover:shadow-[0_24px_55px_rgba(40,73,130,0.13)]
      "
    >
      {/* Image */}
      <div
        className={`relative w-full overflow-hidden ${
          isWide ? "h-[235px]" : "h-[210px]"
        }`}
      >
        <Image
          src={image}
          alt={`${title} design challenge`}
          fill
          sizes={
            isWide
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="
            object-cover
            transition-transform
            duration-700
            ease-[cubic-bezier(0.16,1,0.3,1)]
            group-hover:scale-[1.055]
          "
        />

        {/* Image Gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_48%,rgba(7,16,34,0.34)_100%)]" />

        {/* Category Label */}
        <div className="absolute left-[16px] top-[16px] rounded-full border border-white/40 bg-white/90 px-[12px] py-[6px] shadow-[0_4px_14px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <span className="text-[10px] font-medium text-[#565E6B]">
            {label}
          </span>
        </div>

        {/* Arrow */}
        <div
          className="
            absolute
            right-[16px]
            top-[16px]
            flex
            h-[38px]
            w-[38px]
            items-center
            justify-center
            rounded-full
            bg-white/90
            text-[#171717]
            shadow-[0_6px_18px_rgba(0,0,0,0.08)]
            backdrop-blur-md
            transition-all
            duration-300
            group-hover:rotate-[8deg]
            group-hover:bg-[#287CFF]
            group-hover:text-white
          "
        >
          <ArrowUpRight size={18} strokeWidth={1.8} />
        </div>

        {/* Image Bottom Label */}
        <div className="absolute bottom-[14px] left-[16px]">
          <span className="text-[11px] font-medium uppercase tracking-[1px] text-white/80">
            Weekly Creative Challenge
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className={`relative flex flex-col ${
          isWide
            ? "min-h-[145px] px-[24px] py-[22px]"
            : "min-h-[150px] px-[22px] py-[20px]"
        }`}
      >
        <div className="flex items-start justify-between gap-[14px]">
          <div>
            <h3
              className={`font-semibold tracking-[-0.3px] text-[#151515] ${
                isWide ? "text-[20px]" : "text-[18px]"
              }`}
            >
              {title}
            </h3>

            <p
              className={`mt-[8px] leading-[1.6] text-[#818995] ${
                isWide
                  ? "max-w-[470px] text-[14px]"
                  : "max-w-[300px] text-[14px]"
              }`}
            >
              {description}
            </p>
          </div>

          <span className="mt-[2px] shrink-0 text-[11px] font-medium text-[#A3AAB5] transition-colors duration-300 group-hover:text-[#287CFF]">
            Explore
          </span>
        </div>

        {/* Bottom Hover Line */}
        <div className="absolute bottom-0 left-[22px] right-[22px] h-px overflow-hidden bg-[#EDF1F7]">
          <div
            className="
              h-full
              w-0
              bg-[#287CFF]
              transition-all
              duration-500
              ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover:w-full
            "
          />
        </div>
      </div>
    </Link>
  );
}
