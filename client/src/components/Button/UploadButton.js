import React from 'react'
import '../../assets/button.css'
const UploadButton = (props) => {
  const {text, action, id} = props;
  return (
    <div className='file file--upload'>
      <label htmlFor={id}>
        {text}
      </label>
      <input id={id} accept='*' type='file' onChange={(e) => action(e)}/>
    </div>
  );
};
export default UploadButton;