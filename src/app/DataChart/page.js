"use client"
import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { realdb } from '../../utils/firebase';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function TransactionsChart() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const transactionsRef = ref(realdb, 'transactions');

        const onTransactionsChange = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const transactionsList = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setTransactions(transactionsList);
            } else {
                setTransactions([]);
            }
            setLoading(false);
        };

        onValue(transactionsRef, onTransactionsChange);

        return () => {
            off(transactionsRef, 'value', onTransactionsChange);
        };
    }, []);

    const transactionData = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.time).toLocaleDateString();
        acc[date] = (acc[date] || 0) + parseFloat(transaction.amount);
        return acc;
    }, {});

    const labels = Object.keys(transactionData);
    const data = Object.values(transactionData);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Total Transactions',
                data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                },
            },
        },
    };

    return (
        <div className='flex items-center flex-col justify-center w-[70%] mx-auto mt-10'>
            <p className='text-3xl font-semibold mb-8'>Date wise transactions</p>
            {loading ? (
                <p className='text-lg'>Loading...</p>
            ) : (
                <div className="w-full bg-slate-800 p-6 rounded-md">
                <Line data={chartData} options={chartOptions} />
                </div>
            )}
        </div>
    );
}
