"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Stats55() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[0.5fr_1fr] lg:items-center lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold md:mb-4">Impact</p>
            <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              The numbers behind the logic
            </h2>
            <p className="md:text-md">
              We track the machinery of our own growth. Here is the proof that
              seeing the code work changes everything.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button title="Library" variant="secondary">
                Library
              </Button>
              <Button
                title="Sandbox"
                variant="link"
                size="link"
                iconRight={<RxChevronRight />}
              >
                Sandbox
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 py-2 md:grid-cols-2">
            <div className="flex flex-col justify-center border border-border-primary p-8 text-center">
              <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
                50+
              </p>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                Algorithms visualized and counting
              </h3>
            </div>
            <div className="flex flex-col justify-center border border-border-primary p-8 text-center">
              <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
                120k+
              </p>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                Active learners stepping through
              </h3>
            </div>
            <div className="flex flex-col justify-center border border-border-primary p-8 text-center">
              <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
                14M+
              </p>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                Lines of code executed
              </h3>
            </div>
            <div className="flex flex-col justify-center border border-border-primary p-8 text-center">
              <p className="mb-2 text-10xl font-bold leading-[1.3] md:text-[4rem] lg:text-[5rem]">
                45+
              </p>
              <h3 className="text-md font-bold leading-[1.4] md:text-xl">
                University partners and instructors
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
