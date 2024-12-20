import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiUsers, FiDatabase, FiActivity, FiCpu, FiHardDrive } from 'react-icons/fi';
import StatCard from '../components/StatCard';
import MetricCard from '../components/MetricCard';
import ErrorBoundary from '../components/ErrorBoundary';
import MapWrapper from '../components/MapWrapper';
import Header from '../components/Header/Header';
import './Dashboard.css'; // Ensure this path is correct based on your project structure

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Chart Data
const transactionData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Transactions',
    data: [12, 19, 3, 5, 2, 3],
    borderColor: '#b341f9',
    backgroundColor: 'rgba(179, 65, 249, 0.1)',
    tension: 0.4,
    pointBackgroundColor: '#b341f9',
    pointBorderColor: '#fff',
    pointHoverRadius: 6,
    pointRadius: 4,
  }]
};

const networkLoadData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Network Load',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: '#b341f9',
    borderRadius: 5,
  }]
};

const resourceData = {
  labels: ['CPU', 'Memory', 'Storage'],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: ['#b341f9', '#9c27b0', '#7b1fa2'],
    hoverOffset: 10,
  }]
};

// Chart configurations
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { 
        color: '#fff',
        font: {
          family: 'Orbitron, sans-serif',
          size: 12,
          weight: '500',
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      titleFont: {
        family: 'Orbitron, sans-serif',
      },
      bodyFont: {
        family: 'Orbitron, sans-serif',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(179, 65, 249, 0.1)',
        borderColor: 'rgba(179, 65, 249, 0.1)'
      },
      ticks: { 
        color: '#fff',
        font: {
          family: 'Orbitron, sans-serif',
          size: 12,
        }
      }
    },
    x: {
      grid: {
        color: 'rgba(179, 65, 249, 0.1)',
        borderColor: 'rgba(179, 65, 249, 0.1)'
      },
      ticks: { 
        color: '#fff',
        font: {
          family: 'Orbitron, sans-serif',
          size: 12,
        }
      }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { 
        color: '#fff',
        font: {
          family: 'Orbitron, sans-serif',
          size: 12,
          weight: '500',
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      titleFont: {
        family: 'Orbitron, sans-serif',
      },
      bodyFont: {
        family: 'Orbitron, sans-serif',
      },
    },
  }
};

function Dashboard() {
  const [nodeCount, setNodeCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [ipAddresses, setIpAddresses] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [networkStats, setNetworkStats] = useState({
    blockTime: 0,
    tps: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    activeNodes: 0,
    totalTransactions: 0
  });

  const [nodeLocations, setNodeLocations] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Fetch node count from NodesDashboard endpoint
    axios.get('http://localhost:5000/get_nodes')
      .then(response => {
        setNodeCount(response.data.nodes.length);
        setNodeLocations(response.data.nodes.map(node => node.location)); // Assuming each node has a 'location' property
      })
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
      .then(response => setIpAddresses(response.data.nodes.map(node => node.ip))) // Assuming each node has an 'ip' property
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
    <>
      <Header />
      <div className="dashboard-container">
        {/* Stats Section */}
        <section className="dashboard-section dashboard-stats-section">
          <div className="dashboard-section-title">
            <h2>Network Overview</h2>
          </div>
          <div className="dashboard-stats-grid">
            <StatCard
              icon={<FiUsers />}
              title="Active Nodes"
              value={nodeCount}
              change="+12.5%"
            />
            <StatCard
              icon={<FiDatabase />}
              title="Total Transactions"
              value={transactionCount}
              change="+8.3%"
            />
            <StatCard
              icon={<FiActivity />}
              title="Network Health"
              value="99.9%"
              status="optimal"
            />
            <StatCard
              icon={<FiCpu />}
              title="Average Block Time"
              value="2.3s"
              change="-0.2s"
            />
          </div>
        </section>

        {/* Map Section */}
        <section className="dashboard-section dashboard-map-section">
          <div className="dashboard-section-title">
            <h2>Global Node Distribution</h2>
          </div>
          <div className="dashboard-map-container">
            <ErrorBoundary fallback={<div className="dashboard-map-error">Error loading map</div>}>
              <MapWrapper 
                nodeLocations={nodeLocations}
                center={[20, 0]}
                zoom={2}
              />
            </ErrorBoundary>
          </div>
        </section>

        {/* Charts Section */}
        <section className="dashboard-section dashboard-charts-section">
          <div className="dashboard-charts-grid">
            <div className="dashboard-chart-card dashboard-transactions-chart">
              <div className="dashboard-chart-title">
                <h3>Transaction Volume</h3>
              </div>
              <div className="dashboard-chart-container">
                <Line 
                  data={transactionData} 
                  options={chartOptions}
                  key="transaction-chart"
                />
              </div>
            </div>

            <div className="dashboard-chart-card dashboard-network-chart">
              <div className="dashboard-chart-title">
                <h3>Network Load</h3>
              </div>
              <div className="dashboard-chart-container">
                <Bar 
                  data={networkLoadData} 
                  options={chartOptions}
                  key="network-chart"
                />
              </div>
            </div>

            <div className="dashboard-chart-card dashboard-resources-chart">
              <div className="dashboard-chart-title">
                <h3>Resource Usage</h3>
              </div>
              <div className="dashboard-chart-container">
                <Doughnut 
                  data={resourceData} 
                  options={doughnutOptions}
                  key="resource-chart"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Performance Metrics Section */}
        <section className="dashboard-section dashboard-metrics-section">
          <div className="dashboard-section-title">
            <h2>Performance Metrics</h2>
          </div>
          <div className="dashboard-metrics-grid">
            <MetricCard
              title="CPU Usage"
              value={networkStats.cpuUsage}
              unit="%"
              icon={<FiCpu />}
            />
            <MetricCard
              title="Memory"
              value={networkStats.memoryUsage}
              unit="GB"
              icon={<FiHardDrive />}
            />
            <MetricCard
              title="TPS"
              value={networkStats.tps}
              unit="tx/s"
              icon={<FiActivity />}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
