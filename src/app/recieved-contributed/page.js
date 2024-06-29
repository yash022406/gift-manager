"use client";
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realdb } from '../../utils/firebase';
import { UserAuth } from '../../utils/AuthContext';

const ReceivedContributed = () => {
  const { user } = UserAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [receivedData, setReceivedData] = useState({});
  const [contributedData, setContributedData] = useState({});
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
          setReceivedData({});
          setContributedData({});
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
    const received = {};
    const contributed = {};

    Object.values(transactions).forEach(transaction => {
      if (transaction.sentTo === user.email) {
        // Received
        if (!received[transaction.eventName]) {
          received[transaction.eventName] = { total: 0, guests: {} };
        }
        received[transaction.eventName].total += parseFloat(transaction.amount);
        if (!received[transaction.eventName].guests[transaction.sentBy]) {
          received[transaction.eventName].guests[transaction.sentBy] = 0;
        }
        received[transaction.eventName].guests[transaction.sentBy] += parseFloat(transaction.amount);
      } else if (transaction.sentBy === user.email) {
        // Contributed
        if (!contributed[transaction.eventName]) {
          contributed[transaction.eventName] = { total: 0, hosts: {} };
        }
        contributed[transaction.eventName].total += parseFloat(transaction.amount);
        if (!contributed[transaction.eventName].hosts[transaction.sentTo]) {
          contributed[transaction.eventName].hosts[transaction.sentTo] = 0;
        }
        contributed[transaction.eventName].hosts[transaction.sentTo] += parseFloat(transaction.amount);
      }
    });

    setReceivedData(received);
    setContributedData(contributed);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">{error}</div>;
  }

  const renderTabContent = () => {
    const data = activeTab === 'received' ? receivedData : contributedData;
    const totalAmount = Object.values(data).reduce((sum, event) => sum + event.total, 0);

    return (
      <div className="mt-6 mx-[5%]">
        <h2 className="text-2xl font-semibold mb-4">
          Total {activeTab === 'received' ? 'Received' : 'Contributed'}: ${totalAmount.toFixed(2)}
        </h2>
        {Object.entries(data).map(([eventName, eventData]) => (
          <div key={eventName} className="mb-6 bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{eventName}</h3>
            <p className="mb-2">Total: ${eventData.total.toFixed(2)}</p>
            <h4 className="text-lg font-semibold mb-2">
              {activeTab === 'received' ? 'Guests' : 'Hosts'}:
            </h4>
            <ul className="list-disc pl-5">
              {Object.entries(activeTab === 'received' ? eventData.guests : eventData.hosts).map(([person, amount]) => (
                <li key={person} className="mb-1">
                  {person}: ${amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-black mt-6 mx-[5%] text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Received & Contributed</h1>
      
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${activeTab === 'received' ? 'bg-blue-600' : 'bg-gray-700'}`}
          onClick={() => setActiveTab('received')}
        >
          Received
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'contributed' ? 'bg-blue-600' : 'bg-gray-700'}`}
          onClick={() => setActiveTab('contributed')}
        >
          Contributed
        </button>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default ReceivedContributed;