import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [nodeCount, setNodeCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [ipAddresses, setIpAddresses] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch node count from NodesDashboard endpoint
    axios.get('http://localhost:5000/get_nodes')
      .then(response => setNodeCount(response.data.nodes.length))
      .catch(error => console.error('Error fetching nodes:', error));

    // Fetch transaction count from lists endpoint
    axios.get("http://localhost:5000/get_chain")
      .then(response => {
        const transactions = response.data.chain.flatMap(block => block.transactions);
        setTransactionCount(transactions.length);
      })
      .catch(error => console.error('Error fetching transactions:', error));

    // Fetch IP address list from your source
    axios.get('http://localhost:5000/get_nodes') // Replace with your actual endpoint
      .then(response => setIpAddresses(response.data.nodes))
      .catch(error => console.error('Error fetching IP addresses:', error));
  }, []);

  useEffect(() => {
    // When the list of IP addresses changes, fetch country information for each IP
    if (ipAddresses.length === 0) return;

    setLoading(true);
    const countryDataPromises = ipAddresses.map(ip => {
      return axios.get(`http://ip-api.com/json/${ip}`)
        .then(response => ({ ip, country: response.data.country || 'Unknown' }))
        .catch(error => ({ ip, country: 'Error' }));
    });

    Promise.all(countryDataPromises)
      .then(countryData => {
        const countryDataMap = {};
        countryData.forEach(item => {
          countryDataMap[item.ip] = item.country;
        });
        setCountryInfo(countryDataMap);
      })
      .catch(error => console.error('Error fetching country information:', error))
      .finally(() => setLoading(false));
  }, [ipAddresses]);

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
      <div className="dashboard-item animated">
        <h2>IP Countries</h2>
        {loading ? (
          <p>Loading country information...</p>
        ) : (
          <ul>
            {Object.keys(countryInfo).map(ip => (
              <li key={ip}>
                IP: {ip}, Country: {countryInfo[ip]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
