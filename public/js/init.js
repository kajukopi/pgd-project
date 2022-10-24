import "./firebase-app-compat.js";
import "./firebase-auth-compat.js";
import "./firebase-database-compat.js";
import "./firebase-storage-compat.js";

const firebaseConfig = {
  projectId: "project-pgd",
  databaseURL: "https://project-pgd-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "project-pgd.appspot.com",
  locationId: "asia-southeast2",
  apiKey: "AIzaSyBvaU3awsXCNsbm7Q0-INMxyUKurCA203Y",
  authDomain: "project-pgd.firebaseapp.com",
  messagingSenderId: "790032835142",
};

firebase.initializeApp(firebaseConfig);

// const hitung = (a, b) => {
//   return a + b;
// };

window.hitung = (a, b) => {
  return a + b;
};


