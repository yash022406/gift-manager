"use client";
import "./overlay.css";
import { useState, useEffect } from "react";
import { realdb } from "../../utils/firebase";
import { ref, push, set } from "firebase/database";
import { UserAuth } from "../../utils/AuthContext";
import { generateToken } from "../../utils/firebase";
import emailjs from '@emailjs/browser';

export default function EventForm({ closeEventForm }) {
  // const RESEND_API_KEY = "re_SJFyFuq5_QGKdeZ8NmpqFnQotPbR7bKjr";
  // const resend = new Resend(RESEND_API_KEY);

  const { user } = UserAuth();
  const userEmail = user?.email;

  const [formData, setFormData] = useState({
    eventName: "",
    startTime: "",
    endTime: "",
    participantsCount: "",
    participants: [],
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new reference for the event
      const newEventRef = push(ref(realdb, 'events'));

      // Prepare the data to be saved
      const eventData = {
        createdBy: userEmail,
        eventName: formData.eventName,
        eventStartingTime: new Date(formData.startTime).getTime(),
        eventEndingTime: new Date(formData.endTime).getTime(),
        participants: formData.participants.reduce((acc, participant, index) => {
          acc[`participant${index + 1}`] = {
            name: participant.name,
            email: participant.email
          };
          return acc;
        }, {}),

      };
      
      await set(newEventRef, eventData);
      const participants = Object.values(eventData.participants)
      const emails = participants.map(participant => participant.email)
      console.log(emails)
     
      // Set the data for the new event
      // const response = await fetch("/api/emails", { method: "POST" });
      // console.log(await response.json())
      
      const templateParams = {
        to_Email: emails,
        event_name: formData.eventName,
        start_time: new Date(formData.startTime).toLocaleString(),
        end_time: new Date(formData.endTime).toLocaleString(),

    }

      emailjs.send("service_3v512os", "template_l74q4n3", templateParams, "fPL_SDe29nZUcHUdi")
        .then((response) => {
            console.log("success", response);
        }).catch((error) => {
            console.log("error", error);
        })
      
      // console.log(data)
      
      // if (!response.ok) {
      //   throw new Error(data.error || 'Failed to send email');
      // }

      console.log("Event saved successfully", eventData);
      closeEventForm();
    } catch (error) {
      console.error("Error saving event: ", error);
    }
  };

  const handleAddParticipant = () => {
    const count = parseInt(formData.participantsCount);
    if (!isNaN(count)) {
      const participants = Array.from({ length: count }, () => ({
        name: "",
        phone: "",
        email: "",
      }));
      setFormData({
        ...formData,
        participants: participants,
      });
    }
  };

  const handleParticipantChange = (index, e) => {
    const updatedParticipants = [...formData.participants];
    updatedParticipants[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      participants: updatedParticipants,
    });
  };

  // const POST = async (formData) => {
  //   console.log(formData);
  //   try {
  //     // Extract email addresses from formData
  //     const emailAddresses = formData.map(user => user.email);
  
  //     // Send email to all extracted email addresses
  //     const { data, error } = await resend.emails.send({
  //       from: 'Acme <onboarding@resend.dev>',
  //       to: emailAddresses,
  //       subject: 'INVITATION',
  //       react: EmailTemplate({ firstName: 'John' }),  // Update this line if firstName is dynamic
  //     });
  
  //     if (error) {
  //       return new Response(JSON.stringify({ error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  //     }
  
  //     return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  //   } catch (error) {
  //     return new Response(JSON.stringify({ error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  //   }
  // }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeEventForm();
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
        closeEventForm();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeEventForm]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="w-full space-y-6 bg-gray-800 rounded-lg shadow-lg py-6 max-w-lg md:max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Add Event Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="w-full p-2 rounded">
              <label className="block mb-1">Event Name</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block mb-1">Event starting time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Event ending time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  min={formData.startTime} // Ensures ending time cannot be before starting time
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Add Participants</label>
              <div className="flex items-center gap-2">
              <input
                type="number"
                name="participantsCount"
                value={formData.participantsCount}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                required
              />
              <button
                type="button"
                onClick={handleAddParticipant}
                className=" px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Add
              </button>
              </div>
            </div>
            {formData.participants.map((participant, index) => (
              <div key={index} className="border border-gray-600 p-4 rounded overflow-y-auto">
                <h3 className="text-lg font-bold mb-2">Participant {index + 1}</h3>
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={participant.name}
                    onChange={(e) => handleParticipantChange(index, e)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={participant.email}
                    onChange={(e) => handleParticipantChange(index, e)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded mt-4 text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
