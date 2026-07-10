"use client";

import React from "react";

export function Header64() {
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container max-w-lg text-center">
        <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
          Two sum
        </h1>
        <p className="md:text-md">
          Find the pair of indices that add up to the target value using a hash
          map for constant time lookups.
        </p>
      </div>
    </section>
  );
}
