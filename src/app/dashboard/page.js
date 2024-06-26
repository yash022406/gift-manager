"use client";
import './index.css'
import { UserAuth } from "../../utils/AuthContext";
import { useRouter } from 'next/navigation';
import { BsCoin } from "react-icons/bs";
import { useState, useEffect } from 'react';
import EventForm from '../../components/EventForm/EventForm'
import { realdb } from "../../utils/firebase";
import { ref, onValue, off } from "firebase/database";

export default function Dashboard() {
    const { user } = UserAuth();
    const { logout } = UserAuth();
    const router = useRouter();
    const [eventform, setEventForm] = useState(false);
    const [events, setEvents] = useState([]);
    

    useEffect(() => {
        const eventsRef = ref(realdb, 'events');
        
        const onEventsChange = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const eventsList = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setEvents(eventsList);
            } else {
                setEvents([]);
            }
        };

        onValue(eventsRef, onEventsChange);

        return () => {
            off(eventsRef, 'value', onEventsChange);
        };
    }, []);

    const openEventsForm = () => {
        setEventForm(true);
    }

    const closeEventForm = () => {
        setEventForm(false);
    }

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/');
            console.log('You are logged out.')
        } catch (e) {
            console.log(e)
        }
    }
    console.log(events)

    

    return (
        <div className="flex flex-col">
            <div className="w-full flex justify-between px-10 items-center border-b border-[#a4a3a3] py-3">
                <p className="text-xl font-semibold">Gift Manager</p>
                <div className="flex gap-4">
                    <div className="flex gap-1 px-2 py-2 border border-[#a4a3a3] rounded-lg">
                        <BsCoin size={24} />
                        <span className='font-bold text-green-500'>5000</span>
                    </div>
                    <button onClick={handleLogout} className="text-xl font-semibold">Logout</button>
                </div>
            </div>
            <div className="flex justify-between mt-8 w-[80%] mx-auto ">
                <p className="text-4xl font-semibold color-text">Hello, {user?.email}</p>
                <button onClick={openEventsForm} className='px-3 py-2 rounded-lg border border-[#a4a3a3] font-bold'>Create New Event</button>
            </div>
            
            <div className="w-[80%] mx-auto mt-8">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
                <div className="flex flex-wrap gap-2">
                {events.length > 0 ? (
                    <div className="grid  gap-4">
                        {events.map((event) => ( 
                           
                               event?.createdBy===user?.email &&
                            <div key={event.id} className="border border-[#a4a3a3] rounded-lg p-4">
                                <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
                                <p>Start: {new Date(event.eventStartingTime).toLocaleString()}</p>
                                <p>End: {new Date(event.eventEndingTime).toLocaleString()}</p>
                                <p className="mt-2">Participants:</p>
                                <ul className="list-disc list-inside">
                                    {Object.values(event.participants).map((participant, index) => (
                                        <li key={index}>{participant.name} ({participant.email})</li>
                                    ))}
                                </ul>
                            </div>

                        ))}
                    </div>
                ) : (
                    <p>No events found. Create a new event to get started!</p>
                )}
                {
                    events.length>0 ? (
                        events.map((event) => (
                            // console.log(event.participants)
                            <div className="grid  gap-4">
                            {Object.values(event.participants).map((participant, index) => (
                                        participant.email===user?.email &&
                                        <div key={event.id} className="border border-[#a4a3a3] rounded-lg p-4">
                                <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
                                <p>Start: {new Date(event.eventStartingTime).toLocaleString()}</p>
                                <p>End: {new Date(event.eventEndingTime).toLocaleString()}</p>
                                <p className="mt-2">Participants:</p>
                                <ul className="list-disc list-inside">
                                    {Object.values(event.participants).map((participant, index) => (
                                        <li key={index}>{participant.name} ({participant.email})</li>
                                    ))}
                                </ul>
                            </div>
                                    ))}
                            </div>
                        ))
                    ): (<></>)
                }</div>
            </div>

            {eventform && (
                <EventForm
                    closeEventForm={closeEventForm}
                />
            )}
        </div>
    )
}