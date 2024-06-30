"use client";
import './index.css'
import { UserAuth } from "../../utils/AuthContext";
import { useRouter } from 'next/navigation';
import { BsCoin } from "react-icons/bs";
import { useState, useEffect } from 'react';
import Link from 'next/link';
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

    return (
        <div className="flex flex-col bg-black">
           
            <div className="flex justify-between mt-8 w-[80%] mx-auto ">
                <p className="md:text-4xl text-2xl font-semibold color-text">Hello, {user?.email}</p>
                <button onClick={openEventsForm} className='px-3 py-2 rounded-lg border border-[#a4a3a3] font-bold'>Create New Event</button>
            </div>
            <div className="w-[80%] mx-auto mt-8">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
                <div className="flex flex-col gap-2">
                    {events.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {events?.map((event, index) => (
                                event?.createdBy === user?.email &&
                                <Link key={index} href={`/dashboard/${event.id}`} >
                                    
                                    <div className="border border-[#a4a3a3] rounded-lg p-4">
                                        <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
                                        <h3 className="text-md font-semibold mb-2">Organiser: {event.createdBy}</h3>
                                        <p>Start: {new Date(event.eventStartingTime).toLocaleString()}</p>
                                        <p>End: {new Date(event.eventEndingTime).toLocaleString()}</p>
                                        <p className="mt-2">Participants:</p>
                                        <ul className="list-disc list-inside">
                                            {event.participants && Object.values(event.participants).map((participant, index) => (
                                                <li key={index}>{participant.name} ({participant.email})</li>
                                            ))}
                                        </ul>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>No events found. Create a new event to get started!</p>
                    )}
                    {events.length > 0 ? (
                        events?.map((event) => (
                            <div className="flex gap-4 flex-col" key={event.id}>
                                {event.participants && Object.values(event.participants).map((participant, index) => (
                                    participant.email === user?.email &&
                                    <Link key={index} href={`/dashboard/${event.id}`} >
                                        <div className="border border-[#a4a3a3] rounded-lg p-4">
                                            <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
                                            <h3 className="text-md font-semibold mb-2">Organiser: {event.createdBy}</h3>
                                            <p>Start: {new Date(event.eventStartingTime).toLocaleString()}</p>
                                            <p>End: {new Date(event.eventEndingTime).toLocaleString()}</p>
                                            <p className="mt-2">Participants:</p>
                                            <ul className="list-disc list-inside">
                                                {event.participants && Object.values(event.participants).map((participant, index) => (
                                                    <li key={index}>{participant.name} ({participant.email})</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))
                    ) : (<></>)}
                </div>
            </div>
            {eventform && (
                <EventForm
                    closeEventForm={closeEventForm}
                />
            )}
        </div>
    );
}
