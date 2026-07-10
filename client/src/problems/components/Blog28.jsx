"use client";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@relume_io/relume-ui";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { RxChevronRight } from "react-icons/rx";

const useRelume = ({ defaultValue, selects }) => {
  const [activeSelect, setActiveSelect] = useState(defaultValue);
  const currentSelect = selects.find(function (select) {
    return select.value === activeSelect;
  });
  return { activeSelect, setActiveSelect, currentSelect };
};

export function Blog28() {
  const useActive = useRelume({
    defaultValue: "all-posts",
    selects: [
      {
        value: "all-posts",
        trigger: "All Posts",
        content: [
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
        ],
      },
      {
        value: "category-one",
        trigger: "Category one",
        content: [
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
        ],
      },
      {
        value: "category-two",
        trigger: "Category two",
        content: [
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
        ],
      },
      {
        value: "category-three",
        trigger: "Category three",
        content: [
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
        ],
      },
      {
        value: "category-four",
        trigger: "Category four",
        content: [
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
          {
            url: "#",
            image: {
              src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
              alt: "Relume placeholder image",
            },
            category: "Category",
            readTime: "5 min read",
            title: "Blog title heading will go here",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
            button: {
              title: "Read more",
              variant: "link",
              size: "link",
              iconRight: <RxChevronRight />,
            },
          },
        ],
      },
    ],
  });
  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container flex max-w-lg flex-col">
        <div className="mb-12 text-center md:mb-18 lg:mb-20">
          <div className="w-full max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">Problems</p>
            <h1 className="mb-5 text-6xl font-bold md:mb-6 md:text-9xl lg:text-10xl">
              Practice problems
            </h1>
            <p className="md:text-md">
              Master the craft one algorithm at a time
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-start">
          <div className="md:min-w- mb-10">
            <Select
              value={useActive.activeSelect}
              onValueChange={useActive.setActiveSelect}
            >
              <SelectTrigger className="min-w-[12.5rem] px-4 py-2 md:w-auto">
                All difficulties
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-posts">All difficulties</SelectItem>
                <SelectItem value="category-one">Easy</SelectItem>
                <SelectItem value="category-two">Medium</SelectItem>
                <SelectItem value="category-three">Hard</SelectItem>
                <SelectItem value="category-four">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:gap-y-16">
                <div>
                  <a href="#" className="mb-6 inline-block w-full max-w-full">
                    <div className="w-full overflow-hidden">
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                        alt="Relume placeholder image"
                        className="aspect-video size-full object-cover"
                      />
                    </div>
                  </a>
                  <div className="rb-4 mb-4 flex w-full items-center justify-start">
                    <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                      Easy
                    </p>
                    <p className="inline text-sm font-semibold">Two sum</p>
                  </div>
                  <a href="#" className="mb-2 block max-w-full">
                    <h5 className="text-2xl font-bold md:text-4xl">
                      Find the pair that adds up
                    </h5>
                  </a>
                  <p>
                    A clean start with hash maps and the brute force approach
                    visualized step by step
                  </p>
                  <Button
                    variant="link"
                    size="link"
                    iconRight={<RxChevronRight />}
                    className="mt-6 flex items-center justify-center gap-x-2"
                  >
                    Solve now
                  </Button>
                </div>
                <div>
                  <a href="#" className="mb-6 inline-block w-full max-w-full">
                    <div className="w-full overflow-hidden">
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                        alt="Relume placeholder image"
                        className="aspect-video size-full object-cover"
                      />
                    </div>
                  </a>
                  <div className="rb-4 mb-4 flex w-full items-center justify-start">
                    <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                      Medium
                    </p>
                    <p className="inline text-sm font-semibold">
                      Longest substring
                    </p>
                  </div>
                  <a href="#" className="mb-2 block max-w-full">
                    <h5 className="text-2xl font-bold md:text-4xl">
                      Slide the window without repeating characters
                    </h5>
                  </a>
                  <p>
                    Watch the pointers expand and contract as the set maintains
                    the current sequence
                  </p>
                  <Button
                    variant="link"
                    size="link"
                    iconRight={<RxChevronRight />}
                    className="mt-6 flex items-center justify-center gap-x-2"
                  >
                    Solve now
                  </Button>
                </div>
                <div>
                  <a href="#" className="mb-6 inline-block w-full max-w-full">
                    <div className="w-full overflow-hidden">
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                        alt="Relume placeholder image"
                        className="aspect-video size-full object-cover"
                      />
                    </div>
                  </a>
                  <div className="rb-4 mb-4 flex w-full items-center justify-start">
                    <p className="mr-4 bg-background-secondary px-2 py-1 text-sm font-semibold">
                      Hard
                    </p>
                    <p className="inline text-sm font-semibold">
                      Trapping rain water
                    </p>
                  </div>
                  <a href="#" className="mb-2 block max-w-full">
                    <h5 className="text-2xl font-bold md:text-4xl">
                      Calculate the water between the elevations
                    </h5>
                  </a>
                  <p>
                    See the two-pointer technique converge from the outer edges
                    toward the peak
                  </p>
                  <Button
                    variant="link"
                    size="link"
                    iconRight={<RxChevronRight />}
                    className="mt-6 flex items-center justify-center gap-x-2"
                  >
                    Solve now
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
