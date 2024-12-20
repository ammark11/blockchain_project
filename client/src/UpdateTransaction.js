import React, { useState } from 'react';
import axios from 'axios';

const UpdateTransaction = () => {
    const [transactionData, setTransactionData] = useState({
        // Add relevant transaction fields here
        transactionId: '',
        newData: '',
        amount: '',
    });

    const handleChange = (e) => {
        setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/update_transaction', transactionData);
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
                    <input type="text" name="transactionId" value={transactionData.hash} onChange={handleChange} />
                </label>
                <label>
                    New Data:
                    <input type="text" name="newData" value={transactionData.newData} onChange={handleChange} />
                </label>
                <label>
                     amount:
                    <input type="text" name="amount" value={transactionData.amount} onChange={handleChange} />
                </label>
                <button type="submit">Update Transaction</button>
            </form>
        </div>
    );
};

export default UpdateTransaction;
