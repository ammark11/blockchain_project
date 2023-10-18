
import React from 'react'
import UploadButton from "../components/Button/UploadButton";
import Button from "../components/Button/Button";
import "../assets/generator.css";

const BlockGenerator = () => {
  function insertPublicKey() {}
  function sendTransaction() {}
  function generateBlock() {}
  return (
    <div className="blockGenerator">
      <div className="blockGenerator__container">
        <div>
          <UploadButton text={"UPLOAD BACKUP FILE"} />
        </div>
        <div className="blockGenerator__container_btns">
          <div>
            <Button text={"INSERT PUBLIC KEY"} onClick={insertPublicKey} />
          </div>
          <div>
            <Button text={"SEND TRANSACTION"} onClick={sendTransaction} />
          </div>
          <div>
            <Button text={"GENERATE BLOCK"} onClick={generateBlock} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default BlockGenerator;
