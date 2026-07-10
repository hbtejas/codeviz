"use client";

import React from "react";
import { Link } from "react-router-dom";

export function Header83() {
  return (
    <section className="relative px-[5%] py-16 md:py-24 lg:py-28 flex flex-col items-center justify-center overflow-hidden">
      {/* Immersive background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container max-w-4xl text-center z-10 flex flex-col items-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
          Master algorithms <span className="gradient-text">visually</span>
        </h1>
        <p className="max-w-2xl text-slate-400 text-sm md:text-base lg:text-lg mb-8 leading-relaxed">
          See your code execute step by step. Watch pointers move, arrays swap, and recursion trees unfold in a dark glass cockpit built for deep focus.
        </p>
        <div className="flex items-center justify-center gap-4 mb-16">
          <Link
            to="/sandbox"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:scale-[1.02]"
          >
            Start Visualizing
          </Link>
          <Link
            to="/problems"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-slate-700 bg-transparent px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5"
          >
            Practice Problems
          </Link>
        </div>
        
        {/* Visualizer Cockpit Mockup */}
        <div className="relative w-full max-w-4xl rounded-xl border border-slate-800/80 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-xl pointer-events-none" />
          <img
            src="/visualizer_cockpit.png"
            alt="CodeViz Visualizer Dashboard"
            className="w-full rounded-lg object-cover shadow-inner"
          />
        </div>
      </div>
    </section>
  );
}
