import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import './QRScanner.css';

const QRScanner = ({ onResult, onClose }) => {
  const [error, setError] = useState(null);

  const handleScan = (result) => {
    if (result) {
      onResult(result?.text);
      onClose();
    }
  };

  const handleError = (err) => {
    setError('Error accessing camera: ' + err.message);
  };

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-modal">
        <div className="qr-scanner-header">
          <h3>Scan QR Code</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="qr-scanner-content">
          <QrReader
            constraints={{
              facingMode: 'environment'
            }}
            onResult={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
          />
          {error && <div className="qr-scanner-error">{error}</div>}
        </div>
        <div className="qr-scanner-footer">
          <p>Position the QR code within the frame</p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner; 