import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import {
  ThemeProvider,
  CssBaseline,
  StyledEngineProvider,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import bluesTheme from "./config/theme"; // 注意路径引用

// 1. 初始化 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分钟数据不过期
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

        <Links />
      </head>
      <body>
        {/* 2. 注入 StyledEngineProvider 确保 Tailwind 能覆盖 MUI 样式 */}
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={bluesTheme}>
            <CssBaseline />
            {/* 3. 注入 React Query Provider */}
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </ThemeProvider>
        </StyledEngineProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
