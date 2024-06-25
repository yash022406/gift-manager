"use client";
import './index.css'
import { UserAuth } from "../../utils/AuthContext";
import { useRouter } from 'next/navigation';
import { BsCoin } from "react-icons/bs";
import { useState } from 'react';
import EventForm from '../../components/EventForm/EventForm'
export default function Dashboard () {
    const {user} = UserAuth();
    const {logout} = UserAuth();
    const router = useRouter();
    console.log(user)
    const [eventform, setEventForm] = useState()
    const openEventsForm = () => {
        setEventForm(true);
      }
      const closeEventForm = ( ) => {
        setEventForm(false);
      }

    const handleLogout = async () => {
        try{
        await logout()
        router.push('/');
        console.log('You are logged out.')
        }catch(e){
        console.log(e)
        }
    }

    return(
        <div className="flex flex-col ">
            <div className="w-full flex justify-between px-10 items-center border-b border-[#a4a3a3] py-3">
                <p className="text-xl font-semibold">Gift Manager</p>
                {/* <p className='text-xl font-medium'> {user ? `Welcome, ${user.name}` : 'Not logged in'}</p> */}
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
            {
            eventform && (
                <EventForm
                  closeEventForm={closeEventForm}
                />
              )
            }
        </div>
    )
}