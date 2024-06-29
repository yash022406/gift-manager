"use client";
import { useEffect, useState } from 'react';
import { ref, get, update, set, push } from 'firebase/database';
import { realdb } from '../../../utils/firebase';
import { UserAuth } from '../../../utils/AuthContext';
import Modal from '../../../components/SendGiftModal';
const EventDetail = ({ params }) => {
    const { user } = UserAuth();
    const { eventId } = params;
    const userEmail = user?.email;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [isEventTime, setIsEventTime] = useState(false);
    const [closeEvent, setCloseEvent] = useState(true)

  useEffect(() => {
    if (eventId) {
      const eventRef = ref(realdb, `events/${eventId}`);
      get(eventRef).then((snapshot) => {
        if (snapshot.exists()) {
          const eventData = snapshot.val();
          setEvent(eventData);
          checkEventTime(eventData);
        } else {
          setError("Event not found");
        }
      }).catch((error) => {
        console.error("Error fetching event:", error);
        setError("Error fetching event data");
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
      setError("No event ID provided");
    }
  }, [eventId]);

  const handleSendGift = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
  
    try {
      const senderEmail = userEmail;
      const recipientEmail = selectedParticipant.email;
  
      const usersRef = ref(realdb, 'users');
      const usersSnapshot = await get(usersRef);
  
      if (usersSnapshot.exists()) {
        const users = usersSnapshot.val();
        const sender = Object.entries(users).find(([_, u]) => u.email === senderEmail);
        const recipient = Object.entries(users).find(([_, u]) => u.email === recipientEmail);
  
        if (!sender || !recipient) {
          alert("Sender or recipient not found");
          return;
        }
  
        const [senderId, senderData] = sender;
        const [recipientId, recipientData] = recipient;
  
        if (senderData.wallet < parseFloat(amount)) {
          alert("Insufficient funds");
          return;
        }
  
        const updatedSenderWallet = senderData.wallet - parseFloat(amount);
        const updatedRecipientWallet = recipientData.wallet + parseFloat(amount);
  
        const updates = {};
        updates[`users/${senderId}/wallet`] = updatedSenderWallet;
        updates[`users/${recipientId}/wallet`] = updatedRecipientWallet;
  
        await update(ref(realdb), updates);
        const newTransactionRef = push(ref(realdb, 'transactions'))
        const transactionData = {
            sentBy: userEmail,
            eventName: event.eventName,
            sentTo: selectedParticipant.email,
            amount: amount,
            time: new Date().toISOString()
        }
        await set(newTransactionRef, transactionData);
  
        alert("Gift sent successfully!");
        setIsModalOpen(false);
      } else {
        alert("Error fetching user data");
      }
    } catch (error) {
      console.error("Error sending gift:", error);
      alert(`An error occurred while sending the gift: ${error.message}`);
    }
  };



  const checkEventTime = (eventData) => {
    const now = new Date().getTime();
    const startTime = new Date(eventData.eventStartingTime).getTime();
    const endTime = new Date(eventData.eventEndingTime).getTime();
    setIsEventTime(now >= startTime && now <= endTime && closeEvent);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">Error: {error}</div>;
  }

  if (!event) {
    return <div className="flex justify-center items-center h-screen bg-black text-white">No event found</div>;
  }

//   if (!isEventTime) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-black text-white">
//         Please join the event according to timings. Event features are not available right now.
//       </div>
//     );
//   }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white mt-6 px-[5%]">
      <h1 className="text-3xl font-bold mb-4">{event.eventName}</h1>
      <div className="mb-4">

        <p>Start: {new Date(event.eventStartingTime).toLocaleString()}</p>
        <p>End: {new Date(event.eventEndingTime).toLocaleString()}</p>
      </div>
      <div className="flex-grow">
        <h2 className="text-2xl font-semibold mb-2">Participants</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {event.participants && Object.values(event.participants).map((participant, index) => (
                participant.email!==userEmail ? (
                <tr key={index} className={index % 2 === 0 ? 'bg-[#262626]' : 'bg-[#303030]'}>
                  <td className="px-4 py-2">{participant.name}</td>
                  <td className="px-4 py-2">{participant.email}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => {
                        setSelectedParticipant(participant);
                        setIsModalOpen(true);
                    }} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                      Send Gift
                    </button>
                  </td>
                </tr>): (
                    <tr key={index} className={index % 2 === 0 ? 'bg-[#262626]' : 'bg-[#303030]'}>
                    <td className="px-4 py-2">Organiser</td>
                    <td className="px-4 py-2">{event.createdBy}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => {
                        console.log(participant)
                        setSelectedParticipant({email: event.createdBy, name: "Organiser"});
                        setIsModalOpen(true);
                    }} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Send Gift
                      </button>
                    </td>
                    </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={() => setCloseEvent(false)} className='p-2 rounded-lg mb-40 border border-red-500 bg-red-950 hover:bg-red-500 w-40 mx-auto'>Close event</button>
      { isModalOpen && <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSendGift}
        amount={amount}
        setAmount={setAmount}
      />}
    </div>
  );
};

export default EventDetail;