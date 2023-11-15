import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import your CSS file for styling

const Dashboard = () => {
    const [nodeCount, setNodeCount] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);

    useEffect(() => {
        // Fetch node count
        axios.get('/api/nodes/count')
            .then(response => setNodeCount(response.data.count))
            .catch(error => console.error('Error fetching node count:', error));

        // Fetch transaction count
        axios.get('/api/transactions/count')
            .then(response => setTransactionCount(response.data.count))
            .catch(error => console.error('Error fetching transaction count:', error));
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-item animated">
                <h2>Registered Nodes</h2>
                <p className="count">{nodeCount}</p>
            </div>
            <div className="dashboard-item animated">
                <h2>Transactions Occurred</h2>
                <p className="count">{transactionCount}</p>
            </div>
            {/* Add more dashboard items as needed */}
        </div>
    );
};

export default Dashboard;
