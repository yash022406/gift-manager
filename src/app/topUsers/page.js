"use client";
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realdb } from '../../utils/firebase';
import { UserAuth } from '../../utils/AuthContext';

const TopUsers = () => {
  const { user } = UserAuth();
  const [topGuests, setTopGuests] = useState([]);
  const [topHosts, setTopHosts] = useState([]);
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
          processTransactions(allTransactions);
        } else {
          setTopGuests([]);
          setTopHosts([]);
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

  const processTransactions = (transactions) => {
    const guestContributions = {};
    const hostContributions = {};

    Object.values(transactions).forEach(transaction => {
      if (transaction.sentTo === user.email) {
        // User received contribution
        if (!guestContributions[transaction.sentBy]) {
          guestContributions[transaction.sentBy] = 0;
        }
        guestContributions[transaction.sentBy] += parseFloat(transaction.amount);
      } else if (transaction.sentBy === user.email) {
        // User sent contribution
        if (!hostContributions[transaction.sentTo]) {
          hostContributions[transaction.sentTo] = 0;
        }
        hostContributions[transaction.sentTo] += parseFloat(transaction.amount);
      }
    });

    setTopGuests(Object.entries(guestContributions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, amount]) => ({ email, amount })));

    setTopHosts(Object.entries(hostContributions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, amount]) => ({ email, amount })));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black mx-[5%] mt-6 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Top Users</h1>
      
      <div className="flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-1/2 mb-6 md:mb-0 md:mr-2">
          <h2 className="text-2xl font-semibold mb-4">Top Guests (Contributors)</h2>
          {topGuests.length === 0 ? (
            <p>No guest contributions yet.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left">Guest</th>
                  <th className="px-4 py-2 text-left">Total Contribution</th>
                </tr>
              </thead>
              <tbody>
                {topGuests.map((guest, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                    <td className="px-4 py-2">{guest.email}</td>
                    <td className="px-4 py-2">${guest.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="w-full md:w-1/2 md:ml-2">
          <h2 className="text-2xl font-semibold mb-4">Top Hosts (Contributed To)</h2>
          {topHosts.length === 0 ? (
            <p>No contributions to hosts yet.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left">Host</th>
                  <th className="px-4 py-2 text-left">Total Contribution</th>
                </tr>
              </thead>
              <tbody>
                {topHosts.map((host, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}>
                    <td className="px-4 py-2">{host.email}</td>
                    <td className="px-4 py-2">${host.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopUsers;