"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxChevronRight } from "react-icons/rx";

export function Layout503() {
  const [activeTab, setActiveTab] = useState("tab-one");

  const tabs = [
    { value: "tab-one", label: "Progress rings" },
    { value: "tab-two", label: "Neon badges" },
    { value: "tab-three", label: "Category grid" },
  ];

  const tabContent = {
    "tab-one": {
      tagline: "Progress",
      title: "See the radial dials fill as you conquer categories",
      description: "The grid shows exactly where you stand. A half-full ring on sliding window tells you there is more work to do. A full ring means the concept is yours.",
    },
    "tab-two": {
      tagline: "Difficulty",
      title: "Neon badges mark every problem's challenge level",
      description: "Easy green, medium amber, hard red — difficulty badges glow in dark neon so you know what you are hunting before you click.",
    },
    "tab-three": {
      tagline: "Categories",
      title: "Browse 30 algorithmic patterns at a glance",
      description: "From sliding window to grid DP, the category grid organises every problem pattern. Watch your mastery percentage climb category by category.",
    },
  };

  const current = tabContent[activeTab];

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mb-12 md:mb-18 lg:mb-20">
          <div className="mx-auto max-w-lg text-center">
            <p className="mb-3 font-semibold md:mb-4">Gamify</p>
            <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
              Track your mastery progress
            </h1>
            <p className="md:text-md">
              Each category shows a radial dial filling as you solve. Dark neon
              badges mark the difficulty so you know what you are hunting before
              you click.
            </p>
            <div className="mt-6 flex items-center justify-center gap-x-4 md:mt-8">
              <Link
                to="/problems"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-border-primary bg-background-primary px-5 py-2 text-sm font-medium transition-colors hover:bg-background-secondary"
              >
                Problems
              </Link>
              <Link
                to="/dsa"
                className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
              >
                DSA Library <RxChevronRight />
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
              <div className="p-6 md:p-8 lg:p-12">
                <p className="mb-3 font-semibold md:mb-4">{current.tagline}</p>
                <h2 className="mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
                  {current.title}
                </h2>
                <p>{current.description}</p>
                <div className="mt-6 flex items-center gap-x-4 md:mt-8">
                  <Link
                    to="/problems"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-border-primary bg-background-primary px-5 py-2 text-sm font-medium transition-colors hover:bg-background-secondary"
                  >
                    Problems
                  </Link>
                  <Link
                    to="/dsa"
                    className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
                  >
                    DSA Library <RxChevronRight />
                  </Link>
                </div>
              </div>
              <div className="aspect-square">
                <img
                  src="/sorting_visualizer.png"
                  className="w-full object-cover"
                  alt="Feature visualization"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
