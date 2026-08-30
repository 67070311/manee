import Image from "next/image";
import Link from "next/link";

const images = [
  "/home/search/landing-page/1.png",
  "/home/search/landing-page/2.png",
  "/home/search/landing-page/3.png",
  "/home/search/landing-page/4.png",
  "/home/search/landing-page/5.png",
  "/home/search/landing-page/6.png",
  "/home/search/landing-page/7.png",
];

export default function LandingPage() {
  return (
    <section className="mt-[54px]">
      {/* HEADER */}
      <div className="mb-[16px] flex items-end justify-between">
        <div className="flex items-center gap-[12px]">
          <h3 className="text-[20px] font-medium text-[#171717]">
            Landing Page
          </h3>

          <span className="text-[14px] text-[#8A8A8A]">Convert visitors.</span>
        </div>

        <Link
          href="/explore?category=landing-page"
          className="text-[14px] text-[#287CFF] transition-colors hover:text-[#1769E8]"
        >
          View All
        </Link>
      </div>

      {/* IMAGE GALLERY */}
      <div className="flex h-[300px] gap-[12px] overflow-hidden rounded-[18px] bg-[#F5F6FD] p-[16px]">
        {images.map((src, index) => (
          <Link
            key={src}
            href="/explore?category=landing-page"
            className="group relative h-full min-w-0 flex-1 overflow-hidden rounded-[10px]"
          >
            <Image
              src={src}
              alt={`Landing page design ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 15vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
