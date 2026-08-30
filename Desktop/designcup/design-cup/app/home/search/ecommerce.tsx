import Image from "next/image";
import Link from "next/link";

const images = [
  "/home/search/ecommerce/1.png",
  "/home/search/ecommerce/2.png",
  "/home/search/ecommerce/3.png",
  "/home/search/ecommerce/4.png",
  "/home/search/ecommerce/5.png",
  "/home/search/ecommerce/6.png",
  "/home/search/ecommerce/7.png",
];

export default function Ecommerce() {
  return (
    <section className="mt-[54px]">
      <div className="mb-[16px] flex items-end justify-between">
        <div className="flex items-center gap-[12px]">
          <h3 className="text-[20px] font-medium text-[#171717]">E-commerce</h3>

          <span className="text-[14px] text-[#8A8A8A]">Sell beautifully</span>
        </div>

        <Link
          href="/explore?category=ecommerce"
          className="text-[14px] text-[#287CFF]"
        >
          View All
        </Link>
      </div>

      <div className="flex h-[300px] gap-[12px] overflow-hidden rounded-[18px] bg-[#F5F6FD] p-[16px]">
        {images.map((src, index) => (
          <Link
            key={src}
            href="/explore?category=ecommerce"
            className="group relative h-full min-w-0 flex-1 overflow-hidden rounded-[10px]"
          >
            <Image
              src={src}
              alt={`E-commerce design ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
