"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function SearchHero() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    router.push(`/explore?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <div className="flex items-center gap-[12px]">
        {/* Search Icon */}
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[#EAF2FF]">
          <Icon
            icon="solar:magnifer-linear"
            width="21"
            height="21"
            className="text-[#287CFF]"
          />
        </div>

        <h2 className="text-[26px] font-medium tracking-[-0.5px] text-[#287CFF]">
          Search Designs
        </h2>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mt-[18px] flex h-[62px] w-full items-center rounded-full bg-[#F5F7FF] p-[7px]"
      >
        {/* Search Button */}
        <button
          type="submit"
          aria-label="Search"
          className="
            group
            flex
            h-[48px]
            w-[48px]
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#287CFF]
            text-white
            transition-all
            duration-300
            hover:scale-[1.06]
            hover:bg-[#1769E8]
            active:scale-[0.96]
          "
        >
          <Icon
            icon="solar:magnifer-linear"
            width="23"
            height="23"
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </button>

        {/* Input */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets"
          className="
            h-full
            min-w-0
            flex-1
            bg-transparent
            px-[16px]
            text-[16px]
            text-[#242936]
            outline-none
            placeholder:text-[#72798C]
          "
        />

        {/* Sort */}
        <button
          type="button"
          className="
            group
            flex
            h-[46px]
            shrink-0
            items-center
            gap-[8px]
            rounded-full
            border
            border-[#D4DAE8]
            bg-white
            px-[20px]
            text-[16px]
            text-[#454B59]
            transition-all
            duration-300
            hover:border-[#287CFF]
            hover:text-[#287CFF]
          "
        >
          <Icon
            icon="solar:sort-from-top-to-bottom-linear"
            width="18"
            height="18"
            className="transition-transform duration-300 group-hover:translate-y-[1px]"
          />

          <span>Most Recent</span>
        </button>
      </form>
    </div>
  );
}
