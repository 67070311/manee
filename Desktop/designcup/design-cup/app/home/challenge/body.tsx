"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Body() {
  return (
    <div className="relative flex min-h-[360px] w-full flex-col items-center justify-center overflow-hidden">
      {/* =========================
          LEFT CONFETTI
      ========================== */}

      <div className="pointer-events-none absolute inset-y-0 left-0 w-[34%]">
        {/* Blue triangle */}
        <span
          className="confetti-float absolute left-[28%] top-[4%] block h-0 w-0 border-b-[10px] border-l-[7px] border-r-[7px] border-b-[#4C82F7] border-l-transparent border-r-transparent"
          style={{ animationDelay: "0s" }}
        />

        {/* Pink dot */}
        <span
          className="confetti-float-slow absolute left-[8%] top-[24%] h-[7px] w-[7px] rounded-full bg-[#F83F79]"
          style={{ animationDelay: "0.3s" }}
        />

        {/* Orange ring */}
        <span
          className="confetti-rotate absolute left-[38%] top-[26%] h-[18px] w-[18px] rounded-full border-[4px] border-[#FF7A3D]"
          style={{ animationDelay: "0.8s" }}
        />

        {/* Orange diamond */}
        <span
          className="confetti-float absolute left-[16%] top-[40%] h-[10px] w-[10px] rotate-45 bg-[#FF7E3E]"
          style={{ animationDelay: "1.1s" }}
        />

        {/* Pink circle */}
        <span
          className="confetti-float-slow absolute left-[35%] top-[45%] h-[14px] w-[14px] rounded-full bg-[#F63B70]"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Purple square */}
        <span
          className="confetti-rotate absolute left-[22%] top-[58%] h-[22px] w-[22px] rotate-12 bg-[#6C56EA]"
          style={{ animationDelay: "0.9s" }}
        />

        {/* Blue triangle */}
        <span
          className="confetti-float absolute left-[8%] top-[70%] block h-0 w-0 -rotate-12 border-b-[10px] border-l-[7px] border-r-[7px] border-b-[#487EF4] border-l-transparent border-r-transparent"
          style={{ animationDelay: "0.4s" }}
        />

        {/* Green triangle */}
        <span
          className="confetti-float-slow absolute left-[26%] bottom-[6%] block h-0 w-0 rotate-[75deg] border-b-[13px] border-l-[9px] border-r-[9px] border-b-[#42C99B] border-l-transparent border-r-transparent"
          style={{ animationDelay: "1.4s" }}
        />

        {/* Purple dot */}
        <span
          className="confetti-float absolute left-[44%] bottom-[10%] h-[10px] w-[10px] rounded-full bg-[#7259EE]"
          style={{ animationDelay: "0.2s" }}
        />

        {/* Squiggle */}
        <svg
          viewBox="0 0 50 20"
          className="confetti-wave absolute left-[13%] bottom-[20%] h-[20px] w-[48px]"
        >
          <path
            d="M2 12C7 2 12 18 17 8C22 -2 27 16 32 6C37 -4 42 14 48 4"
            fill="none"
            stroke="#F23C72"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        {/* Small squiggle */}
        <svg
          viewBox="0 0 50 20"
          className="confetti-wave-reverse absolute left-[36%] bottom-[30%] h-[18px] w-[42px]"
        >
          <path
            d="M2 12C7 2 12 18 17 8C22 -2 27 16 32 6C37 -4 42 14 48 4"
            fill="none"
            stroke="#F23C72"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* =========================
          RIGHT CONFETTI
      ========================== */}

      <div className="pointer-events-none absolute inset-y-0 right-0 w-[34%]">
        {/* Orange dot */}
        <span
          className="confetti-float absolute right-[32%] top-[10%] h-[9px] w-[9px] rounded-full bg-[#FF7C3A]"
          style={{ animationDelay: "0.6s" }}
        />

        {/* Green dot */}
        <span
          className="confetti-float-slow absolute right-[8%] top-[20%] h-[6px] w-[6px] rounded-full bg-[#42C99B]"
          style={{ animationDelay: "0.1s" }}
        />

        {/* Pink wave */}
        <svg
          viewBox="0 0 50 20"
          className="confetti-wave-reverse absolute right-[40%] top-[25%] h-[21px] w-[52px]"
        >
          <path
            d="M2 12C7 2 12 18 17 8C22 -2 27 16 32 6C37 -4 42 14 48 4"
            fill="none"
            stroke="#F23C72"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        {/* Blue triangle */}
        <span
          className="confetti-float absolute right-[20%] top-[32%] block h-0 w-0 rotate-[15deg] border-b-[12px] border-l-[8px] border-r-[8px] border-b-[#4C82F7] border-l-transparent border-r-transparent"
          style={{ animationDelay: "1.2s" }}
        />

        {/* Blue circle */}
        <span
          className="confetti-float-slow absolute right-[31%] top-[47%] h-[12px] w-[12px] rounded-full bg-[#4B7CF3]"
          style={{ animationDelay: "0.7s" }}
        />

        {/* Orange diamond */}
        <span
          className="confetti-rotate absolute right-[3%] top-[53%] h-[11px] w-[11px] rotate-45 bg-[#FF7C3A]"
          style={{ animationDelay: "0.9s" }}
        />

        {/* Green ring */}
        <span
          className="confetti-float absolute right-[12%] top-[62%] h-[19px] w-[19px] rounded-full border-[4px] border-[#3FC698]"
          style={{ animationDelay: "0.2s" }}
        />

        {/* Green triangle */}
        <span
          className="confetti-float-slow absolute right-[22%] bottom-[12%] block h-0 w-0 rotate-[72deg] border-b-[13px] border-l-[9px] border-r-[9px] border-b-[#42C99B] border-l-transparent border-r-transparent"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Pink square */}
        <span
          className="confetti-rotate absolute right-[7%] bottom-[22%] h-[14px] w-[14px] rotate-12 bg-[#F23C72]"
          style={{ animationDelay: "1s" }}
        />

        {/* Purple wave */}
        <svg
          viewBox="0 0 50 20"
          className="confetti-wave absolute right-[32%] bottom-[4%] h-[20px] w-[50px]"
        >
          <path
            d="M2 12C7 2 12 18 17 8C22 -2 27 16 32 6C37 -4 42 14 48 4"
            fill="none"
            stroke="#6657E8"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* =========================
          COUNTDOWN
      ========================== */}

      <div className="relative z-10 flex min-w-[360px] flex-col items-center rounded-[22px] bg-white px-[40px] py-[24px] shadow-[0_8px_28px_rgba(40,124,255,0.10)]">
        <p className="text-[16px] font-medium text-[#1D1D1D]">Start in!</p>

        <div className="mt-[14px] flex items-start gap-[42px]">
          <div className="text-center">
            <p className="text-[36px] font-medium leading-none text-[#287CFF]">
              14
            </p>
            <p className="mt-[10px] text-[16px] font-normal text-[#333333]">
              Days
            </p>
          </div>

          <div className="text-center">
            <p className="text-[36px] font-medium leading-none text-[#287CFF]">
              28
            </p>
            <p className="mt-[10px] text-[16px] font-normal text-[#333333]">
              Hours
            </p>
          </div>

          <div className="text-center">
            <p className="text-[36px] font-medium leading-none text-[#287CFF]">
              45
            </p>
            <p className="mt-[10px] text-[16px] font-normal text-[#333333]">
              Minutes
            </p>
          </div>
        </div>
      </div>

      {/* =========================
          UPLOAD
      ========================== */}

      <Link
        href="/challenge/upload"
        className="relative z-10 mt-[44px] flex h-[64px] items-center rounded-full border-[2px] border-[#287CFF] bg-white p-[6px] transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex h-[48px] items-center gap-[12px] rounded-full bg-[#287CFF] px-[26px] text-white">
          <Icon
            icon="solar:upload-minimalistic-bold-duotone"
            width="24"
            height="24"
          />

          <span className="text-[16px] font-normal">Upload your design!</span>
        </div>
      </Link>

      {/* Read Brief */}
      <Link
        href="/challenge/brief"
        className="relative z-10 mt-[14px] text-[16px] font-normal text-[#287CFF] underline underline-offset-4"
      >
        Read Brief
      </Link>

      {/* =========================
          ANIMATION
      ========================== */}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }

          50% {
            transform: translate3d(8px, -12px, 0) rotate(7deg);
          }

          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
        }

        @keyframes floatSlow {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }

          33% {
            transform: translate3d(-7px, -9px, 0) rotate(-5deg);
          }

          66% {
            transform: translate3d(5px, 5px, 0) rotate(4deg);
          }

          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
        }

        @keyframes rotateSoft {
          0% {
            transform: rotate(0deg) translateY(0);
          }

          50% {
            transform: rotate(18deg) translateY(-8px);
          }

          100% {
            transform: rotate(0deg) translateY(0);
          }
        }

        @keyframes waveMove {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }

          50% {
            transform: translate3d(9px, -9px, 0) rotate(6deg);
          }

          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
        }

        @keyframes waveReverse {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }

          50% {
            transform: translate3d(-9px, 8px, 0) rotate(-7deg);
          }

          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
        }

        .confetti-float {
          animation: float 4.2s ease-in-out infinite;
          will-change: transform;
        }

        .confetti-float-slow {
          animation: floatSlow 5.8s ease-in-out infinite;
          will-change: transform;
        }

        .confetti-rotate {
          animation: rotateSoft 5s ease-in-out infinite;
          will-change: transform;
        }

        .confetti-wave {
          animation: waveMove 4.8s ease-in-out infinite;
          will-change: transform;
        }

        .confetti-wave-reverse {
          animation: waveReverse 5.4s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
