// components/Modal.js
"use client"
import React from 'react';
import { useEffect } from 'react';
import './EventForm/overlay.css'
const Modal = ({ isOpen, onClose, onSubmit, amount, setAmount }) => {
  if (!isOpen) return null;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const handleClickOutside = (event) => {
      const modalContent = document.querySelector(".modal-content");

      if (
        modalContent &&
        !event.target.closest(".modal-content") &&
        !event.target.closest(".button")
      ) {
        // Close the modal if the click is outside the modal content and not on the excluded class
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className=" modal-overlay fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-white flex flex-col p-4 rounded modal-content">
        <h2 className="text-xl mb-4">Send Gift</h2>
        <form onSubmit={onSubmit}>
          <label className="block mb-2">
            Amount
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-2 py-1 border rounded bg-[#181818] outline-none"
              required
            />
          </label>
          <div className="flex justify-around mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
