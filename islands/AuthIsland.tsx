/** @jsx h */
import { h, Fragment } from "preact";
import { useMemo } from "preact/hooks";
import { tw } from "@twind";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useFirebase } from "../composables/firebase.ts";
import type { ServerUser } from "../models/server-user.ts";

export default function AuthIsland({ serverUser }: { serverUser: ServerUser }) {
  const { auth, signOut, initialized } = useFirebase();
  const { user: clientUser } = useFirebase();
  const user = useMemo(
    () => clientUser || (!initialized ? serverUser : null),
    [clientUser, serverUser]
  );
  const provider = new GoogleAuthProvider();
  return (
    <Fragment>
      {user ? (
        <button
          class={tw`bg-blue-400 text-white border-none text-lg rounded-md text-center py-1 px-3 cursor-pointer hover:bg-blue-500 transition-colors`}
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      ) : (
        <button
          class={tw`bg-blue-400 text-white  border-none text-lg rounded-md text-center py-1 px-3 cursor-pointer hover:bg-blue-500 transition-colors`}
          onClick={() => {
            signInWithPopup(auth, provider);
          }}
        >
          Sign In With Google
        </button>
      )}
      <div class={tw`text-white text-lg mt-2`}>
        {user?.email ? "You are currently logged in as " + user?.email : ""}
      </div>
    </Fragment>
  );
}
