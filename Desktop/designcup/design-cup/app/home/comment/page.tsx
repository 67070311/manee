"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, MessageCircle } from "lucide-react";

const comments = [
  {
    name: "Jessica Lee",
    role: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    comment:
      "These challenges push me to think creatively and improve my skills every week. Amazing community!",
  },
  {
    name: "Noah Carter",
    role: "Product Designer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    comment:
      "I love how every challenge feels different. It keeps me inspired and gives me new ideas to explore.",
  },
  {
    name: "Maya Thompson",
    role: "Visual Designer",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    comment:
      "DesignCup helped me build confidence, discover other designers, and improve through real creative practice.",
  },
  {
    name: "Liam Wilson",
    role: "Brand Designer",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    comment:
      "The community is supportive and the weekly challenges are a great reason to keep creating consistently.",
  },
  {
    name: "Emma Davis",
    role: "Graphic Designer",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    comment:
      "Seeing how other designers approach the same brief has completely changed the way I think about design.",
  },
  {
    name: "Ethan Miller",
    role: "Web Designer",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    comment:
      "DesignCup gives me a reason to experiment, learn new techniques, and create something new every week.",
  },
  {
    name: "Sophia Brown",
    role: "Product Designer",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    comment:
      "The challenges are fun, practical, and genuinely useful for improving my portfolio and design process.",
  },
  {
    name: "Daniel Kim",
    role: "UI Designer",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    comment:
      "I joined for the challenges but stayed for the community. There is always something new to discover.",
  },
];

export default function CommentSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const updateProgress = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (maxScroll <= 0) {
      setProgress(0);
      return;
    }

    const current = (slider.scrollLeft / maxScroll) * 100;

    setProgress(current);
  };

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    updateProgress();

    slider.addEventListener("scroll", updateProgress, {
      passive: true,
    });

    window.addEventListener("resize", updateProgress);

    return () => {
      slider.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const slideLeft = () => {
    sliderRef.current?.scrollBy({
      left: -380,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current?.scrollBy({
      left: 380,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden bg-white py-[110px]">
      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="mx-auto text-center"
      >
        <div className="flex items-center justify-center gap-[14px]">
          {/* Header Comment Icon */}
          <motion.div
            initial={{
              scale: 0.85,
            }}
            whileInView={{
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.45,
              delay: 0.1,
            }}
            whileHover={{
              scale: 1.08,
              rotate: -5,
            }}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#EDF3FF]"
          >
            <MessageCircle
              size={21}
              strokeWidth={2.2}
              className="text-[#78AAFF]"
            />
          </motion.div>

          <h2 className="text-[38px] font-semibold tracking-[-1.2px] text-[#111111]">
            What Designers Say
          </h2>
        </div>

        <p className="mt-[16px] text-[17px] font-normal text-[#858585]">
          Hear from talented designers in our creative community
        </p>
      </motion.div>

      {/* Slider Area */}
      <div className="relative mx-auto mt-[64px] w-full max-w-[1450px] px-[78px]">
        {/* Left Arrow */}
        <motion.button
          type="button"
          onClick={slideLeft}
          whileHover={{
            scale: 1.08,
            x: -2,
          }}
          whileTap={{
            scale: 0.94,
          }}
          aria-label="Previous comments"
          className="absolute left-[28px] top-[165px] z-20 flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[#DEE3EB] bg-white text-[#222222] shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-colors duration-300 hover:border-[#287CFF] hover:text-[#287CFF]"
        >
          <ChevronLeft size={21} strokeWidth={1.8} />
        </motion.button>

        {/* Cards */}
        <div
          ref={sliderRef}
          className="
            flex
            snap-x
            snap-mandatory
            gap-[24px]
            overflow-x-auto
            px-[4px]
            py-[16px]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {comments.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{
                opacity: 0,
                y: 28,
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
                duration: 0.5,
                delay: Math.min(index * 0.06, 0.24),
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                y: -8,
                scale: 1.01,
                transition: {
                  duration: 0.25,
                },
              }}
              className="
                relative
                min-h-[330px]
                min-w-[320px]
                snap-start
                overflow-hidden
                rounded-[24px]
                border
                border-[#E5E9F0]
                bg-[#F8F9FC]
                p-[26px]
                transition-shadow
                duration-300
                hover:shadow-[0_18px_40px_rgba(0,0,0,0.07)]
                md:min-w-[340px]
                lg:min-w-[calc(25%-18px)]
              "
            >
              {/* Quote Box */}
              <motion.div
                whileHover={{
                  rotate: -5,
                  scale: 1.05,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="flex h-[48px] w-[48px] items-center justify-center rounded-[15px] bg-white"
              >
                <Quote
                  size={21}
                  strokeWidth={2.2}
                  fill="currentColor"
                  className="text-[#151515]"
                />
              </motion.div>

              {/* Comment */}
              <p className="mt-[28px] min-h-[116px] text-[16px] font-normal leading-[1.75] text-[#292929]">
                “{item.comment}”
              </p>

              {/* Divider */}
              <div className="my-[20px] h-px w-full bg-[#E1E5EB]" />

              {/* Profile */}
              <div className="flex items-center gap-[13px]">
                <motion.div
                  whileHover={{
                    scale: 1.06,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="relative shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[54px] w-[54px] rounded-full object-cover ring-[3px] ring-white"
                  />

                  <span className="absolute bottom-[1px] right-[1px] h-[11px] w-[11px] rounded-full border-[2px] border-white bg-[#3DD598]" />
                </motion.div>

                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-semibold text-[#171717]">
                    {item.name}
                  </h3>

                  <p className="mt-[3px] truncate text-[14px] font-normal text-[#858585]">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Right Arrow */}
        <motion.button
          type="button"
          onClick={slideRight}
          whileHover={{
            scale: 1.08,
            x: 2,
          }}
          whileTap={{
            scale: 0.94,
          }}
          aria-label="Next comments"
          className="absolute right-[28px] top-[165px] z-20 flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[#DEE3EB] bg-white text-[#222222] shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-colors duration-300 hover:border-[#287CFF] hover:text-[#287CFF]"
        >
          <ChevronRight size={21} strokeWidth={1.8} />
        </motion.button>

        {/* Scroll Progress */}
        <div className="mt-[36px] flex items-center justify-center gap-[14px]">
          <span className="text-[12px] font-medium text-[#A0A6B0]">01</span>

          <div className="relative h-[4px] w-[280px] overflow-hidden rounded-full bg-[#E4E7EC]">
            <motion.div
              animate={{
                width: `${20 + progress * 0.8}%`,
              }}
              transition={{
                duration: 0.12,
                ease: "easeOut",
              }}
              className="absolute left-0 top-0 h-full rounded-full bg-[#287CFF]"
            />
          </div>

          <span className="text-[12px] font-medium text-[#A0A6B0]">
            {String(comments.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
