

import React, { useEffect, useState } from 'react';
import { Table } from "../components/Table";
import '../assets/lists.css';
const Lists = () => {
  const [blocks, setBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://139.162.41.68:5000/get_chain');
      const result = await response.json();
      if (result && result.chain) {
        setBlocks(result.chain);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setSearchTerm(e.target.result.trim());
    };
    reader.readAsText(file);
  };

  const filteredBlocks = blocks.filter(block =>
    block.transactions.some(transaction =>
      transaction.public_key.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="lists">
      <div className="lists__search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <input
          type="file"
          onChange={handleFileUpload}
        />
      </div>
      <div>

        <Table 
                  colNames={['INDEX', 'MINER', 'HASH', 'DATE AND TIME',  'transactions', 'previous_hash']} 
                  data={blocks} 
          type="block"
        />
      </div>
	  <Table 
  colNames={['INDEX', 'MINER', 'HASH', 'DATE AND TIME',  'transactions', 'previous_hash']} 
  data={filteredBlocks} // Pass filteredBlocks here
  type="block"
/>

    </div>
  );
};

export default Lists;

