import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["cli.ts"],
  replaceNodeEnv: true,
  treeshake: true,
  target: "node16",
  outDir: "./bin",
  format: "esm",
  minify: true,
  splitting: false,
  sourcemap: false,
  bundle: true,
  clean: true,
});
