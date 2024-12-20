import React, { useEffect, useState } from 'react';
import { Table } from "../components/Table";
import '../assets/lists.css';
import QRScanner from '../components/QRScanner/QRScanner';
import { FiSearch, FiCamera } from 'react-icons/fi';

const Lists = () => {
  const [blocks, setBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [filteredBlocks, setFilteredBlocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/get_chain');
      const result = await response.json();
      if (result && result.chain) {
        setBlocks(result.chain);
        setFilteredBlocks(result.chain);
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
      const content = e.target.result.trim();
      setSearchTerm(content);
      handleSearch(content);
    };
    reader.readAsText(file);
  };

  const handleSearch = (term) => {
    if (!term) {
      setFilteredBlocks(blocks);
      return;
    }

    const filtered = blocks.filter(block =>
      block.transactions.some(transaction =>
        transaction.public_key.toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredBlocks(filtered);
  };

  const handleQRResult = (result) => {
    if (result) {
      setSearchTerm(result);
      handleSearch(result);
    }
  };

  return (
    <div className="lists">
      <div className="lists__search">
        <input
          type="text"
          placeholder="Search by public key..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <input
          type="file"
          onChange={handleFileUpload}
        />
        <button 
          className="qr-scan-button"
          onClick={() => setShowQRScanner(true)}
        >
          <FiCamera />
        </button>
        <button 
          className="search-button"
          onClick={() => handleSearch(searchTerm)}
        >
          <FiSearch />
        </button>
      </div>

      <Table 
        colNames={['INDEX', 'MINER', 'HASH', 'DATE AND TIME', 'transactions', 'previous_hash']} 
        data={filteredBlocks}
        type="block"
      />

      {showQRScanner && (
        <QRScanner
          onResult={handleQRResult}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
};

export default Lists;

