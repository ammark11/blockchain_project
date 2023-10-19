import React from "react";
import "../assets/table.css";
export const Row = (props) => {
  const { el, type } = props;
  return (
    <>
      {type == "block" && (
        <div className="row">
          <div><p>{el.index}</p></div>
          <div></div>
          <div><p>{el.hash}</p></div>
          <div><p>{el.timestamp}</p></div>
          <div><p>{JSON.stringify(el.transactions)}</p></div>
          <div><p>{el.previous_hash}</p></div>
        </div>
      )}
      {type=='key' && (
        <div className='row'>
          {/* <div>{el[0]}</div>
          <div>{el[1]}</div> */}
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
          <div>{el}</div>
        ))}
      </div>
      <div className="body">
        {type == "block" &&
          data?.map((el) => <Row key={el.index} el={el} type="block"/>)}
        {type == "key" && data?.map((el, ind) => <Row key={ind} el={el} type="key"/>)}
      </div>
    </div>
  );
}
