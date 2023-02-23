// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// import { getFirestore } from "firebase/firestore";
// import { getFirestore, collection, addDoc } from "firebase/firestore";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { html, render } from "lit-html";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCp1Nbnqqcnal7h8JExUcH42n-CWiplQ4",
  authDomain: "fir-testing-38efb.firebaseapp.com",
  projectId: "fir-testing-38efb",
  storageBucket: "fir-testing-38efb.appspot.com",
  messagingSenderId: "595632217391",
  appId: "1:595632217391:web:04e00bee1dc7624460d5da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

let messages = [];
const messagesRef = collection(db, "messages");

try {
  const docRef = await addDoc(collection(db, "players"), {
    first: "Ada",
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}

async function sendMessage(message) {
  console.log("Sending a message!");
  // Add some data to the messages collection
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      time: Date.now(),
      content: message,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getAllMessages() {
  messages = [];

  const querySnapshot = await getDocs(
    query(messagesRef, orderBy("time", "desc"))
  );
  querySnapshot.forEach((doc) => {
    let msgData = doc.data();
    messages.push(msgData);
  });

  console.log(messages);
  render(view(), document.body);
}

getAllMessages();

function handleInput(e) {
  if (e.key == "Enter") {
    sendMessage(e.target.value);
    e.target.value = "";
  }
}

function view() {
  return html`<h1>my cool app</h1>
    <input type="text" @keydown=${handleInput} />
    <div id="messages-container">
      ${messages.map((msg) => html`<div class="message">${msg.content}</div>`)}
    </div>`;
}

onSnapshot(
  collection(db, "messages"),
  (snapshot) => {
    console.log("snap", snapshot);
    getAllMessages();
  },
  (error) => {
    console.error(error);
  }
);

render(view(), document.body);