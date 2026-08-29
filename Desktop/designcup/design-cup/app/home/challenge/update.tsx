import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Update() {
  return (
    <div className="relative mt-[48px] h-[360px] w-full overflow-hidden rounded-[16px] bg-[#C66E1E]">
      {/* Image */}
      <img
        src="/home/challenge/bg.png"
        alt="Food delivery app challenge"
        className="absolute inset-y-0 right-0 h-full w-[65%] object-cover object-center"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#B86217_0%,#C76D1C_37%,rgba(211,111,22,0.88)_50%,rgba(237,125,22,0.38)_67%,rgba(255,140,25,0.02)_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex h-full w-[50%] flex-col justify-center px-[36px] text-white">
        <h3 className="text-[22px] font-medium">Design a Food Delivery App</h3>

        {/* Brief */}
        <div className="mt-[24px]">
          <div className="inline-flex h-[42px] items-center gap-[10px] rounded-full bg-white px-[18px]">
            <span className="text-[18px]">🎨</span>

            <span className="text-[16px] font-medium text-[#287CFF]">
              Challenge Brief
            </span>
          </div>
        </div>

        <p className="mt-[18px] text-[16px] font-normal leading-[1.6]">
          Design a modern food delivery mobile app that helps users discover
          restaurants, browse menus, and place orders quickly with a smooth and
          intuitive experience.
        </p>

        <p className="mt-[14px] text-[16px] font-normal leading-[1.6]">
          Your design should focus on simplicity, usability, and an enjoyable
          ordering journey.
        </p>

        <Link
          href="/challenge/brief"
          className="mt-[24px] inline-flex w-fit items-center gap-[6px] text-[16px] font-normal underline underline-offset-4"
        >
          Read more
          <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
        </Link>
      </div>
    </div>
  );
}
