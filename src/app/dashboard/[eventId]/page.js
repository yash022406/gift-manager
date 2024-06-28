"use client";
import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { realdb } from '../../../utils/firebase';

const EventDetail = ({ params }) => {
  const { eventId } = params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEventTime, setIsEventTime] = useState(false);

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

  const checkEventTime = (eventData) => {
    const now = new Date().getTime();
    const startTime = new Date(eventData.eventStartingTime).getTime();
    const endTime = new Date(eventData.eventEndingTime).getTime();
    setIsEventTime(now >= startTime && now <= endTime);
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
                <tr key={index} className={index % 2 === 0 ? 'bg-[#262626]' : 'bg-[#303030]'}>
                  <td className="px-4 py-2">{participant.name}</td>
                  <td className="px-4 py-2">{participant.email}</td>
                  <td className="px-4 py-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                      Send Gift
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;