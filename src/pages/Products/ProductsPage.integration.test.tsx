import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import ProductsPage from "./index";

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

    // Wait for the seed data to load so we're interacting with a live table.
    await screen.findByText(/iPhone 15 Pro Max/i, undefined, { timeout: 4000 });

    // Open the add dialog from the header.
    await user.click(screen.getByRole("button", { name: "Добавить" }));
    const dialog = await screen.findByRole("dialog");

    // Fill the form.
    await user.type(within(dialog).getByPlaceholderText("iPhone 15 Pro"), "QA Phone 42");
    await user.type(within(dialog).getByPlaceholderText("Apple"), "QA Brand");
    await user.type(within(dialog).getByPlaceholderText("Смартфоны"), "Смартфоны");
    const numbers = within(dialog).getAllByRole("spinbutton");
    await user.type(numbers[0], "1500"); // price
    await user.type(numbers[1], "7"); // stock

    // Submit.
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    // The new row appears in the table (mock store prepends, so it's on page 1).
    expect(
      await screen.findByText("QA Phone 42", undefined, { timeout: 4000 }),
    ).toBeInTheDocument();
  });

  it("blocks submit on an empty variant SKU, then saves once filled", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText(/iPhone 15 Pro Max/i, undefined, { timeout: 4000 });

    await user.click(screen.getByRole("button", { name: "Добавить" }));
    const dialog = await screen.findByRole("dialog");

    await user.type(
      within(dialog).getByPlaceholderText("iPhone 15 Pro"),
      "QA Variant Phone",
    );
    await user.type(within(dialog).getByPlaceholderText("Apple"), "QA Brand");
    await user.type(within(dialog).getByPlaceholderText("Смартфоны"), "Смартфоны");
    const numbers = within(dialog).getAllByRole("spinbutton");
    await user.type(numbers[0], "1500"); // price
    await user.type(numbers[1], "7"); // stock

    // Add a variant but leave its SKU empty → submit is blocked with an error.
    await user.click(within(dialog).getByRole("button", { name: "Добавить вариант" }));
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));
    expect(await within(dialog).findByText("Укажите SKU варианта")).toBeInTheDocument();

    // Fill the SKU and submit again → the product is created.
    await user.type(within(dialog).getByPlaceholderText("SKU (артикул)"), "QA-SKU-1");
    await user.click(within(dialog).getByRole("button", { name: "Добавить" }));

    expect(
      await screen.findByText("QA Variant Phone", undefined, { timeout: 4000 }),
    ).toBeInTheDocument();
  });
});
