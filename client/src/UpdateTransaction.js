import React, { useState } from 'react';
import axios from 'axios';

const UpdateTransaction = () => {
    const [transactionData, setTransactionData] = useState({
        // Add relevant transaction fields here
        transactionId: '',
        newData: ''
    });

    const handleChange = (e) => {
        setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/update_transaction', transactionData);
            console.log(response.data);
            // Handle response
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Transaction ID:
                    <input type="text" name="transactionId" value={transactionData.transactionNumber} onChange={handleChange} />
                </label>
                <label>
                    New Data:
                    <input type="text" name="newData" value={transactionData.newData} onChange={handleChange} />
                </label>
                <button type="submit">Update Transaction</button>
            </form>
        </div>
    );
};

export default UpdateTransaction;
