import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import ProductsPage from "./index";

vi.mock("@/config/env", () => ({
  isApiEnabled: () => false,
  env: { apiBaseUrl: "", appName: "GarantMobile", storefrontUrl: "" },
}));

vi.mock("@/services/brands/useBrands", () => ({
  useBrands: () => ({
    data: { count: 1, brands: [{ id: "brand_1", name: "Apple" }] },
    isLoading: false,
  }),
}));

vi.mock("@/services/categories/useCategories", () => ({
  useCategories: () => ({
    data: { count: 1, categories: [{ id: "1", nameRu: "Смартфоны", nameTk: "Smartfonlar" }] },
    isLoading: false,
  }),
}));

vi.mock("@/services/units/useUnits", () => ({
  useUnits: () => ({
    data: { count: 1, units: [{ id: "unit_1", nameRu: "Штука", shortName: "шт" }] },
    isLoading: false,
  }),
}));

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/products"]}>
        <ProductsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Products CRUD (integration)", () => {
  it("creates a product through the dialog and shows it in the table", async () => {
    const user = userEvent.setup();
    renderPage();

    // Wait for seed data to load.
    await screen.findByText(/iPhone 15 Pro/i, undefined, { timeout: 4000 });

    // Open add dialog.
    await user.click(screen.getByRole("button", { name: /Добавить/i }));
    const dialog = await screen.findByRole("dialog");

    // Fill bilingual fields.
    const inputs = within(dialog).getAllByRole("textbox");
    // nameRu, nameTk, shortRu, shortTk
    await user.type(inputs[0], "QA Phone 42");
    await user.type(inputs[1], "QA Phone 42 TM");
    await user.type(inputs[2], "Short description");
    await user.type(inputs[3], "Gysga beyan");

    // Select brand, category, unit
    const selects = within(dialog).getAllByRole("combobox");
    await user.selectOptions(selects[0], "brand_1");
    await user.selectOptions(selects[1], "1");
    await user.selectOptions(selects[2], "unit_1");

    const numbers = within(dialog).getAllByRole("spinbutton");
    await user.type(numbers[0], "1500"); // price
    await user.type(numbers[1], "1600"); // oldPrice
    await user.type(numbers[2], "7"); // stock

    // Submit form.
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    // The new row appears in the table.
    expect(
      await screen.findByText("QA Phone 42", undefined, { timeout: 4000 }),
    ).toBeInTheDocument();
  });
});
