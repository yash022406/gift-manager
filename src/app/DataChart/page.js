"use client";
import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { realdb } from '../../utils/firebase';
import { UserAuth } from '../../utils/AuthContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function TransactionsChart() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = UserAuth();

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

    const receivedData = transactions.reduce((acc, transaction) => {
        if (transaction.sentTo === user.email) {
            const date = new Date(transaction.time).toLocaleDateString();
            acc[date] = (acc[date] || 0) + parseFloat(transaction.amount);
        }
        return acc;
    }, {});

    const contributedData = transactions.reduce((acc, transaction) => {
        if (transaction.sentBy === user.email) {
            const date = new Date(transaction.time).toLocaleDateString();
            acc[date] = (acc[date] || 0) + parseFloat(transaction.amount);
        }
        return acc;
    }, {});

    const receivedLabels = Object.keys(receivedData);
    const receivedAmounts = Object.values(receivedData);
    const contributedLabels = Object.keys(contributedData);
    const contributedAmounts = Object.values(contributedData);

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
            <p className='text-3xl font-semibold mb-8'>Date-wise Transactions</p>
            {loading ? (
                <p className='text-lg'>Loading...</p>
            ) : (
                <>
                    <div className="w-full bg-slate-800 p-6 rounded-md mb-8">
                        <p className='text-2xl font-semibold mb-4'>Received</p>
                        <Line 
                            data={{
                                labels: receivedLabels,
                                datasets: [
                                    {
                                        label: 'Received Transactions',
                                        data: receivedAmounts,
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                        tension: 0.1,
                                    },
                                ],
                            }} 
                            options={chartOptions} 
                        />
                    </div>
                    <div className="w-full bg-slate-800 p-6 rounded-md mb-10">
                        <p className='text-2xl font-semibold mb-4'>Contributed</p>
                        <Line 
                            data={{
                                labels: contributedLabels,
                                datasets: [
                                    {
                                        label: 'Contributed Transactions',
                                        data: contributedAmounts,
                                        borderColor: 'rgba(255, 99, 132, 1)',
                                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                        tension: 0.1,
                                    },
                                ],
                            }} 
                            options={chartOptions} 
                        />
                    </div>
                </>
            )}
        </div>
    );
}
