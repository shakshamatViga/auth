import React from "react";
import "./App.css";
import { auth } from "./lib/auth";

function App() {
  auth("MOVIECOLAB")
    .then((value) => {
      console.log(value);
    })
    .catch((err) => {
      console.log(err);
    });
  return (
    <div className="App">
      <h1>This is test Two</h1>
    </div>
  );
}

export default App;
