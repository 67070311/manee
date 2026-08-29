import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Hero() {
  return (
    <section className="relative min-h-[700px] w-full overflow-hidden bg-[linear-gradient(180deg,#DDF3FF_0%,#86B7F6_55%,#D9F2FF_100%)]">
      {/* Character */}
      <Image
        src="/home/hero.png"
        alt="Designer illustration"
        width={1580}
        height={1527}
        priority
        className="absolute bottom-0 left-0 z-0 h-auto w-[290px] object-contain"
      />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[980px] flex-col items-center px-6 pt-[170px] text-center">
        {/* Badge */}
        <div className="flex h-[42px] w-[345px] items-center justify-center gap-[10px] rounded-full bg-white/35">
          <Icon
            icon="solar:star-ring-bold-duotone"
            width="22"
            height="22"
            className="text-[#287CFF]"
          />

          <span className="text-[16px] font-normal text-[#1D1D1D]">
            Weekly Design Challenges
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-[34px] text-[48px] font-medium leading-[1.1] tracking-[-1.5px] text-black">
          Compete Create Get Recognized
        </h1>

        {/* Description */}
        <p className="mt-[18px] max-w-[760px] text-[16px] font-normal leading-[1.65] text-white">
          Discover thousands of inspiring designs, compete in weekly creative
          challenges, and showcase your
          <br />
          work to designers around the world.
        </p>

        {/* Search */}
        <div className="mt-[24px] flex h-[66px] w-full max-w-[930px] items-center rounded-full bg-[#F8F8FF] p-[8px]">
          {/* Search Icon */}
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#287CFF]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />

              <path
                d="M16 16L20 20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Search assets"
            className="h-full flex-1 bg-transparent px-[18px] text-[16px] font-normal text-[#2C2C2C] outline-none placeholder:text-[#6C728A]"
          />

          {/* Most Recent */}
          <button
            type="button"
            className="flex h-[50px] min-w-[158px] items-center justify-center gap-[10px] rounded-full border border-[#C8CEDA] bg-white px-5 text-[16px] font-normal text-[#454B59]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
            </svg>
            Most Recent
          </button>
        </div>

        {/* Buttons */}
        <div className="mt-[54px] flex items-center gap-[24px]">
          <Link
            href="/challenges/active"
            className="flex h-[56px] w-[200px] items-center justify-center rounded-full bg-[#287CFF] text-[16px] font-normal text-white transition hover:bg-[#176DE8]"
          >
            Start Challenge
          </Link>

          <Link
            href="/explore/landing-page"
            className="flex h-[56px] w-[200px] items-center justify-center rounded-full bg-white text-[16px] font-normal text-[#287CFF] transition hover:bg-[#F5F8FF]"
          >
            Explore Design
          </Link>
        </div>
      </div>
    </section>
  );
}
