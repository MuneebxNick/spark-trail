import '@testing-library/jest-dom'
import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"

describe("Sanity Test", () => {
  it("renders a minimal React component and uses jest-dom matchers", () => {
    const TestComponent = () => <div>Hello, Vitest!</div>;
    const { getByText } = render(<TestComponent />);
    expect(getByText("Hello, Vitest!")).toBeDefined();
  });
});
