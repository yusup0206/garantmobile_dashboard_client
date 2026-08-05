import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes";
import { useUiStore } from "@/store/ui.store";

export function App() {
  const theme = useUiStore((s) => s.theme);

  // Keep the <html data-theme> attribute in sync with the store so the CSS
  // variables in theme.css reskin the whole app.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <RouterProvider router={router} />;
}
