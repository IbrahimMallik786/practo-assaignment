const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS only for your Vercel frontend
app.use(cors({
  origin: 'https://practo-assaignment-b2b2-ibrahim-mallicks-projects.vercel.app',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// ✅ Dummy doctor data
const doctors = [
  {
    id: 1,
    name: 'Aesthetic Heart Dermatology & Cardiology Clinic ',
    specialty:'1Dermatologist',
    experience:'11-13 years experience',
    city: 'Jayangar',
    fees:'₹800 Consulation Fees',
    image: 'pic1.png'
  },
  {
    id: 2,
    name: 'Dr. Sheelavanthi Natraj',
    specialty: 'Dermatologist',
    experience:'21 years experience overall',
    city: 'JP Nagar,Bangalore .Sapphire Skin And Aesthetics Clinic +1 more',
    fees:'₹800 Consulation Fee at clinic',
    image: 'pic2.png'
  },
];

// ✅ API to get doctor list
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

// ✅ API to handle bookings and send confirmation email
app.post('/api/book', async (req, res) => {
  const { name, email, date, time, doctor } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ibrahimmallik976@gmail.com', // 🔒 Use environment variable in production
      pass: 'your-app-password'           // 🔒 Replace with Gmail App Password
    }
  });

  const mailOptions = {
    from: 'ibrahimmallik976@gmail.com',
    to: email,
    subject: `Appointment Confirmation with ${doctor}`,
    text: `Hello ${name},\n\nYour appointment with ${doctor} has been booked for ${date} at ${time}.\n\nThank you for using our service!`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Booking confirmed and email sent!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Booking failed. Email not sent.' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
