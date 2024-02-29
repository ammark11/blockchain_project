import React from 'react'
import Button from "../components/Button/Button";
import "../assets/generator.css";
import { Table } from "../components/Table";
import { useState } from "react";
import QRCode from 'qrcode';

const Generator = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  function generateKey() {
    const fetchData = async () => {
      const response = await fetch("http://139.162.41.68:5000/generate_keys");
      const result = await response.json();
      if (result) {
        setPrivateKey(result.private_key);
        setPublicKey(result.public_key);
      }
    };
    fetchData();
  }
  function downloadPrivateKey() {
    const textToWrite = `${privateKey}`;
    const blob = new Blob([textToWrite], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'private_key.csf';

    a.click();

    window.URL.revokeObjectURL(url);
  }
  function downloadPublicKey() {
    const textToWrite = `${publicKey}`;
    const blob = new Blob([textToWrite], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'public_key.csf';

    a.click();

    window.URL.revokeObjectURL(url);
  }

  // Function to generate and download QR code
   const generateAndDownloadQR = (data, filename) => {
     QRCode.toDataURL(data, { errorCorrectionLevel: 'H' })
       .then(url => {
         const downloadLink = document.createElement('a');
         downloadLink.href = url;
         downloadLink.download = `${filename}.png`;
         document.body.appendChild(downloadLink);
         downloadLink.click();
         document.body.removeChild(downloadLink);
       })
       .catch(error => {
         console.error('Error generating QR code: ', error);
       });
   };
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
    <button onClick={() => generateAndDownloadQR(publicKey, 'publicKeyQR')}>Download Public Key QR Code</button>
    <button onClick={() => generateAndDownloadQR(privateKey, 'privateKeyQR')}>Download Private Key QR Code</button>

        </div>



      </div>
    </div>
  );
};
export default Generator;
