import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: "AIzaSyDKomPdegFMDuvgJNYsPAzMtYtSRVzXWgM",
  authDomain: "fanspacelogin.firebaseapp.com",
  projectId: "fanspacelogin"
};

export default getAuth(initializeApp(config));
