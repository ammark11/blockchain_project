import React, { useEffect, useState } from "react";
import UploadButton from "../components/Button/UploadButton";
import Button from "../components/Button/Button";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import { Html5QrcodeScanner } from "html5-qrcode";


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
      console.log(event.target.result);
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
        "http://localhost:5000/add_transaction",
        formData
      );
      console.log("Transaction sent:", response.data);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  const generateBlock = async () => {
    try {
      const response = await axios.get("http://localhost:5000/mine_block");
      console.log("New block generated:", response.data);
    } catch (error) {
      console.error("Error generating block:", error);
    }
  };

  const startScanning = () => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    const config = { fps: 10, qrbox: { width: 300, height: 300 } };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText, decodedResult) => {
        // Use decodedText as the public key
        console.log(`Decoded text: ${decodedText}`);
        setPublicKey(decodedText); // Set the scanned public key as the state
        html5QrCode.stop().then(() => {
          console.log("QR Scanning stopped.");
        }).catch(err => {
          console.error("Failed to stop QR scanner", err);
        });
      }
    ).catch(err => {
      // Start failed, handle it
      console.error("Failed to start QR scanner", err);
    });
  };

    useEffect(() => {
      const config = { fps: 10, qrbox: 250 };
      const html5QrcodeScanner = new Html5QrcodeScanner("qr-code-full-region", config,  false);

      const onScanSuccess = (decodedText, decodedResult) => {
        setPublicKey(decodedText);;
        console.log(`Scan result ${decodedText}`, decodedResult);
      };

      html5QrcodeScanner.render(onScanSuccess);
      // Cleanup on component unmount
      return () => html5QrcodeScanner.clear();
    }, []);


    const clearMessages = () => setPublicKey([]);


  return (

    <center>

    <div id="app">

          <div id="qr-code-full-region"></div>

</div>



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
        <br></br>
                    <label htmlFor="Public Key">Recever Public Key</label>
                            <br></br>
        <UploadButton
          text={"Upload public key"}
          action={(e) => handlePublicKeyUpload(e)}
          id="input-file2"
        />
        {publicKey.length > 0 && (
          <p className="message">Public key has successfully been uploaded</p>
        )}
                <br></br>

        <button id="start-scan" onClick={startScanning}>Scan QR Code Public Key</button>


        <div id="qr-reader"></div>


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
