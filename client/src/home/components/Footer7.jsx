"use client";

import React from "react";
import { Link } from "react-router-dom";

export function Footer7() {
  return (
    <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20">
      <div className="container">
        <div className="flex flex-col items-center pb-12 md:pb-18 lg:pb-20">
          <Link to="/" className="mb-8">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
              alt="CodeViz logo"
              className="inline-block"
            />
          </Link>
          <ul className="grid grid-flow-row grid-cols-1 items-start justify-center justify-items-center gap-6 md:grid-flow-col md:grid-cols-[max-content] md:justify-center md:justify-items-start">
            <li className="font-semibold">
              <Link to="/sandbox">Sandbox</Link>
            </li>
            <li className="font-semibold">
              <Link to="/problems">Problems</Link>
            </li>
            <li className="font-semibold">
              <Link to="/dsa">DSA Library</Link>
            </li>
            <li className="font-semibold">
              <Link to="/progress">Progress</Link>
            </li>
            <li className="font-semibold">
              <Link to="/">Home</Link>
            </li>
          </ul>
        </div>
        <div className="h-px w-full bg-border-primary" />
        <div className="flex flex-col-reverse items-center justify-between pb-4 pt-6 text-center text-sm md:flex-row md:pb-0 md:pt-8">
          <p className="mt-8 md:mt-0">&copy; {new Date().getFullYear()} CodeViz. All rights reserved.</p>
          <ul className="grid grid-flow-row grid-cols-[max-content] justify-center gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
            <li className="underline decoration-black underline-offset-1">
              <a href="#">Privacy Policy</a>
            </li>
            <li className="underline decoration-black underline-offset-1">
              <a href="#">Terms of Service</a>
            </li>
            <li className="underline decoration-black underline-offset-1">
              <a href="#">Cookies Settings</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
