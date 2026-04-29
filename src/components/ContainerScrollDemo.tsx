"use client";

import { ContainerScroll } from "./ui/container-scroll-animation";

export default function ContainerScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden w-full -mt-20 md:-mt-48 md:mb-0">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black dark:text-white mt-2 sm:mt-4 md:mt-6 mb-1 sm:mb-2 md:mb-3">
              From Vision to <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black mt-0 sm:mt-1 md:mt-1 leading-none text-[#a855f7] inline-block">
                Visual Impact
              </span>
            </h1>
          </>
        }
      >
        <video
          src="/media/mac-vid.mp4"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          autoPlay
          muted
          loop
          playsInline
        />
      </ContainerScroll>
    </div>
  );
}
