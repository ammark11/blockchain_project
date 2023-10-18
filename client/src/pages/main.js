import React, { useState } from 'react';
import UploadButton from '../components/Button/UploadButton';
import axios from 'axios';

// import { Table } from '../components/Table';

import '../assets/main.css'
const Main =() => {
    const [publicKey, setPublicKey] = useState([]);
    const [file, setFile] = useState([]);
    const [transactionData, setTransactionData] = useState({
        transactionNumber: 0,
        additionalInfo: '',
    });
    const handleFileUpload = (event)=>{
        const uploadFile = event.target.files[0];
        setFile(uploadFile);
 
    }
    const handlePublicKeyUpload = (event)=>{
        const uploadedPublicKey = event.target.files[0];
        setPublicKey(uploadedPublicKey);

    }
    const handlePrivateKeyUpload = (event)=>{
        const uploadedPublicKey = event.target.files[0];
        setPublicKey(uploadedPublicKey);

    }
    const sendTransaction = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('publicKey', publicKey);
        formData.append('transactionNumber', transactionData.transactionNumber);
        formData.append('additionalInfo', transactionData.additionalInfo);
    
        try {
            const response = await axios.post('http://localhost:5000/add_transaction', formData);
            console.log('Transaction sent:', response.data);
        } catch (error) {
            console.error('Error sending transaction:', error);
        }
    };
    const generateBlock = async () => {
        try {
            const response = await axios.get('http://localhost:5000/mine_block');
            console.log('New block generated:', response.data);
        } catch (error) {
            console.error('Error generating block:', error);
        }
    };
    


    return(
        <div className="main">
             <div className='main__block1'>
                {/* <p>Lorem ipsum dolor sit amet consectetur</p> */}
                <UploadButton text={'IMPORT A FILE'} onClick={handleFileUpload}/>
                <UploadButton text={'Upload public key'} onClick={handlePublicKeyUpload}/>
                <UploadButton text={'Send transaction'} onClick={sendTransaction}/>
                <UploadButton text={'Generate block'} onClick={generateBlock}/>


             </div>
             
        </div>
    )
}
export default Main;