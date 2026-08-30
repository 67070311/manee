import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-[70px] pb-[50px] pt-[60px]">
        {/* TOP */}
        <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr_0.8fr_1.7fr] gap-[45px]">
          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="DesignCup Home"
            >
              <Image
                src="/logo/logo.png"
                alt="DesignCup"
                width={170}
                height={80}
                className="h-auto w-[170px] object-contain"
              />
            </Link>

            <p className="mt-[25px] max-w-[230px] text-[14px] leading-[1.8] text-[#7B7B7B]">
              The ultimate platform for
              <br />
              design challenges and creative
              <br />
              competitions.
            </p>

            {/* SOCIAL */}
            <div className="mt-[25px] flex items-center gap-[16px]">
              <Link
                href="#"
                aria-label="Instagram"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#287CFF] text-white transition hover:scale-105"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              </Link>

              <Link
                href="#"
                aria-label="Facebook"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#287CFF] text-white transition hover:scale-105"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.5 8H17V4.3C16.6 4.2 15.2 4 13.6 4C10.4 4 8.2 5.9 8.2 9.5V12H5V16H8.2V24H12.2V16H15.5L16 12H12.2V9.9C12.2 8.7 12.6 8 14.5 8Z" />
                </svg>
              </Link>

              <Link
                href="#"
                aria-label="TikTok"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#287CFF] text-white transition hover:scale-105"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M15.5 3C16.1 5.4 17.5 6.8 20 7V10.6C18.3 10.6 16.8 10.1 15.5 9.2V15.8C15.5 19.4 12.7 22 9.2 22C5.8 22 3 19.3 3 15.9C3 12.3 6 9.5 9.7 9.8V13.4C8 13.2 6.6 14.3 6.6 15.9C6.6 17.3 7.7 18.4 9.2 18.4C10.8 18.4 11.9 17.3 11.9 15.5V3H15.5Z" />
                </svg>
              </Link>

              <Link
                href="mailto:hello@designcup.com"
                aria-label="Email"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#287CFF] text-white transition hover:scale-105"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M4 7L12 13L20 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* CHALLENGES */}
          <div>
            <h3 className="mb-[30px] text-[16px] font-semibold text-[#111111]">
              Challenges
            </h3>

            <div className="flex flex-col gap-[12px] text-[14px] text-[#222222]">
              <Link
                href="/challenge/active"
                className="transition hover:text-[#287CFF]"
              >
                Active
              </Link>

              <Link
                href="/challenge/voting-design"
                className="transition hover:text-[#287CFF]"
              >
                Voting
              </Link>

              <Link
                href="/challenge/upcoming-design"
                className="transition hover:text-[#287CFF]"
              >
                Upcoming
              </Link>

              <Link
                href="/challenge/complete-design"
                className="transition hover:text-[#287CFF]"
              >
                Completed
              </Link>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="mb-[30px] text-[16px] font-semibold text-[#111111]">
              Explore
            </h3>

            <div className="flex flex-col gap-[12px] text-[14px] text-[#222222]">
              <Link
                href="/explore/landing-page"
                className="transition hover:text-[#287CFF]"
              >
                Landing Page
              </Link>

              <Link
                href="/explore/mobile-app"
                className="transition hover:text-[#287CFF]"
              >
                Mobile App
              </Link>

              <Link
                href="/explore/ecommerce"
                className="transition hover:text-[#287CFF]"
              >
                E-commerce
              </Link>

              <Link
                href="/explore/poster"
                className="transition hover:text-[#287CFF]"
              >
                Poster
              </Link>

              <Link
                href="/explore/branding"
                className="transition hover:text-[#287CFF]"
              >
                Branding
              </Link>

              <Link
                href="/designers"
                className="transition hover:text-[#287CFF]"
              >
                Top Designers
              </Link>
            </div>
          </div>

          {/* WINNERS */}
          <div>
            <h3 className="mb-[30px] text-[16px] font-semibold text-[#111111]">
              Winners
            </h3>

            <div className="flex flex-col gap-[12px] text-[14px] text-[#222222]">
              <Link
                href="/winners/latest"
                className="transition hover:text-[#287CFF]"
              >
                Latest Winners
              </Link>

              <Link
                href="/winners/top-5"
                className="transition hover:text-[#287CFF]"
              >
                Top 5
              </Link>

              <Link
                href="/winners/hall-of-fame"
                className="transition hover:text-[#287CFF]"
              >
                Hall of Fame
              </Link>
            </div>
          </div>

          {/* COMMUNITY */}
          <div>
            <h3 className="mb-[30px] text-[16px] font-semibold text-[#111111]">
              Community
            </h3>

            <div className="flex flex-col gap-[12px] text-[14px] text-[#222222]">
              <Link href="/blog" className="transition hover:text-[#287CFF]">
                Blog
              </Link>

              <Link
                href="/help-center"
                className="transition hover:text-[#287CFF]"
              >
                Help Center
              </Link>

              <Link href="/about" className="transition hover:text-[#287CFF]">
                About Us
              </Link>

              <Link href="/terms" className="transition hover:text-[#287CFF]">
                Term of Service
              </Link>

              <Link href="/privacy" className="transition hover:text-[#287CFF]">
                Privacy Policy
              </Link>

              <Link href="/contact" className="transition hover:text-[#287CFF]">
                Contact Us
              </Link>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="mb-[30px] text-[16px] font-semibold text-[#111111]">
              Newsletter
            </h3>

            <p className="max-w-[260px] text-[14px] leading-[1.7] text-[#222222]">
              Stay updated with our latest
              <br />
              challenges and winners.
            </p>

            <form className="mt-[24px] flex items-center gap-[16px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-[44px] w-[220px] rounded-[8px] border border-[#DFE4EE] bg-white px-[14px] text-[14px] text-[#222222] outline-none transition placeholder:text-[#68718B] focus:border-[#287CFF]"
              />

              <button
                type="submit"
                className="flex h-[44px] w-[125px] shrink-0 items-center justify-center rounded-[4px] bg-[#287CFF] text-[14px] font-medium text-white transition hover:bg-[#1769E8]"
              >
                Enter
              </button>
            </form>
          </div>
        </div>

        <div className="mt-[45px] h-px w-full bg-[#E7E7E7]" />

        <div className="pt-[38px] text-center">
          <p className="text-[14px] font-medium text-[#111111]">
            © 2026 DesignCup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
