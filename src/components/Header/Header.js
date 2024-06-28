"use client";
import { UserAuth } from '../../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { BsCoin } from "react-icons/bs";

export default function Header() {
    const { logout } = UserAuth();
    const router = useRouter();

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
                    <span className='font-bold text-green-500'>5000</span>
                </div>
                <button onClick={handleLogout} className="text-xl font-semibold">Logout</button>
            </div>
        </div>
    );
}