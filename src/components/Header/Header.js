"use client";
import { useState, useEffect } from 'react';
import { UserAuth } from '../../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { BsCoin } from "react-icons/bs";
import { ref, onValue, off } from "firebase/database";
import { realdb } from "../../utils/firebase";

export default function Header() {
    const { logout } = UserAuth();
    const router = useRouter();
    const {user} = UserAuth();
    const [users, setUsers] = useState()
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const userRef = ref(realdb, 'users');

        const onEventsChange = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const usersList = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setUsers(usersList);
            } else {
                setUsers([]);
            }
        };

        onValue(userRef, onEventsChange);

        return () => {
            off(userRef, 'value', onEventsChange);
        };
    }, [user]);

    useEffect(() => {
        const user = users?.find(user => user.email === user.email);
        setSelectedUser(user);
      }, [users]);
      console.log(selectedUser)

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
            console.log('You are logged out.');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="w-full flex justify-between px-10 items-center border-b border-[#a4a3a3] py-3">
            <p className="text-xl font-semibold">Gift Manager</p>
            <div className="flex gap-4">
                <div className="flex gap-1 px-2 py-2 border border-[#a4a3a3] rounded-lg">
                    <BsCoin size={24} />
                    <span className='font-bold text-green-500'>{selectedUser?.wallet}</span>
                </div>
                <button onClick={handleLogout} className="text-xl font-semibold">Logout</button>
            </div>
        </div>
    );
}