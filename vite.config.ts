import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
      }),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    noExternal: ["react-helmet-async"],
  },
  build: isSsrBuild
    ? {}
    : {
        chunkSizeWarningLimit: 800,
        rollupOptions: {
          output: {
            manualChunks: {
              "vendor-react": ["react", "react-dom", "react-router-dom"],
              "vendor-motion": ["motion"],
              "vendor-icons": ["@hugeicons/react", "@hugeicons/core-free-icons", "lucide-react"],
              "vendor-ui-heavy": ["vaul", "cmdk"],
            },
          },
        },
      },
}));
