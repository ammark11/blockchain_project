import React from 'react'
import Button from "../components/Button/Button";
import "../assets/generator.css";
import { Table } from "../components/Table";
import { useState } from "react";

const Generator = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  function generateKey() {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/generate_keys");
      const result = await response.json();
      if (result) {
        setPrivateKey(result.private_key);
        setPublicKey(result.public_key);
      }
    };
    fetchData();
  }
  function downloadPrivateKey() {
    const textToWrite = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
    const blob = new Blob([textToWrite], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'private_key.csf';

    a.click();

    window.URL.revokeObjectURL(url);
  }
  function downloadPublicKey() {
    const textToWrite = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
    const blob = new Blob([textToWrite], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'public_key.csf';

    a.click();

    window.URL.revokeObjectURL(url);
  }
  return (
    <div className="generator">
      <div className="generator__button">
        <h1>RSA KEY GENERATOR</h1>
        <Button text={"Generate"} onClick={generateKey} />
      </div>
      <div className="generator__table">
        <Table
          colNames={["PUBLIC KEY", "PRIVATE KEY"]}
          data={[publicKey, privateKey]}
          type="key"
        />
        <div className="generator_buttons">
          <Button text={"DOWNLOAD PUBLIC KEY"} onClick={downloadPublicKey}/>
          <Button text={"DOWNLOAD PRIVATE KEY"} onClick={downloadPrivateKey}/>
        </div>
      </div>
    </div>
  );
};
export default Generator;
