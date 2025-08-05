import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch('http://localhost:5000/api/doctors');
      const data = await res.json();
      setDoctors(data);
    };
    fetchDoctors();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    try {
      const res = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          doctor: selectedDoctor.name,
        }),
      });

      const result = await res.json();
      setMessage(result.message);
      setFormData({ name: '', email: '', date: '', time: '' });
      setSelectedDoctor(null);
    } catch (err) {
      setMessage('Error submitting booking.');
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Like Button Component
 function LikeButton() {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(97);

    const handleLike = () => {
      setLiked(!liked);
      setCount(prev => (liked ? prev - 1 : prev + 1));
    };

    return (
      <button
        onClick={handleLike}
        className={`flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-white ${liked ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'} transition`}
      >
        <FaThumbsUp />
        <span>{count}%</span>
      </button>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <>
        <div className="text-3xl font-bold mb-4 text-center">
          <img src="pic3.png" alt="Logo" className="h-12" />
          <a href="#" class="link">Find  Doctors</a> &nbsp;
          <a href="#" class="link">Video  Consult</a>&nbsp;
          <a href="#" class="link"> Surgeries</a>
          <button id="button">NEW</button>
          <select class="search-select">
            <option>For Corporates</option>
            {/* <option >Visit Clinic</option>
            <option >Docotor Appointment</option>
            <option >Blood Report</option> */}
          </select>
          <select class="search-select1">
            <option>For providers</option>
          </select>
          <select class="search-select1">
            <option>Security & help</option>
          </select>
          <button id="login">Login/Signup</button>
        </div>
        
        <input
          type="text"
          placeholder=" JP Nagar"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-6 " id="search1"
        />

        <input placeholder="Dermatologiest" class="mb-6" id="search2" />
        <br />
        
        <div id="sdf">
          <select class="s1"id="s1d">
            <option>
              Gender
            </option>
            <option>Male</option>
            <option>FeMale</option>
            <option>Custom</option>
          </select>
          <select class="s1">
            <option>
              Patient Stories
            </option>
            <option>Good</option>
            <option>Bad</option>
            <option>overall</option>
          </select>
          <select class="s1">
            <option>
              Experience
            </option>
            <option>1-3 years</option>
            <option>4-6 years</option>
            <option>7-10 years</option>
          </select>
          <select class="s1" id="s1dd">
            <option>All Filters</option>
          </select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span  id="sort-by">Sort By</span>
          <select class="s1">
            <option>Relevance</option>
            <option>Rating</option>
            <option>Experience</option>
          </select>
        </div>
      </>
     <div className="text">
      <h1 id="heading1">
        29 Dermatologiest available in Jp Nagar, Bangalore
      </h1>
      <p id="para1">
        ✔︎ Book appointment with minimum-wait time & verified doctor details
      </p>
     </div>
     <hr/>
      <br/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24"
              />
              &nbsp;&nbsp;
              <div>
                <h2 className="text-gray-800">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p className="text-gray-500 ">{doctor.experience}</p>
                <p className="text-green-600 ">{doctor.city}</p>
                 <p className="text-green-700 text-sm">
                 <span className="font-bold">{doctor.fees}</span> only
                </p>
               
                {/* ✅ Like Button just below fees */}
                <LikeButton/> 
                
              </div>
            </div>

            {/* ✅ Right-aligned green Book Now button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedDoctor(doctor)}
                className="book"
              >
                Book Clinic Visit
              </button>
            </div>
           

            <hr className="mt-4" />
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Book Appointment with {selectedDoctor.name}</h2>
          <form onSubmit={handleBooking} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Confirm Booking
            </button>
          </form>
          {message && <p className="text-center mt-4 text-blue-600">{message}</p>}
        </div>
      )}
    </div>
  );
}
