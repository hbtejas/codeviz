"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { RxChevronRight } from "react-icons/rx";
import { Link } from "react-router-dom";

const useRelume = () => {
  const [hoveredFeatureIdx, setHoveredFeatureIdx] = useState(null);
  const handleMouseEnter = (index) => () => {
    setHoveredFeatureIdx(index);
  };
  const handleMouseLeave = () => {
    setHoveredFeatureIdx(null);
  };
  const startAnimation = (index) => {
    return hoveredFeatureIdx === index ? "visible" : "hidden";
  };
  return {
    handleMouseEnter,
    handleMouseLeave,
    startAnimation,
  };
};

const features = [
  {
    tagline: "Timeline",
    title: "Scrub the timeline and see the line number appear",
    description: "Hover over the playback bar and a thumbnail pops up showing the exact line of code. You know where you are jumping before you land.",
    link: "/sandbox",
    linkText: "Sandbox",
  },
  {
    tagline: "Variables",
    title: "Watch every variable mutate as code executes",
    description: "The variable watch panel highlights changes in real time. See pointers advance, arrays swap, and counters increment step by step.",
    link: "/sandbox",
    linkText: "Sandbox",
  },
  {
    tagline: "Call Stack",
    title: "Trace recursive calls through the visual call stack",
    description: "Each function frame appears as a stacked card. Watch the stack grow during recursion and unwind as functions return their values.",
    link: "/dsa",
    linkText: "DSA Library",
  },
];

export function Layout423() {
  const hoverState = useRelume();
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Scrub</p>
          <h2 className="rb-5 mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Precision micro-interactions
          </h2>
          <p className="md:text-md">
            Small details that make the complex feel simple and fast.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-6 md:gap-8 lg:flex-row">
          {features.map((feature, idx) => (
            <Link
              key={idx}
              to={feature.link}
              className="relative flex w-full flex-col overflow-hidden lg:h-full lg:w-1/2 lg:transition-all lg:duration-200 lg:hover:w-[70%]"
              onMouseOver={hoverState.handleMouseEnter(idx)}
              onMouseLeave={hoverState.handleMouseLeave}
            >
              <div className="absolute inset-0 flex size-full flex-col items-center justify-center self-start">
                <div className="absolute inset-0 bg-black/50" />
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                  alt={`Feature ${idx + 1}`}
                  className="size-full object-cover"
                />
              </div>
              <div className="group relative flex h-full min-h-[70vh] flex-col justify-end p-6 md:p-8">
                <div className="lg:absolute lg:inset-0 lg:z-0 lg:transition-all lg:duration-300 lg:group-hover:bg-black/50" />
                <div className="z-10">
                  <p className="mb-2 font-semibold text-text-alternative">
                    {feature.tagline}
                  </p>
                  <h3 className="text-2xl font-bold text-text-alternative md:text-3xl md:leading-[1.3] lg:text-4xl">
                    {feature.title}
                  </h3>
                  <div className="lg:hidden">
                    <p className="mt-5 text-text-alternative md:mt-6">
                      {feature.description}
                    </p>
                    <div className="mt-6 md:mt-8">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-text-alternative underline-offset-4 hover:underline">
                        {feature.linkText} <RxChevronRight />
                      </span>
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  <motion.div
                    className="z-10 hidden lg:block lg:w-[340px]"
                    variants={{
                      hidden: { opacity: 0, height: 0, y: 50 },
                      visible: { opacity: 1, height: "auto", y: 0 },
                    }}
                    initial="hidden"
                    animate={hoverState.startAnimation(idx)}
                    exit="hidden"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="mt-5 text-text-alternative md:mt-6">
                      {feature.description}
                    </p>
                    <div className="mt-6 md:mt-8">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-text-alternative underline-offset-4 hover:underline">
                        {feature.linkText} <RxChevronRight />
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
