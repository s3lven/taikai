/// <reference types="vitest" />
import { defineConfig, UserConfig } from "vite";
import { configDefaults } from 'vitest/config';
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: [...configDefaults.exclude, 'e2e/*'], // Exclude E2E tests from unit tests
  }
}as UserConfig)
