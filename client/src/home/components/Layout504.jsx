"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxChevronRight } from "react-icons/rx";

export function Layout504() {
  const [activeTab, setActiveTab] = useState("tab-one");

  const tabs = [
    { value: "tab-one", label: "Split panels" },
    { value: "tab-two", label: "Playback bar" },
    { value: "tab-three", label: "Variable watch" },
  ];

  const tabContent = {
    "tab-one": {
      tagline: "Control",
      title: "Resize your workspace with draggable split panels",
      description: "No fixed widths here. Grab the divider and give the editor more room on an ultrawide monitor or expand the visualizer to trace a complex graph.",
    },
    "tab-two": {
      tagline: "Playback",
      title: "Scrub through execution like a video timeline",
      description: "The floating playback bar sits over the canvas, keeping controls close and the code editor clean. Jump to any step instantly.",
    },
    "tab-three": {
      tagline: "Inspect",
      title: "Watch every variable mutate in real time",
      description: "The variable watch panel tracks all state changes. See exactly when a value flips, a pointer advances, or a recursive call returns.",
    },
  };

  const current = tabContent[activeTab];

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Visualize</p>
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              A glass cockpit for code
            </h1>
            <p className="md:text-md">
              Drag the split panels to fit your screen. The floating playback
              bar sits over the canvas like a video editor, keeping controls
              close and the editor clean.
            </p>
            <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
              <Link
                to="/sandbox"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-border-primary bg-background-primary px-5 py-2 text-sm font-medium transition-colors hover:bg-background-secondary"
              >
                Explore
              </Link>
              <Link
                to="/sandbox"
                className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
              >
                Sandbox <RxChevronRight />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="no-scrollbar relative mb-12 flex w-screen flex-nowrap items-center gap-x-6 overflow-auto px-[5vw] md:mb-16 md:w-auto md:max-w-full md:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`whitespace-nowrap border-0 border-b-[1.5px] px-0 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? "border-border-primary text-text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="animate-tabs w-full">
            <div className="grid grid-cols-1 border border-border-primary md:grid-cols-2 md:items-center">
              <div className="aspect-square">
                <img
                  src="/visualizer_cockpit.png"
                  className="w-full object-cover"
                  alt="Feature visualization"
                />
              </div>
              <div className="p-6 md:p-8 lg:p-12">
                <p className="mb-3 font-semibold md:mb-4">{current.tagline}</p>
                <h2 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                  {current.title}
                </h2>
                <p>{current.description}</p>
                <div className="mt-6 flex items-center gap-x-4 md:mt-8">
                  <Link
                    to="/sandbox"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-border-primary bg-background-primary px-5 py-2 text-sm font-medium transition-colors hover:bg-background-secondary"
                  >
                    Sandbox
                  </Link>
                  <Link
                    to="/problems"
                    className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
                  >
                    Problems <RxChevronRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
