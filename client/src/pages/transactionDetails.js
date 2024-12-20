import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UploadButton from "../components/Button/UploadButton";
import "../assets/table.css";
import axios from "axios";
import { isAuthenticated } from '../utils/auth';

const TransactionDetails = () => {
  const [transaction, setTransaction] = useState({});
  const [decryptedData, setDecryptedData] = useState({});
  const [currentPrivateKey, setCurrentPrivateKey] = useState(null);
  const { index } = useParams();
  const [columns] = useState([
    "INDEX",
    "MINER",
    "HASH",
    "DATE AND TIME",
    "TEST",
  ]);

  const fetchData = async () => {
    const response = await fetch("http://localhost:5000/get_chain");
    const result = await response.json();
    if (result)
      setTransaction(
        result.chain.filter((item) => item.index === index * 1)[0]
      );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogin = async (privateKey) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        private_key: privateKey
      });
      
      localStorage.setItem('jwt_token', response.data.token);
      setCurrentPrivateKey(privateKey);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleFileUpload = async (event, blockIndex, transaction_index, encrypted_data) => {
    try {
      var file = event.target.files[0];
      var reader = new FileReader();
      
      reader.onload = async function (event) {
        try {
          let privateKey = event.target.result;
          
          if (!currentPrivateKey) {
            const loginSuccess = await handleLogin(privateKey);
            if (!loginSuccess) {
              alert('Invalid private key');
              return;
            }
          } else if (privateKey !== currentPrivateKey) {
            alert('Please use the same private key that you logged in with');
            return;
          }

          const formData = new FormData();
          formData.append("private_file", privateKey);
          formData.append("encrypted_data", encrypted_data);
          formData.append("index", blockIndex - 1);
          formData.append("transaction_index", transaction_index);

          const token = localStorage.getItem('jwt_token');
          const response = await axios.post(
            "http://localhost:5000/get_decrypted_data", 
            formData,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );

          setDecryptedData(prev => ({
            ...prev,
            [transaction_index]: response.data
          }));

        } catch (error) {
          console.error('Decryption error:', error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            alert('Unauthorized to decrypt this data');
          } else {
            alert('Decryption failed');
          }
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('File reading error:', error);
      alert('Error reading private key file');
    }
  };

  return (
    <>
      <div className="table">
        <div className="head">
          {columns.map((el) => (
            <div key={el}>{el}</div>
          ))}
        </div>
        <div className="body">
          <div className="row">
            <div>
              <p>{transaction.index}</p>
            </div>
            <div>
              <p>{transaction.miner}</p>
            </div>
            <div>
              <p>{transaction.hash}</p>
            </div>
            <div>
              <p>{transaction.timestamp}</p>
            </div>
            <div>Hello WORLD</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 50 }}></div>
      <div className="table">
        <div className="head">
          <div>Transaction #</div>
          <div>Public Key</div>
          <div>Encrypted file data</div>
          <div>File Data</div>
          <div>Amount</div>
          <div>additional info</div>
          <div>decryption</div>
        </div>
        <div className="body">
          {transaction.transactions?.map((item, i) => (
            <div key={i} className="row">
              <div>
                <p>{i + 1}</p>
              </div>
              <div>
                <p>{item.public_key}</p>
              </div>
              <div>
                <p>{item.encrypted_file}</p>
              </div>
              <div>
                {decryptedData[i] ? (
                  <p>{decryptedData[i]}</p>
                ) : (
                  <p>Not decrypted</p>
                )}
              </div>
              <div>
                <p>{item.amount}</p>
              </div>
              <div>
                <p>{item.add_info}</p>
              </div>
              <div>
                <UploadButton
                  text={"Decrypt"}
                  action={(e) =>
                    handleFileUpload(e, transaction.index, i, item.file_data)
                  }
                  id={`decrypt-button-${i}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;
