import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

/**
 * Proves the test harness itself works: jsdom renders, Testing Library queries
 * resolve, and the jest-dom matchers from vitest.setup.ts are registered.
 *
 * Deliberately decoupled from app code. A seed test against `app/page.tsx` would
 * break the moment that boilerplate is replaced, which teaches the wrong lesson
 * about why a test failed.
 */
function Probe() {
  return <h1>harness online</h1>;
}

test("renders a component and applies jest-dom matchers", () => {
  render(<Probe />);

  expect(
    screen.getByRole("heading", { level: 1, name: "harness online" }),
  ).toBeInTheDocument();
});
