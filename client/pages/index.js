'use client';

import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [likedDoctors, setLikedDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('https://practo-assaignment-y77v.onrender.com/api/doctors');
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleLike = (id) => {
    setLikedDoctors((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const handleBookNow = async (doctorId) => {
    const patientName = prompt('Enter your name:');
    const date = prompt('Enter appointment date (YYYY-MM-DD):');
    const time = prompt('Enter appointment time (HH:MM):');

    if (!patientName || !date || !time) {
      alert('All fields are required!');
      return;
    }

    try {
      const res = await fetch('https://practo-assaignment-y77v.onrender.com/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorId, patientName, date, time }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Booking successful!');
      } else {
        alert('Booking failed: ' + data.message);
      }
    } catch (error) {
      alert('Booking failed: ' + error.message);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const nameMatch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const specializationMatch = selectedSpecialization
      ? doctor.specialization === selectedSpecialization
      : true;
    return nameMatch && specializationMatch;
  });

  const specializations = [...new Set(doctors.map((doc) => doc.specialization))];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Doctor Listing</h1>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
        >
          <option value="">All Specializations</option>
          {specializations.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {filteredDoctors.map((doctor) => (
        <div
          key={doctor._id}
          className="border p-4 rounded-lg mb-4 shadow-md bg-white"
        >
          <div className="flex items-center gap-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-gray-600">{doctor.specialization}</p>
              <p className="text-gray-800 font-bold">₹{doctor.fee} only</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleBookNow(doctor._id)}
              >
                Book Now
              </button>
              <button onClick={() => handleLike(doctor._id)}>
                <FaThumbsUp
                  className={`text-2xl ${
                    likedDoctors.includes(doctor._id) ? 'text-green-500' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
