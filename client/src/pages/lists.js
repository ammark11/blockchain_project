import React, { useEffect, useState } from 'react';
import { Table } from "../components/Table";
import '../assets/lists.css';

const Lists = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/get_chain");
      const result = await response.json();
      if (result) setBlocks(result.chain);
    }
    fetchData();
  }, []);

  return (
    <div className="lists">
      <div className="lists__search"></div>
      <div className="lists__table">
        <Table 
          colNames={['INDEX', 'MINER', 'HASH', 'DATE AND TIME', 'NUMBER OF TRANSACTIONS', 'NONCE', 'SENDER', 'RECIPIENT']} 
          data={blocks} 
          type="block"
        />
      </div>
    </div>
  );
};

export default Lists;
