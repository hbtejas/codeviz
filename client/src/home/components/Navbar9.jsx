"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { RxChevronDown } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo";

const useRelume = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const openOnMobileDropdownMenu = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const openOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(true);
  };
  const closeOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(false);
  };
  const animateMobileMenu = isMobileMenuOpen ? "open" : "close";
  const animateMobileMenuButtonSpan = isMobileMenuOpen
    ? ["open", "rotatePhase"]
    : "closed";
  const animateDropdownMenu = isDropdownOpen ? "open" : "close";
  const animateDropdownMenuIcon = isDropdownOpen ? "rotated" : "initial";
  return {
    toggleMobileMenu,
    openOnDesktopDropdownMenu,
    closeOnDesktopDropdownMenu,
    openOnMobileDropdownMenu,
    animateMobileMenu,
    animateMobileMenuButtonSpan,
    animateDropdownMenu,
    animateDropdownMenuIcon,
  };
};

export function Navbar9() {
  const useActive = useRelume();
  const navigate = useNavigate();
  return (
    <section
      id="relume"
      className="relative z-[999] flex min-h-16 w-full items-center border-b border-border-primary bg-background-primary px-[5%] md:min-h-18"
    >
      <div className="mx-auto flex size-full max-w-full items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="absolute hidden h-screen overflow-auto border-b border-border-primary bg-background-primary px-[5%] pb-24 pt-4 md:pb-0 lg:static lg:ml-6 lg:flex lg:h-auto lg:flex-1 lg:items-center lg:justify-between lg:border-none lg:bg-none lg:px-0 lg:pt-0">
          <div className="flex flex-col items-center lg:flex-row">
            <Link
              to="/sandbox"
              className="relative block w-auto py-3 text-md lg:inline-block lg:px-4 lg:py-6 lg:text-base"
            >
              Sandbox
            </Link>
            <Link
              to="/problems"
              className="relative block w-auto py-3 text-md lg:inline-block lg:px-4 lg:py-6 lg:text-base"
            >
              Problems
            </Link>
            <Link
              to="/dsa"
              className="relative block w-auto py-3 text-md lg:inline-block lg:px-4 lg:py-6 lg:text-base"
            >
              DSA Library
            </Link>
            <div
              onMouseEnter={useActive.openOnDesktopDropdownMenu}
              onMouseLeave={useActive.closeOnDesktopDropdownMenu}
            >
              <button
                className="relative flex w-full items-center justify-between whitespace-nowrap py-3 text-md lg:w-auto lg:justify-start lg:gap-2 lg:px-4 lg:py-6 lg:text-base"
                onClick={useActive.openOnMobileDropdownMenu}
              >
                <span>About</span>
                <motion.span
                  animate={useActive.animateDropdownMenuIcon}
                  variants={{
                    rotated: { rotate: 180 },
                    initial: { rotate: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <RxChevronDown />
                </motion.span>
              </button>
              <AnimatePresence>
                <motion.nav
                  variants={{
                    open: {
                      opacity: 1,
                      height: "var(--height-open, auto)",
                      display: "block",
                    },
                    close: {
                      opacity: 0,
                      height: "var(--height-close, 0)",
                      display: "none",
                    },
                  }}
                  animate={useActive.animateDropdownMenu}
                  initial="close"
                  exit="close"
                  transition={{ duration: 0.2 }}
                  className="bottom-auto left-0 top-full w-full min-w-full max-w-full overflow-hidden bg-background-primary lg:absolute lg:w-screen lg:border-b lg:border-border-primary lg:px-[5%] lg:[--height-close:auto]"
                >
                  <div className="mx-auto flex size-full max-w-full items-center justify-between">
                    <div className="flex w-full flex-col lg:flex-row">
                      <div className="grid flex-1 grid-cols-1 content-start items-start gap-x-8 gap-y-2 py-4 md:grid-cols-2 md:gap-y-6 md:py-8 lg:auto-cols-fr lg:grid-cols-4 lg:content-stretch lg:items-stretch lg:gap-y-0">
                        <Link
                          to="/progress"
                          className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                        >
                          <div className="flex size-6 flex-col items-center justify-center">
                            <img
                              src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                              alt="Icon 1"
                              className="shrink-0"
                            />
                          </div>
                          <div className="flex flex-col items-start justify-center">
                            <h5 className="font-semibold">Progress Dashboard</h5>
                            <p className="hidden text-sm md:block">
                              Track your solved problems and daily streak
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/compare"
                          className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                        >
                          <div className="flex size-6 flex-col items-center justify-center">
                            <img
                              src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                              alt="Icon 2"
                              className="shrink-0"
                            />
                          </div>
                          <div className="flex flex-col items-start justify-center">
                            <h5 className="font-semibold">Algorithm Race</h5>
                            <p className="hidden text-sm md:block">
                              Compare sorting algorithms side by side in real time
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/dsa"
                          className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                        >
                          <div className="flex size-6 flex-col items-center justify-center">
                            <img
                              src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                              alt="Icon 3"
                              className="shrink-0"
                            />
                          </div>
                          <div className="flex flex-col items-start justify-center">
                            <h5 className="font-semibold">DSA Library</h5>
                            <p className="hidden text-sm md:block">
                              Deep dives into sorting, searching, and graph algorithms
                            </p>
                          </div>
                        </Link>
                        <Link
                          to="/problems"
                          className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                        >
                          <div className="flex size-6 flex-col items-center justify-center">
                            <img
                              src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                              alt="Icon 4"
                              className="shrink-0"
                            />
                          </div>
                          <div className="flex flex-col items-start justify-center">
                            <h5 className="font-semibold">Problems</h5>
                            <p className="hidden text-sm md:block">
                              180 curated LeetCode problems with visual walkthroughs
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-6 flex w-full flex-col items-start justify-between p-6 sm:items-center lg:mb-0 lg:flex-row lg:px-0 lg:py-3">
                    <div className="absolute -left-[50vw] -right-[50vw] bottom-0 top-0 w-[200vw] bg-background-secondary" />
                    <div className="relative z-10 mr-auto flex flex-col gap-y-4 sm:mx-auto sm:grid sm:auto-cols-fr sm:grid-cols-[max-content_max-content] sm:gap-x-1">
                      <p>Ready to visualize algorithms?</p>
                      <Link to="/sandbox" className="underline">
                        Open the Sandbox
                      </Link>
                    </div>
                  </div>
                </motion.nav>
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-border-primary bg-background-primary px-5 py-2 text-sm font-medium ring-offset-white transition-colors"
              onClick={() => navigate("/sandbox")}
            >
              Log in
            </button>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-background-alternative px-5 py-2 text-sm font-medium text-text-alternative ring-offset-white transition-colors"
              onClick={() => navigate("/problems")}
            >
              Sign up
            </button>
          </div>
        </div>
        <button
          className="-mr-2 flex size-12 cursor-pointer flex-col items-center justify-center lg:hidden"
          onClick={useActive.toggleMobileMenu}
        >
          <motion.span
            className="my-[3px] h-0.5 w-6 bg-white"
            animate={useActive.animateMobileMenuButtonSpan}
            variants={{
              open: { translateY: 8, transition: { delay: 0.1 } },
              rotatePhase: { rotate: -45, transition: { delay: 0.2 } },
              closed: {
                translateY: 0,
                rotate: 0,
                transition: { duration: 0.2 },
              },
            }}
          />
          <motion.span
            className="my-[3px] h-0.5 w-6 bg-white"
            animate={useActive.animateMobileMenu}
            variants={{
              open: { width: 0, transition: { duration: 0.1 } },
              closed: {
                width: "1.5rem",
                transition: { delay: 0.3, duration: 0.2 },
              },
            }}
          />
          <motion.span
            className="my-[3px] h-0.5 w-6 bg-white"
            animate={useActive.animateMobileMenuButtonSpan}
            variants={{
              open: { translateY: -8, transition: { delay: 0.1 } },
              rotatePhase: { rotate: 45, transition: { delay: 0.2 } },
              closed: {
                translateY: 0,
                rotate: 0,
                transition: { duration: 0.2 },
              },
            }}
          />
        </button>
      </div>
      <AnimatePresence>
        <motion.div
          variants={{ open: { height: "100dvh" }, close: { height: "auto" } }}
          animate={useActive.animateMobileMenu}
          initial="close"
          exit="close"
          className="absolute left-0 right-0 top-full w-full overflow-hidden lg:hidden"
          transition={{ duration: 0.4 }}
        >
          <motion.div
            variants={{ open: { y: 0 }, close: { y: "-100%" } }}
            animate={useActive.animateMobileMenu}
            initial="close"
            exit="close"
            transition={{ duration: 0.4 }}
            className="absolute left-0 right-0 top-0 block h-dvh overflow-auto border-b border-border-primary bg-background-primary px-[5%] pb-8 pt-4"
          >
            <div className="flex flex-col">
              <Link to="/sandbox" className="block py-3 text-md">
                Sandbox
              </Link>
              <Link to="/problems" className="block py-3 text-md">
                Problems
              </Link>
              <Link to="/dsa" className="block py-3 text-md">
                DSA Library
              </Link>
              <div>
                <button
                  className="relative flex w-full items-center justify-between whitespace-nowrap py-3 text-md lg:w-auto lg:justify-start lg:gap-2 lg:px-4 lg:py-6 lg:text-base"
                  onClick={useActive.openOnMobileDropdownMenu}
                >
                  <span>More</span>
                  <motion.span
                    animate={useActive.animateDropdownMenuIcon}
                    variants={{
                      rotated: { rotate: 180 },
                      initial: { rotate: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <RxChevronDown />
                  </motion.span>
                </button>
                <AnimatePresence>
                  <motion.nav
                    variants={{
                      open: {
                        opacity: 1,
                        height: "var(--height-open, auto)",
                        display: "block",
                      },
                      close: {
                        opacity: 0,
                        height: "var(--height-close, 0)",
                        display: "none",
                      },
                    }}
                    animate={useActive.animateDropdownMenu}
                    initial="close"
                    exit="close"
                    transition={{ duration: 0.2 }}
                    className="bottom-auto left-0 top-full w-full min-w-full max-w-full overflow-hidden bg-background-primary lg:absolute lg:w-screen lg:border-b lg:border-border-primary lg:px-[5%] lg:[--height-close:auto]"
                  >
                    <div className="mx-auto flex size-full max-w-full items-center justify-between">
                      <div className="flex w-full flex-col lg:flex-row">
                        <div className="grid flex-1 grid-cols-1 content-start items-start gap-x-8 gap-y-2 py-4 md:grid-cols-2 md:gap-y-6 md:py-8 lg:auto-cols-fr lg:grid-cols-4 lg:content-stretch lg:items-stretch lg:gap-y-0">
                          <Link
                            to="/progress"
                            className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                          >
                            <div className="flex size-6 flex-col items-center justify-center">
                              <img
                                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                                alt="Icon 1"
                                className="shrink-0"
                              />
                            </div>
                            <div className="flex flex-col items-start justify-center">
                              <h5 className="font-semibold">Progress</h5>
                              <p className="hidden text-sm md:block">
                                Track your daily streak and solved problems
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/compare"
                            className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                          >
                            <div className="flex size-6 flex-col items-center justify-center">
                              <img
                                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                                alt="Icon 2"
                                className="shrink-0"
                              />
                            </div>
                            <div className="flex flex-col items-start justify-center">
                              <h5 className="font-semibold">Algorithm Race</h5>
                              <p className="hidden text-sm md:block">
                                Compare algorithms side by side
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/dsa"
                            className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                          >
                            <div className="flex size-6 flex-col items-center justify-center">
                              <img
                                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                                alt="Icon 3"
                                className="shrink-0"
                              />
                            </div>
                            <div className="flex flex-col items-start justify-center">
                              <h5 className="font-semibold">DSA Library</h5>
                              <p className="hidden text-sm md:block">
                                Interactive algorithm visualizations
                              </p>
                            </div>
                          </Link>
                          <Link
                            to="/problems"
                            className="grid w-full auto-cols-fr grid-cols-[max-content_1fr] items-start gap-x-3 py-2"
                          >
                            <div className="flex size-6 flex-col items-center justify-center">
                              <img
                                src="https://d22po4pjz3o32e.cloudfront.net/relume-icon.svg"
                                alt="Icon 4"
                                className="shrink-0"
                              />
                            </div>
                            <div className="flex flex-col items-start justify-center">
                              <h5 className="font-semibold">Problems</h5>
                              <p className="hidden text-sm md:block">
                                180 curated coding problems
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.nav>
                </AnimatePresence>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-border-primary bg-background-primary px-5 py-2 text-sm font-medium"
                  onClick={() => window.location.href = "/sandbox"}
                >
                  Sandbox
                </button>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-background-alternative px-5 py-2 text-sm font-medium text-text-alternative"
                  onClick={() => window.location.href = "/problems"}
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
