import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("Sanity Test", () => {
  it("renders a minimal React component and uses jest-dom matchers", () => {
    const TestComponent = () => <div>Hello, Vitest!</div>;
    render(<TestComponent />);
    expect(screen.getByText("Hello, Vitest!")).toBeInTheDocument();
  });
});
