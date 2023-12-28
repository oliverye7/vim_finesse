import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Play from "./pages/Play.tsx";
import Profile from "./pages/Profile.tsx";
import Tutorial from "./pages/Tutorial.tsx";
import About from "./pages/About.tsx";
import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/tutorial" element={<Tutorial />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/play" element={<Play />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
