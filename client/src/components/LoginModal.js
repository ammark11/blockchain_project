import React, { useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';
import '../assets/modal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        setLoading(true);
        setError('');
        const privateKey = e.target.result;
        await handleLogin(privateKey);
      } catch (error) {
        setError('Invalid private key');
      } finally {
        setLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  const handleLogin = async (privateKey) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        private_key: privateKey
      });
      
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('private_key', privateKey);
      onClose();
      window.location.reload(); // Refresh to update UI
    } catch (error) {
      setError('Login failed: Invalid private key');
    }
  };

  const startScanner = () => {
    setShowScanner(true);
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } }
    );

    html5QrcodeScanner.render(async (decodedText) => {
      html5QrcodeScanner.clear();
      setShowScanner(false);
      await handleLogin(decodedText);
    }, (error) => {
      console.warn(`QR Code scanning failed: ${error}`);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Login with Private Key</h2>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          
          <div className="upload-section">
            <input
              type="file"
              id="private-key-file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button 
              onClick={() => document.getElementById('private-key-file').click()}
              disabled={loading}
              className="upload-button"
            >
              Upload Private Key File
            </button>
          </div>

          <div className="divider">OR</div>

          <div className="scan-section">
            <button 
              onClick={startScanner}
              disabled={loading}
              className="scan-button"
            >
              Scan QR Code
            </button>
          </div>

          {showScanner && (
            <div id="qr-reader"></div>
          )}
        </div>
        
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginModal; 