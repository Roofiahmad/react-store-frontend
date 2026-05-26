import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  esbuild: {
    loader: "jsx", // Tells esbuild to parse .js files as JSX
    include: /src\/.*\.js$/, // Optional: restrict this to your src directory
  },
});
