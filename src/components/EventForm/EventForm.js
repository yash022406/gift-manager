"use client"
import './overlay.css'
import { useState } from 'react';
export default function EventForm ({closeEventForm}){
    const [formData, setFormData] = useState({
        eventName: '',
        startTime: '',
        endTime: '',
        participantsCount: '',
        participants: [],
      });
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
      };
    
      const handleAddParticipant = () => {
        const count = parseInt(formData.participantsCount);
        if (!isNaN(count)) {
          const participants = Array.from({ length: count }, () => ({ name: '', phone: '', email: '' }));
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
    return(

        <div className="modal-overlay">
            <div className="bg-gray-900 overflow-y-auto text-white flex items-center justify-center">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Add Event Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Starting Date and Time</label>
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
              <label className="block mb-1">Ending Date and Time</label>
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
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Add
            </button>
          </div>
          {formData.participants.map((participant, index) => (
            <div key={index} className="border border-gray-600 p-4 rounded">
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
                <label className="block mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={participant.phone}
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
    )
}