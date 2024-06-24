"use client"
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="space-x-4 flex">
        <Link href="/signup">
          <p className="px-4 py-2 w-40 items-center flex justify-center bg-blue-600 hover:bg-blue-700 rounded">Signup</p>
        </Link>
        <Link href="/login">
          <p className="px-4 py-2 flex justify-center w-40 bg-blue-600 hover:bg-blue-700 rounded">Login</p>
        </Link>
      </div>
    </div>
  );
}
