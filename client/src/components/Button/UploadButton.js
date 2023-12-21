import React from 'react'
import '../../assets/button.css'
const UploadButton = ({ text, action, id }) => {
  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const fileContent = e.target.result;
              action(fileContent);  // Pass file content to action
          };
          reader.readAsText(file);
      }
  };
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