import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NodesDashboard = () => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await axios.get('http://139.162.41.68:5000//get_nodes');
                setNodes(response.data.nodes);
            } catch (error) {
                console.error('Error fetching nodes.');
            }
        };

        fetchNodes();
    }, []);

    return (
        <div>
            <h2>Registered Nodes</h2>
            <ul>
                {nodes.map((node, index) => (
                    <li key={index}>{node}</li>
                ))}
            </ul>
        </div>
    );
};

export default NodesDashboard;
