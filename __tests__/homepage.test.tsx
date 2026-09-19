import '@testing-library/jest-dom'
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Page from "@/app/page"
import { ThemeProvider } from "@/lib/theme-provider"

describe("Homepage Smoke Test", () => {
  it("renders the approved visible content correctly", () => {
    const { getByText, getAllByText } = render(
      <ThemeProvider>
        <Page />
      </ThemeProvider>
    );

    expect(getAllByText(/SparkTrail/i).length).toBeGreaterThan(0);
    expect(getByText(/Small steps./i)).toBeDefined();
    expect(getByText(/Real progress./i)).toBeDefined();
    expect(getAllByText(/Start your trail/i).length).toBeGreaterThan(0);
    expect(getAllByText(/Explore community/i).length).toBeGreaterThan(0);
    expect(getAllByText(/BUILDING/i).length).toBeGreaterThan(0);
    expect(getByText(/Progress has a story./i)).toBeDefined();
  });
});
