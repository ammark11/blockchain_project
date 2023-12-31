import React, { useEffect, useState } from "react";
import UploadButton from "../components/Button/UploadButton";
import Button from "../components/Button/Button";
import axios from "axios";
// import { Table } from '../components/Table';
import "../assets/main.css";
const Main = () => {
  const [publicKey, setPublicKey] = useState({});
  const [file, setFile] = useState({});
  const [senderAddress, setSenderAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionData, setTransactionData] = useState({
    transactionNumber: 0,
    additionalInfo: "",
  });
  const handleFileUpload = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here
      console.log(event.target.result);
      setFile(event.target.result);
    };
    reader.readAsText(file);
  };
  const handlePublicKeyUpload = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here      console.log(event.target.result);
      setPublicKey(event.target.result);
    };

    reader.readAsText(file);
  };
  
  const handlePrivateKeyUpload = (event) => {
    const uploadedPublicKey = event.target.files[0];
    setPublicKey(uploadedPublicKey);
  };
  const sendTransaction = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("transactionNumber", transactionData.transactionNumber);
    formData.append("add_info", "Test");
    formData.append("file", file);
    formData.append("public_key", publicKey);
    formData.append("sender", senderAddress);
    formData.append("amount", amount);
    formData.append("recipient", publicKey);
    try {
      const response = await axios.post(
        "http://139.162.41.68:5000/add_transaction",
        formData
      );
      console.log("Transaction sent:", response.data);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };
  const generateBlock = async () => {
    try {
      const response = await axios.get("http://139.162.41.68:5000/mine_block");
      console.log("New block generated:", response.data);
    } catch (error) {
      console.error("Error generating block:", error);
    }
  };


  
  return (
   
    <center>
                   <br></br><br></br><br></br>
            <br></br>
    <div className="form-container">
      
      <br></br>
      <h2>Blockchain Transaction</h2>
      <br></br>
        <UploadButton
          text={"IMPORT A FILE"}
          action={(e) => handleFileUpload(e)}
          id="input-file1"
        />
        {file.length > 0 && (
          <p className="message">File has successfully been uploaded</p>
        )}
        <UploadButton
          text={"Upload public key"}
          action={(e) => handlePublicKeyUpload(e)}
          id="input-file2"
        />
        {publicKey.length > 0 && (
          <p className="message">Public key has successfully been uploaded</p>
        )}
        <br></br>
            <label htmlFor="senderAddress">Sender Address</label>
            <br></br>
            <br></br>
        <input
          type="text"
          placeholder="Sender Address"
          value={senderAddress}
          onChange={(e) => setSenderAddress(e.target.value)}
          required
        />
                <br></br>
            <label htmlFor="senderAddress">Amount</label>
            <br></br>
            <br></br>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        /><br></br>
                  <br></br>
        <Button text={"Send transaction"} onClick={(e) => sendTransaction(e)} />        
        <Button
          text={"Generate block"}
          onClick={(e) => generateBlock(e)}
        />
      </div>
 


    </center>
  );
};
export default Main;

