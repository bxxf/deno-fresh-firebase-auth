/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import { Handlers } from "https://deno.land/x/fresh@1.0.1/server.ts";

import AuthIsland from "../islands/AuthIsland.tsx";

export const handler: Handlers<null> = {
  async GET(_, ctx) {
    const user: any = ctx.state.serverUser;
    return user ? ctx.render(user) : ctx.render();
  },
};

const styles = `
    body, html {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Inter, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue,Arial,Noto Sans,sans-serif;
    }`;

export default function Index({ data }: any) {
  return (
    <div
      class={tw`bg-gray-900 min-h-screen flex flex-col justify-center items-center`}
    >
      <h1 class={tw`text-white text-xl`}>Deno Firebase Auth Demo</h1>
      <AuthIsland serverUser={data}/>
      <style>{styles}</style>
    </div>
  );
}
