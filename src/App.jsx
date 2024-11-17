import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateNewList from "./pages/CreateNewList.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/active" element={<CreateNewList />} />
        <Route path="/shared" />
      </Routes>
    </Router>
  );
}

export default App;
