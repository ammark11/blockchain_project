import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UploadButton from "../components/Button/UploadButton";
import "../assets/table.css";
import axios from "axios";

const TransactionDetails = () => {
  const [transaction, setTransaction] = useState({});
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

  const handleFileUpload = (
    event,
    index,
    transaction_index,
    encrypted_data
  ) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      // The file's text will be printed here
      console.log(event.target.result);
      // setFile(event.target.result);
      const formData = new FormData();
      formData.append("private_file", event.target.result);
      formData.append("encrypted_data", encrypted_data);
      formData.append("index", index);
      formData.append("transaction_index", transaction_index);

      const response = axios
        .post("http://127.0.0.1:5000/get_decrypted_data", formData)
        .then(() => {
          fetchData();
        });
    };
    reader.readAsText(file);
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
      <div style={{ marginTop: 30 }}></div>
      <div className="table">
        <div className="head">
          <div>Transaction #</div>
          <div>Public Key</div>
          <div>Encrypted file data</div>
          <div>additional info</div>
          <div></div>
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
                <p>{item.add_info}</p>
              </div>
              <UploadButton
                text={"Decrypt"}
                action={(e) =>
                  handleFileUpload(e, transaction.index, i, item.encrypted_file)
                }
                id="input-file1"
              ></UploadButton>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;
