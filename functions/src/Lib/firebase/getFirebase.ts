import admin = require('firebase-admin');
import serviceAccount from "../../../service_account_key.json";

// Initialize the Firebase Admin SDK with the service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// Initialize Firestore
const db = admin.firestore();

// Export admin and db using ES6 module syntax
export { admin, db };

