const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const fs = require("fs");
// const { resolve } = require("path");
// const admin = require("firebase-admin");
// const serviceAccount = require("../_config/serviceAccountKey.json");

// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDvV_4sdgXw9NUpdPXlSvMYvK8DaumAepI",
  authDomain: "ecommerce-486eb.firebaseapp.com",
  projectId: "ecommerce-486eb",
  storageBucket: "ecommerce-486eb.appspot.com",
  messagingSenderId: "224062592487",
  appId: "1:224062592487:web:e4a0c6ec40d7b4fed09942",
  measurementId: "G-WXWNW7N39D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const storage = getStorage(app);

exports.uploadFile = (file, destinationFolderName) => {
  return new Promise((resolve, reject) => {
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: file.mimetype,
    };

    const fileUpload = fs.readFileSync(file.path);

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(
      storage,
      destinationFolderName + "/" + file.filename
    );
    const uploadTask = uploadBytesResumable(storageRef, fileUpload, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
        reject(error);
      },
      () => {
        // Delete local file

        console.log("file.path: ", file.path);
        fs.unlink(file.path, (err) => {
          if (err) console.log(err);
          else {
            console.log(`\nDeleted file: ${file.path}`);
          }
        });

        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
};
