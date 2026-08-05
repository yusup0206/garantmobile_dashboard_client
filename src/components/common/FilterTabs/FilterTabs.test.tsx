import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterTabs, type FilterTab } from "./index";

const tabs: FilterTab[] = [
  { key: "all", label: "filter.all" },
  { key: "active", label: "products.filter.active" },
  { key: "draft", label: "products.filter.draft" },
];

describe("FilterTabs", () => {
  it("renders localized tab labels (ru by default)", () => {
    render(<FilterTabs tabs={tabs} value="all" onChange={() => {}} />);
    // t() resolves the dotted keys against the default (ru) dictionary
    expect(screen.getByRole("button", { name: "Все" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "В продаже" })).toBeInTheDocument();
  });

  it("calls onChange with the tab key when clicked", async () => {
    const onChange = vi.fn();
    render(<FilterTabs tabs={tabs} value="all" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "В продаже" }));
    expect(onChange).toHaveBeenCalledWith("active");
  });
});
