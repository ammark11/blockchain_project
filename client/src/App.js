import React from 'react'
import ReactDOM from 'react-dom'
import MainHeader from "./components/Header/MainHeader";
import Header from "./components/Header/Header";
import Main from "./pages/main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lists from '../src/pages/lists'
import Generator from "./pages/rsa-generator";
import BlockGenerator from "./pages/block-generate";
function App() {
  return (
    <BrowserRouter>
      <div className="main">
        <Routes >
          <Route path="" element={[<MainHeader />, <Main />]}/> 
          <Route path="/lists" element={[<Header/>, <Lists />]} />
          <Route path="/generator" element={[<Header />, <Generator />]} />
          <Route path="/block-generate" element={[<Header />, <BlockGenerator />]} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;