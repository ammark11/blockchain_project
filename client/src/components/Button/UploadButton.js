import React from 'react'
import '../../assets/button.css'
const UploadButton = (props) => {
  const {text} = props;
  return (
    <div class='file file--upload'>
      <label for='input-file'>
        {text}
      </label>
      <input id='input-file' type='file' />
    </div>
  );
};
export default UploadButton;