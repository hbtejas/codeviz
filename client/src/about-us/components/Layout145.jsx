"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";
import { RxChevronRight } from "react-icons/rx";

export function Layout145() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <div className="rb-5 mb-5 md:mb-6">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                className="size-20"
                alt="Relume logo"
              />
            </div>
            <p className="mb-3 font-semibold md:mb-4">Origin</p>
            <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              We got tired of staring at dead diagrams
            </h2>
            <p className="md:text-md">
              A textbook shows you a frozen frame. A whiteboard smudges. We
              wanted to see the pointer move, the array swap, the recursion
              stack breathe. So we built a living visual playground where the
              code runs and the logic reveals itself.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
              <Button title="Problems" variant="secondary">
                Problems
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
        </div>
        <div>
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
            className="size-full object-cover"
            alt="Relume placeholder image"
          />
        </div>
      </div>
    </section>
  );
}
