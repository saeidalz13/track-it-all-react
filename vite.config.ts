import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  // to ignore the warning of size
  build: {
    chunkSizeWarningLimit: 1000,
  },

  // for fly.io
  server: {
    host: "0.0.0.0", // Allows access from the network
    // port: 80, // Runs on port 80
    port: 5173, // Runs on port 80
  },
});
