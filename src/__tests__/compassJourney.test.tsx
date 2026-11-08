import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CompassJourney } from "../components/common/CompassJourney";

const state = vi.hoisted(() => ({ reduced: false }));
vi.mock("motion/react", () => ({ useReducedMotion: () => state.reduced }));

describe("Welcome compass playback", () => {
  let onIntersection: IntersectionObserverCallback;

  beforeEach(() => {
    state.reduced = false;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          onIntersection = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("does not load or play animated media with reduced motion", () => {
    state.reduced = true;
    const { container } = render(<CompassJourney isFr={false} />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "/assets/compass-journey.svg",
    );
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it("plays only onscreen and keeps the user pause choice", () => {
    render(<CompassJourney isFr={false} />);
    onIntersection(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Pause animation" }));
    onIntersection(
      [{ isIntersecting: false }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
    onIntersection(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    );
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Play animation" })).toBeTruthy();
  });

  it("keeps the illustration and translated journey labels when video fails", () => {
    const { container } = render(<CompassJourney isFr />);
    fireEvent.error(container.querySelector("video")!);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).toBeTruthy();
    expect(screen.getByText("Trouvez votre voie")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
