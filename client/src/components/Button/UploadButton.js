import React from 'react'
import '../../assets/button.css'
const UploadButton = (props) => {
  const {text, action, id} = props;
  return (
    <div class='file file--upload'>
      <label for={id}>
        {text}
      </label>
      <input id={id} accept='.csf' type='file' onChange={(e) => action(e)}/>
    </div>
  );
};
export default UploadButton;