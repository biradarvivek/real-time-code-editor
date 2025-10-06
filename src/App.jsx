import { useState } from "react";
import Home from "./component/Home";
import { Route, Routes } from "react-router-dom";
import EditorPage from "./component/EditorPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </>
  );
}

export default App;
