import type { NextConfig } from "next";
const config: NextConfig = {
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
  outputFileTracingIncludes: {
    "/api/parse": [
      "./node_modules/@napi-rs/canvas*/**",
      "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
    ],
  },
  poweredByHeader: false,
};
export default config;
