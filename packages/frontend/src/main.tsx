import { RouterRoot } from "@typeroute/router";
import { createRoot } from "react-dom/client";

import "./index.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Toaster } from "@/components/ui/toast";
import { routes } from "@/router";

// biome-ignore lint/style/noNonNullAssertion: generated react code
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <RouterRoot routes={routes} />
    <Toaster />
  </ThemeProvider>,
);
