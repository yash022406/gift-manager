"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "../utils/AuthContext";
import Header from "../components/Header/Header";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname==="/";

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          {!isAuthPage && <Header />}
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}