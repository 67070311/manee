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
      <div className="flex items-center gap-[10px]">
        <div className="h-[20px] w-[20px] rounded-full bg-[#8DB7FF]" />

        <h2 className="text-[26px] font-medium text-[#287CFF]">
          Search Designs
        </h2>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mt-[18px] flex h-[62px] w-full items-center rounded-full bg-[#F5F7FF] p-[7px]"
      >
        <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#287CFF]">
          <Icon
            icon="solar:magnifer-linear"
            width="22"
            height="22"
            className="text-white"
          />
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search assets"
          className="h-full flex-1 bg-transparent px-[16px] text-[16px] outline-none placeholder:text-[#72798C]"
        />

        <button
          type="button"
          className="flex h-[46px] items-center gap-[8px] rounded-full border border-[#D4DAE8] bg-white px-[20px] text-[16px] text-[#454B59]"
        >
          <Icon
            icon="solar:sort-from-top-to-bottom-linear"
            width="18"
            height="18"
          />
          Most Recent
        </button>
      </form>
    </div>
  );
}
