import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Page from "@/app/page";

// Next.js Link mock is sometimes needed if the environment doesn't support routing
// but RTL usually handles simple <a href> rendering from next/link fine.

describe("Homepage Smoke Test", () => {
  it("renders the approved visible content correctly", () => {
    render(<Page />);

    // Brand / Navbar (might be multiple instances e.g. logo, footer)
    expect(screen.getAllByText(/SparkTrail/i).length).toBeGreaterThan(0);

    // Hero messages
    expect(screen.getByText(/Small steps./i)).toBeInTheDocument();
    expect(screen.getByText(/Real progress./i)).toBeInTheDocument();

    // CTAs (could also be multiple)
    expect(screen.getAllByText(/Start your trail/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Explore community/i).length).toBeGreaterThan(0);

    // Progress state badge
    expect(screen.getAllByText(/BUILDING/i).length).toBeGreaterThan(0);

    // Teaser
    expect(screen.getByText(/Progress has a story./i)).toBeInTheDocument();
  });
});
