import { useEffect, useState } from "preact/hooks";
import { firebaseConfig } from "../firebase/config.ts";
import { getApps, initializeApp } from "firebase";
import { getAuth, onAuthStateChanged, signOut as logOut } from "firebase/auth";

export const useFirebase = () => {
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (getApps().length < 1) setFirebaseApp(initializeApp(firebaseConfig));
    setAuth(getAuth());
  });

  useEffect(() => {
    if (auth) {
      onAuthStateChanged(auth, async (user: any) => {
        setInitialized(true);
        setUser(user);
        if (!user) return;
        document.cookie = `idToken=${await user.getIdToken()};max-age=604800`;
      });
    }
  });

  const signOut = async () => {
    logOut(auth);
    document.cookie = `idToken="";expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  };
  return { firebaseApp, auth, user, signOut, initialized };
};
