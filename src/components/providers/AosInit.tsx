'use client';

import { useEffect } from 'react';

export default function AosInit() {
  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.default.init({ duration: 800, once: true });
    });
  }, []);
  return null;
}
