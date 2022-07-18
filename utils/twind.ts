import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
export * from "twind";
export const config: Configuration = {
  preflight: false,
  mode: "silent",
};
if (IS_BROWSER) setup(config);
