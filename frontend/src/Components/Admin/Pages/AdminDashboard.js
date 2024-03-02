import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { BASE_URL } from '../../../Api/api';
import AdminNavbar from './AdminNavbar';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({});

    useEffect(() => {
        fetch(`${BASE_URL}/socialadmin/admin/dashboard/`)
            .then(response => response.json())
            .then(data => setDashboardData(data));
    }, []);

    const { posts_by_month } = dashboardData;

    const chartData = {
        labels: posts_by_month ? posts_by_month.map(item => item.month.toISOString().slice(0, 7)) : [],
        datasets: [
            {
                label: 'Posts Created',
                data: posts_by_month ? posts_by_month.map(item => item.count) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <>
            <AdminNavbar />
            <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-2">Total Users</h2>
                    <p className="text-gray-700">{dashboardData.total_users}</p>
                </div>
                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-xl font-semibold mb-2">Total Posts</h2>
                    <p className="text-gray-700">{dashboardData.total_posts}</p>
                </div>
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Posts Created by Month</h2>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
        </>
    );
};

export default AdminDashboard;
