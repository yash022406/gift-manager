"use client"
import { useState } from 'react';
import { UserAuth } from '../../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, set, push } from 'firebase/database';
import { realdb } from '../../utils/firebase'; // Ensure you have the Realtime Database instance imported

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });
  const { createUser } = UserAuth();
  const { user } = UserAuth();
  const userEmail = user?.email;
  const router = useRouter();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email || !emailPattern.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.phone || !phonePattern.test(formData.phone)) errors.phone = 'Valid phone number is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        // Create the user in Firebase Authentication
        await createUser(formData.email, formData.password);
        const newUserRef = push(ref(realdb, `users`));


        const userData = {
          id: formData.email,
          email: formData.email,
          name: formData.name,
          city: formData.city,
          phoneNumber: formData.phone,
          wallet: 5000
        };

        await set(newUserRef, userData);
        
        alert('Verification email sent to your EmailID. Please verify your EmailID.');
        console.log(formData, "user added successfully");
        router.push('/login');
      } catch (e) {
        console.error("Error during signup:", e);
        alert("An error occurred during signup. Please try again.");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <label className="block mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded mt-2"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
