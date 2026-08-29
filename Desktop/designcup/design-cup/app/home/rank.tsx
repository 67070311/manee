"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRef, useState, type TransitionEvent } from "react";

type Winner = {
  rank: number;
  image: string;
  avatar: string;
  name: string;
  username: string;
};

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
    rank: 3,
    image: "/home/rank/3.png",
    avatar: "https://i.pravatar.cc/120?img=15",
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

/*
  ทำไว้ 9 ชุด
  เพื่อไม่ต้อง reset clone บ่อย ๆ
*/
const carouselItems = Array.from({ length: 9 }, () => winners).flat();

const ITEM_WIDTH = 280;

/*
  index 20 = Rank 1
  และอยู่เกือบกึ่งกลางของ clone ทั้งหมด
*/
const CENTER_START_INDEX = 20;

export default function Rank() {
  const [activeIndex, setActiveIndex] = useState(CENTER_START_INDEX);

  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);

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

    /*
      ส่งกลับไปยังชุดกลาง
      20 - 24
    */
    return CENTER_START_INDEX + modulo;
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.currentTarget !== trackRef.current) {
      return;
    }

    if (event.propertyName !== "transform") {
      return;
    }

    /*
      ยังอยู่โซนกลาง ไม่ต้องทำอะไร
    */
    if (activeIndex > 9 && activeIndex < 35) {
      return;
    }

    const newIndex = normalizeIndex(activeIndex);

    /*
      สำคัญ:
      ปิด transition ทั้ง track และ card
      ก่อนเปลี่ยน clone
    */
    setTransitionEnabled(false);
    setActiveIndex(newIndex);

    /*
      รอ browser วาดตำแหน่งใหม่แบบไม่มี animation ก่อน
      แล้วค่อยเปิด transition กลับ
    */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    });
  };

  return (
    <section className="w-full overflow-x-hidden bg-white px-6 py-[80px]">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Weekly Badge */}
        <div className="flex w-full justify-center">
          <div className="flex h-[46px] items-center rounded-full bg-white px-[18px]">
            <Icon
              icon="solar:star-ring-bold-duotone"
              width="20"
              height="20"
              className="mr-[10px] text-[#171717]"
            />

            <span className="whitespace-nowrap text-[16px] font-normal text-[#171717]">
              Weekly Design Challenges
            </span>

            <div className="ml-[14px] flex items-center">
              {weeklyAvatars.map((avatar, index) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt=""
                  className={`h-[28px] w-[28px] rounded-full border-2 border-white object-cover ${
                    index === 0 ? "" : "-ml-[7px]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto mt-[42px] flex w-full flex-col items-center text-center">
          <h2 className="w-full text-center text-[36px] font-medium leading-[1.25] tracking-[-1px] text-[#111111]">
            Top 5 Winner In{" "}
            <span className="text-[#287CFF]">“Car Landing Page”</span>
          </h2>

          <p className="mt-[14px] w-full text-center text-[16px] font-normal leading-[1.6] text-[#666666]">
            Outstanding designs from Challenge Car Landing Page. Congratulation
            to all winners!
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mt-[72px] h-[690px] w-full overflow-x-clip">
          {/* Track */}
          <div
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            className="absolute bottom-0 left-1/2 flex w-max items-end will-change-transform"
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

              const scale = isCenter ? 1 : isNear ? 0.8 : isOuter ? 0.69 : 0.62;

              const opacity = distance <= 2 ? 1 : 0;

              const zIndex = isCenter ? 30 : isNear ? 20 : isOuter ? 10 : 0;

              return (
                <div
                  key={`${winner.rank}-${index}`}
                  className="relative flex h-[660px] w-[280px] shrink-0 items-end justify-center"
                  style={{
                    zIndex,
                  }}
                >
                  {/* Complete Card */}
                  <div
                    className="flex w-[270px] origin-bottom flex-col items-center will-change-transform"
                    style={{
                      transform: `translate3d(0, 0, 0) scale(${scale})`,
                      opacity,

                      transition: transitionEnabled
                        ? `
                          transform 950ms cubic-bezier(0.16, 1, 0.3, 1),
                          opacity 550ms cubic-bezier(0.16, 1, 0.3, 1)
                        `
                        : "none",
                    }}
                  >
                    {/* Design Area */}
                    <div className="relative w-[270px] pt-[55px]">
                      {/* Rank */}
                      <div
                        style={{
                          backgroundColor: rankColors[winner.rank],
                        }}
                        className="absolute left-1/2 top-[55px] z-30 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white text-[16px] font-normal text-white"
                      >
                        {winner.rank}
                      </div>

                      {/* Design Image */}
                      <Image
                        src={winner.image}
                        alt={`Rank ${winner.rank} design`}
                        width={1435}
                        height={2424}
                        priority={winner.rank === 1}
                        className="h-[470px] w-full rounded-[12px] object-cover object-top"
                      />
                    </div>

                    {/* Profile */}
                    <div className="relative z-10 -mt-[42px] flex w-[200px] flex-col items-center rounded-[8px] bg-white px-[18px] pb-[18px] pt-[48px]">
                      <img
                        src={winner.avatar}
                        alt={winner.name}
                        className="absolute left-1/2 top-0 h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white object-cover"
                      />

                      <p className="whitespace-nowrap text-[16px] font-medium text-[#171717]">
                        {winner.name}
                      </p>

                      <p className="mt-[5px] whitespace-nowrap text-[16px] font-normal text-[#666666]">
                        {winner.username}
                      </p>

                      <Link
                        href={`/winners/${winner.rank}`}
                        className="mt-[16px] flex h-[42px] items-center justify-center rounded-[4px] bg-[#287CFF] px-[20px] text-[16px] font-normal text-white transition-colors duration-200 hover:bg-[#176DE8]"
                      >
                        See More
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrows */}
        <div className="mt-[30px] flex items-center justify-center gap-[60px]">
          <button
            type="button"
            onClick={previousWinner}
            aria-label="Previous winner"
            className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full border border-[#D8E0EB] bg-white text-[#171717] transition-all duration-300 hover:-translate-y-[2px] hover:border-[#BFCBE0] hover:bg-[#F5F8FF] active:scale-95"
          >
            <Icon icon="solar:alt-arrow-left-linear" width="22" height="22" />
          </button>

          <button
            type="button"
            onClick={nextWinner}
            aria-label="Next winner"
            className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full border border-[#D8E0EB] bg-white text-[#171717] transition-all duration-300 hover:-translate-y-[2px] hover:border-[#BFCBE0] hover:bg-[#F5F8FF] active:scale-95"
          >
            <Icon icon="solar:alt-arrow-right-linear" width="22" height="22" />
          </button>
        </div>

        {/* Bottom Buttons */}
        <div className="mt-[40px] flex items-center justify-center gap-[24px]">
          <Link
            href="/challenges/active"
            className="flex h-[56px] w-[200px] items-center justify-center rounded-full bg-[#287CFF] text-[16px] font-normal text-white transition-colors duration-200 hover:bg-[#176DE8]"
          >
            View Challenge
          </Link>

          <Link
            href="/winners"
            className="flex h-[56px] w-[200px] items-center justify-center rounded-full border border-[#E6EDF8] bg-white text-[16px] font-normal text-[#287CFF] transition-colors duration-200 hover:bg-[#F5F8FF]"
          >
            See All Winners
          </Link>
        </div>
      </div>
    </section>
  );
}
