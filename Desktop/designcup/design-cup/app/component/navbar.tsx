"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type MenuItem = {
  label: string;
  href: string;
};

type Menu = {
  label: string;
  href?: string;
  items?: MenuItem[];
};

const menus: Menu[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Challenges",
    items: [
      {
        label: "Active",
        href: "/challenge/active",
      },
      {
        label: "Upload design",
        href: "/challenge/upload-design",
      },
      {
        label: "Voting",
        href: "/challenge/voting-design",
      },
      {
        label: "Upcoming",
        href: "/challenge/upcoming-design",
      },
      {
        label: "Completed",
        href: "/challenge/complete-design",
      },
    ],
  },
  {
    label: "Explore",
    items: [
      {
        label: "Landing Page",
        href: "/explore/landing-page",
      },
      {
        label: "Mobile App",
        href: "/explore/mobile-app",
      },
      {
        label: "E-commerce",
        href: "/explore/ecommerce",
      },
      {
        label: "Poster",
        href: "/explore/poster",
      },
      {
        label: "Branding",
        href: "/explore/branding",
      },
    ],
  },
  {
    label: "Winners",
    items: [
      {
        label: "Latest Winners",
        href: "/winners/latest",
      },
      {
        label: "Top 5",
        href: "/winners/top-5",
      },
      {
        label: "Hall of Fame",
        href: "/winners/hall-of-fame",
      },
      {
        label: "Editor's Picks",
        href: "/winners/editors-picks",
      },
    ],
  },
  {
    label: "Designers",
    href: "/designers",
  },
];

export default function Navbar() {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    router.push(`/explore?q=${encodeURIComponent(value)}`);
    setOpenMenu(null);
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu((current) => (current === menuName ? null : menuName));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8F2FF] bg-white">
      <nav className="mx-auto flex h-[104px] w-full max-w-[1600px] items-center px-[40px]">
        {/* LOGO */}
        <Link
          href="/"
          onClick={() => setOpenMenu(null)}
          className="mr-[38px] flex h-[104px] w-[130px] shrink-0 items-center justify-start overflow-visible"
          aria-label="DesignCup Home"
        >
          <Image
            src="/logo/logo.png"
            alt="DesignCup"
            width={130}
            height={130}
            priority
            className="h-[130px] w-[130px] max-w-none object-contain"
          />
        </Link>

        {/* NAVIGATION */}
        <div className="flex min-w-0 flex-1 items-center justify-between">
          {/* MENU */}
          <div className="flex shrink-0 items-center gap-[48px]">
            {menus.map((menu) => {
              const hasDropdown = !!menu.items;

              if (!hasDropdown && menu.href) {
                return (
                  <Link
                    key={menu.label}
                    href={menu.href}
                    onClick={() => setOpenMenu(null)}
                    className="whitespace-nowrap text-[16px] font-normal text-[#171717] transition-colors hover:text-[#287CFF]"
                  >
                    {menu.label}
                  </Link>
                );
              }

              return (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(menu.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    onClick={() => toggleMenu(menu.label)}
                    className="flex items-center gap-[7px] whitespace-nowrap text-[16px] font-normal text-[#171717] transition-colors hover:text-[#287CFF]"
                  >
                    {menu.label}

                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`transition-transform duration-200 ${
                        openMenu === menu.label ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {openMenu === menu.label && (
                    <div className="absolute left-1/2 top-full z-[100] -translate-x-1/2 pt-[18px]">
                      <div className="w-[200px] rounded-[12px] border border-[#ECECEC] bg-white p-[8px] shadow-[0_12px_35px_rgba(0,0,0,0.10)]">
                        {menu.items?.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenMenu(null)}
                            className="block rounded-[8px] px-[14px] py-[11px] text-[16px] font-normal text-[#222222] transition-colors hover:bg-[#F5F8FF] hover:text-[#287CFF]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="ml-[30px] flex min-w-0 shrink-0 items-center gap-[14px]">
            <form
              onSubmit={handleSearch}
              className="flex h-[44px] w-[210px] items-center rounded-[10px] border border-[#DFE4EE] bg-white px-[14px]"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                className="mr-[10px] shrink-0 text-[#56627E]"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M16.5 16.5L20 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets"
                className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-[#202020] outline-none placeholder:text-[#68718B]"
              />
            </form>

            <Link
              href="/login"
              onClick={() => setOpenMenu(null)}
              className="flex h-[44px] w-[175px] shrink-0 items-center justify-center whitespace-nowrap rounded-[4px] bg-[#287CFF] px-[16px] text-[14px] font-normal text-white transition-colors hover:bg-[#1769E8]"
            >
              Login to your Account
            </Link>

            <Link
              href="/profile"
              onClick={() => setOpenMenu(null)}
              aria-label="Profile"
              className="h-[44px] w-[44px] shrink-0 rounded-full bg-[#F0F2F9] transition hover:ring-2 hover:ring-[#287CFF]/20"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
