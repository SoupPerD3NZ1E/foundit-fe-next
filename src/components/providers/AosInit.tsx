"use client";

import { useEffect } from "react";
import AOS from "aos";

/**
 * Initializes AOS (Animate On Scroll) on the client.
 *
 * Why this is required: globals.css imports `aos/dist/aos.css`, which sets
 * every `[data-aos]` element to `opacity: 0` until AOS adds the `aos-animate`
 * class. The Angular app initialised AOS globally; without this, the hero
 * (and any data-aos element) would render invisible. Renders nothing.
 */
export default function AosInit() {
  useEffect(() => {
    AOS.init({ once: true, duration: 700 });
  }, []);

  return null;
}
