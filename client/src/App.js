import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainHeader from "./components/Header/MainHeader";
import Header from "./components/Header/Header";
import Main from "./pages/main";
import Lists from '../src/pages/lists';
import Generator from "./pages/rsa-generator";
import BlockGenerator from "./pages/block-generate";
import TransactionDetails from "./pages/transactionDetails";
import NodeRegistration from './NodeRegistration';
import NodesDashboard from './NodesDashboard';
import Dashboard from './pages/Dashboard'; 
import UpdateTransaction from './UpdateTransaction';

function App() {
  return (
    <BrowserRouter>
      <div className="main">
        <Routes>
          <Route path="/register-node" element={<NodeRegistration />} />
          <Route path="/nodes-dashboard" element={<NodesDashboard />} />
          <Route path="/" element={[<MainHeader />, <Main />]} />
          <Route path="/lists" element={[<Header/>, <Lists />]} />
          <Route path="/generator" element={[<Header />, <Generator />]} />
          <Route path="/block-generate" element={[<Header />, <BlockGenerator />]} />
          <Route path="/transaction-detail/:index" element={[<MainHeader />, <TransactionDetails />]} />
          <Route path="/update-transaction" element={<UpdateTransaction />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
