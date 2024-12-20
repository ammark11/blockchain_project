import React from 'react'
import Button from "../components/Button/Button";
import "../assets/generator.css";
import { Table } from "../components/Table";
import { useState } from "react";
import QRCode from 'qrcode';
import { QrReader } from 'react-qr-reader';

const Generator = () => {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  function generateKey() {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/generate_keys");
        const result = await response.json();
        if (result) {
          setPrivateKey(result.private_key);
          setPublicKey(result.public_key);
        }
      } catch (error) {
        console.error('Error generating keys:', error);
        alert('Failed to generate keys');
      }
    };
    fetchData();
  }

  function downloadPrivateKey() {
    const textToWrite = privateKey;
    const blob = new Blob([textToWrite], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'private_key.pem';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function downloadPublicKey() {
    const textToWrite = publicKey;
    const blob = new Blob([textToWrite], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'public_key.pem';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const downloadQRCode = async (data, filename) => {
    try {
      if (!data) {
        alert('Please generate keys first');
        return;
      }

      // Create QR code with optimized settings for large data
      const qrDataUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'L', // Lower error correction for more data capacity
        margin: 1,
        width: 800, // Larger size for better scanning
        scale: 4,
        type: 'image/png',
        quality: 0.92,
        rendererOpts: {
          quality: 0.92
        }
      });
      
      // Create and trigger download
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating QR code:', error);
      // More detailed error message
      alert(`Failed to generate QR code: The key might be too large for a single QR code. 
             Consider using only the public key QR code for sharing.`);
    }
  };

  // Add a function to split large data into chunks if needed
  const splitIntoChunks = (str, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
      chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Modified function to handle private key specifically
  const downloadPrivateKeyQR = async () => {
    try {
      if (!privateKey) {
        alert('Please generate keys first');
        return;
      }

      // For private key, we'll create a more secure version
      const qrDataUrl = await QRCode.toDataURL(privateKey, {
        errorCorrectionLevel: 'H', // Highest error correction for private key
        margin: 2,
        width: 1024, // Even larger for private key
        scale: 8,
        type: 'image/png',
        quality: 1.0,
        rendererOpts: {
          quality: 1.0
        }
      });

      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = 'private_key_qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating private key QR code:', error);
      alert('The private key is too large for a single QR code. Please use the file download option instead.');
    }
  };

  const handleScan = (data) => {
    if (data) {
      // Handle the scanned QR code data
      console.log('Scanned data:', data);
      setShowScanner(false);
      // You can add logic here to handle the scanned key
    }
  };

  const handleError = (err) => {
    console.error('QR Code scanning error:', err);
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
          <Button 
            text={"DOWNLOAD PUBLIC KEY QR"} 
            onClick={() => downloadQRCode(publicKey, 'public_key_qr')}
          />
          <Button 
            text={"DOWNLOAD PRIVATE KEY QR"} 
            onClick={downloadPrivateKeyQR}  // Use the specialized function for private key
          />
        </div>

        {showScanner && (
          <div className="qr-scanner-container">
            <QrReader
              delay={300}
              onError={handleError}
              onResult={handleScan}
              style={{ width: '100%' }}
              constraints={{
                facingMode: 'environment'
              }}
            />
            <Button text="Close Scanner" onClick={() => setShowScanner(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;