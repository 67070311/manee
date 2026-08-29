import Update from "./update";
import Body from "./body";

export default function Challenge() {
  return (
    <section className="w-full bg-[#F4F6FF] px-6 py-[88px]">
      <div className="mx-auto w-full max-w-[1180px] rounded-[38px] bg-white px-[52px] pb-[46px] pt-[42px]">
        {/* Header */}
        <div className="flex w-full flex-col items-center text-center">
          <h2 className="text-[36px] font-medium leading-[1.2] text-black">
            This Week Challenge
          </h2>

          <p className="mt-[18px] text-[16px] font-normal leading-[1.6] text-[#222222]">
            A new creative challenge starts every week. Submit your best work,
            get discovered, and earn your place in the Hall of Fame.
          </p>
        </div>

        {/* Orange Design */}
        <Update />

        {/* Countdown + Upload */}
        <div className="mt-[26px]">
          <Body />
        </div>
      </div>
    </section>
  );
}
