import admin from "firebase-admin";

function getAdminApp() {
  if (admin.apps.length) return admin.app();

  // În Firebase Hosting/Functions va folosi automat credențiale implicite.
  // Local, dacă nu ai credențiale setate, vom rezolva imediat (pasul următor).
  return admin.initializeApp();
}

export const adminApp = getAdminApp();
export const db = admin.firestore();
