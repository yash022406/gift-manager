"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "../utils/AuthContext";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AuthContextProvider>
        {children}
    </AuthContextProvider>
        </body>
    </html>
  );
}