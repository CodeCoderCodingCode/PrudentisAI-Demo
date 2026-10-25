import { fileURLToPath } from "node:url";
import baseConfig from "../tailwind.config.mjs";

const root = fileURLToPath(new URL("../", import.meta.url)).replaceAll("\\", "/");

const previewConfig = {
  ...baseConfig,
  content: [
    `${root}app/**/*.{js,jsx}`,
    `${root}components/**/*.{js,jsx}`,
    `${root}preview/app/**/*.{js,jsx}`,
  ],
};

export default previewConfig;
