import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/table.css";

export const Row = (props) => {
  const { el, type } = props;
  const navigate = useNavigate();

  function navigateTransaction(index) {
    console.log(index);
    navigate(`/transaction-detail/${index}`, {state: {index}});
  }

  return (
    <>
      {type === "block" && (
        <div className="row">
          <div><p>{el.index}</p></div>
          <div><p>{el.miner}</p></div>
          <div><p>{el.hash}</p></div>
          <div><p>{el.timestamp}</p></div>
          <div>
            {el.transactions.map((transaction, i) => (
              <div key={i} onClick={() => navigateTransaction(el.index)}>
                <p>Transaction ID: {transaction.index}</p>
                <p>Sender: {transaction.sender}</p>
                <p>Recipient: {transaction.recipient}</p>
                {/* Add more transaction details here */}
              </div>
            ))}
          </div>
          <div><p>{el.previous_hash}</p></div>
        </div>
      )}
      {type === "key" && (
        <div className="row">
          <div>{el}</div>
        </div>
      )}
    </>
  );
};

export function Table(props) {
  const { colNames, data, type } = props;
  return (
    <div className="table">
      <div className="head">
        {colNames.map((el) => (
          <div key={el}>{el}</div>
        ))}
      </div>
      <div className="body">
        {type === "block" &&
          data?.map((el) => <Row key={el.index} el={el} type="block" />)}
        {type === "key" &&
          data?.map((el, ind) => <Row key={ind} el={el} type="key" />)}
      </div>
    </div>
  );
}
