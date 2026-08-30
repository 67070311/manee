import Image from "next/image";
import Link from "next/link";

const images = [
  "/home/search/branding/1.1.png",
  "/home/search/branding/1.2.png",
  "/home/search/branding/1.3.png",
  "/home/search/branding/1.4.png",
  "/home/search/branding/1.5.png",
  "/home/search/branding/1.6.png",
  "/home/search/branding/1.7.png",
];

export default function Branding() {
  return (
    <section className="mt-[54px]">
      <div className="mb-[16px] flex items-end justify-between">
        <div className="flex items-center gap-[12px]">
          <h3 className="text-[20px] font-medium text-[#171717]">Branding</h3>

          <span className="text-[14px] text-[#8A8A8A]">Build identities</span>
        </div>

        <Link
          href="/explore?category=branding"
          className="text-[14px] text-[#287CFF]"
        >
          View All
        </Link>
      </div>

      <div className="flex h-[300px] gap-[12px] overflow-hidden rounded-[18px] bg-[#F5F6FD] p-[16px]">
        {images.map((src, index) => (
          <Link
            key={src}
            href="/explore?category=branding"
            className="group relative h-full min-w-0 flex-1 overflow-hidden rounded-[10px]"
          >
            <Image
              src={src}
              alt={`Branding design ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
