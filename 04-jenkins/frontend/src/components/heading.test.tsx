import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Heading from "./heading";

describe("Heading", () => {
  it("renders h1 by default with base classes", () => {
    render(<Heading>Page title</Heading>);

    const heading = screen.getByRole("heading", { level: 1, name: "Page title" });

    expect(heading.tagName).toBe("H1");
    expect(heading).toHaveClass("font-display");
    expect(heading).toHaveClass("font-bold");
    expect(heading).toHaveClass("text-4xl");
  });

  it("renders the requested tag and size class for h2", () => {
    render(<Heading as="h2">Section title</Heading>);

    const heading = screen.getByRole("heading", { level: 2, name: "Section title" });

    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveClass("text-3xl");
  });

  it("renders h4 without mapped size class", () => {
    render(<Heading as="h4">Minor heading</Heading>);

    const heading = screen.getByRole("heading", { level: 4, name: "Minor heading" });

    expect(heading.tagName).toBe("H4");
    expect(heading).not.toHaveClass("text-4xl");
    expect(heading).not.toHaveClass("text-3xl");
    expect(heading).not.toHaveClass("text-lg");
  });

  it("merges className and forwards native props", () => {
    render(
      <Heading as="h3" className="tracking-tight" id="recipe-title" data-testid="recipe-heading">
        Recipe title
      </Heading>,
    );

    const heading = screen.getByTestId("recipe-heading");

    expect(heading.tagName).toBe("H3");
    expect(heading).toHaveClass("font-display");
    expect(heading).toHaveClass("font-bold");
    expect(heading).toHaveClass("text-lg");
    expect(heading).toHaveClass("tracking-tight");
    expect(heading).toHaveAttribute("id", "recipe-title");
  });
});
