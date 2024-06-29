"use client";
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realdb } from '../../utils/firebase';
import { UserAuth } from '../../utils/AuthContext';

const Transactions = () => {
  const { user } = UserAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.email) return;

      try {
        const transactionsRef = ref(realdb, 'transactions');
        const snapshot = await get(transactionsRef);

        if (snapshot.exists()) {
          const allTransactions = snapshot.val();
          const userTransactions = Object.values(allTransactions).filter(
            transaction => 
              transaction.sentBy === user.email || 
              transaction.sentTo === user.email
          );
          setTransactions(userTransactions);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white mx-[5%] mt-6">
      <h1 className="text-2xl font-bold mb-6">Your Transactions</h1>
      {transactions.length === 0 ? (
        <p className="text-center">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2 text-left">Event</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Sent To</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                  <td className="px-4 py-2">{transaction.eventName}</td>
                  <td className="px-4 py-2">
                    {transaction.sentBy === user.email ? 'Sent' : 'Received'}
                  </td>
                  <td className="px-4 py-2">
                    {transaction.sentBy === user.email ? transaction.sentTo : transaction.sentBy}
                  </td>
                  <td className="px-4 py-2">
                  {new Date(transaction.time).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    <span className={transaction.sentBy === user.email ? 'text-red-400' : 'text-green-400'}>
                      {transaction.sentBy === user.email ? '-' : '+'}${transaction.amount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;