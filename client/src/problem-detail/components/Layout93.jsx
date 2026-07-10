"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout93() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start justify-between gap-x-12 gap-y-5 md:mb-18 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:mb-20 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">Playback</p>
            <h3 className="text-5xl font-bold leading-[1.2] md:text-7xl lg:text-8xl">
              Control time with a floating command bar
            </h3>
          </div>
          <div>
            <p className="mb-6 md:mb-8 md:text-md">
              A glassmorphic bar hovers over the canvas. Drag the scrubber to
              see line numbers appear like a film reel. The speed dial lets you
              flow from slow motion to double time.
            </p>
            <div className="grid grid-cols-1 gap-6 py-2 lg:grid-cols-2">
              <div className="flex">
                <div>
                  <h6 className="mb-3 text-md font-bold leading-[1.4] md:mb-4 md:text-xl">
                    Scrubber previews
                  </h6>
                  <p>
                    A thumbnail pops up showing the exact line number as you
                    scrub the timeline.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div>
                  <h6 className="mb-3 text-md font-bold leading-[1.4] md:mb-4 md:text-xl">
                    Speed dial
                  </h6>
                  <p>
                    Spin the dial for fluid speed changes instead of clicking
                    fixed rate buttons.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button title="Sandbox" variant="secondary">
                Sandbox
              </Button>
              <Button
                title="Docs"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
              >
                Docs
              </Button>
            </div>
          </div>
        </div>
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
          className="w-full object-cover"
          alt="Relume placeholder image"
        />
      </div>
    </section>
  );
}
