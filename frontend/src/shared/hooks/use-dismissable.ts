"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export interface Dismissable<T extends HTMLElement> {
  /** Attach to the element that wraps both the trigger and the popup. */
  containerRef: RefObject<T | null>;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Open/closed state for a popup that dismisses on an outside click or `Escape`.
 * Listeners are only attached while the popup is open.
 */
export function useDismissable<T extends HTMLElement = HTMLDivElement>(): Dismissable<T> {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<T>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((previous) => !previous), []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return { containerRef, isOpen, open, close, toggle };
}
