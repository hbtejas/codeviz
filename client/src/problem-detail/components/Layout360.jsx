"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout360() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="rb-12 mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Audit</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Every step leaves a trace
            </h2>
            <p className="md:text-md">
              Open the side drawer to read the full execution history.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
          <div className="border border-border-primary">
            <div className="p-6 md:p-8 lg:p-12">
              <p className="mb-2 text-sm font-semibold">History</p>
              <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                A running log of every comparison and swap
              </h3>
              <p>
                The collapsible trace drawer shows a running log. Step 12 left
                incremented to 2. Step 13 comparing index 2 and 3.
              </p>
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
            <div className="flex items-center justify-center">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                className="size-full object-cover"
                alt="Relume placeholder image 1"
              />
            </div>
          </div>
          <div className="border border-border-primary">
            <div className="p-6 md:p-8 lg:p-12">
              <p className="mb-2 text-sm font-semibold">Variables</p>
              <h3 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                Click a variable and the canvas answers
              </h3>
              <p>
                Tap any variable name in the watch panel. The corresponding
                array chart or tree structure flashes with a glow border.
              </p>
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
            <div className="flex items-center justify-center">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                className="size-full object-cover"
                alt="Relume placeholder image 1"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
