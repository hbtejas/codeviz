"use client";

import React from "react";
import { Link } from "react-router-dom";

export function Cta25() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg text-center">
        <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
          Start visualizing your code now
        </h2>
        <p className="md:text-md">
          Open the sandbox. Paste an algorithm. Watch it execute step by step in
          a dark glass cockpit built for deep focus. No sign-up required.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 md:mt-8">
          <Link
            to="/sandbox"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-background-alternative px-6 py-3 text-sm font-medium text-text-alternative ring-offset-white transition-colors hover:bg-neutral-darker"
          >
            Sandbox
          </Link>
          <Link
            to="/problems"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-border-primary bg-background-primary px-6 py-3 text-sm font-medium text-text-primary ring-offset-white transition-colors hover:bg-background-secondary"
          >
            Problems
          </Link>
        </div>
      </div>
    </section>
  );
}
