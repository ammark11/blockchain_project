import React from 'react'
import UploadButton from "../components/Button/UploadButton";
import Button from "../components/Button/Button";
import "../assets/generator.css";
import axios from 'axios';

const Generator = () => {
  const generateKeys = async () => {
    try {
      const response = await axios.get('http://localhost:5000/generate_keys');
      
      // Download private key
      const privateElement = document.createElement('a');
      const privateFile = new Blob([response.data.private_key], { type: 'text/plain' });
      privateElement.href = URL.createObjectURL(privateFile);
      privateElement.download = 'private_key.pem';  // Changed extension to .pem
      document.body.appendChild(privateElement);
      privateElement.click();
      document.body.removeChild(privateElement);

      // Download public key
      const publicElement = document.createElement('a');
      const publicFile = new Blob([response.data.public_key], { type: 'text/plain' });
      publicElement.href = URL.createObjectURL(publicFile);
      publicElement.download = 'public_key.pem';  // Changed extension to .pem
      document.body.appendChild(publicElement);
      publicElement.click();
      document.body.removeChild(publicElement);

    } catch (error) {
      console.error('Error generating keys:', error);
      alert('Failed to generate keys');
    }
  };

  return (
    <div className="generator">
      <div className="generator_buttons">
        <Button text={"GENERATE KEYS"} onClick={generateKeys} />
      </div>
    </div>
  );
};

export default Generator; 