Women Safety App – SOS Alerts and Safe Route Detection

A mobile application focused on enhancing women's safety during travel by offering real-time SOS alerts and safe route navigation based on historical crime data and AI-powered clustering.

📱 Features

Emergency SOS Alert:
Instantly sends a distress message and live location to pre-selected emergency contacts with a single tap.

Safe Path Detection:
Suggests the safest route from point A to point B by analyzing crime-prone zones using machine learning algorithms.

Real-Time Location Tracking:
Continuously monitors user’s movement for quick response in emergency situations.

User-Friendly Interface:
Simple, intuitive UI for quick access during distress without confusion.

🧠 Motivation

Despite the presence of multiple women safety apps, most focus only on emergency alerts without preventive solutions.
This app not only enables quick emergency communication but also actively helps avoid danger by suggesting safer travel routes using real crime data.

📊 Dataset
Source: OpenData.dc.gov

Details:
Dataset includes adult arrest records from the Metropolitan Police Department (MPD) with information on crime type, date, time, and geolocation (latitude and longitude).
Privacy is maintained by using hashed CCNs (Central Complaint Numbers).

🛠️ Tech Stack
Frontend: React Native

Backend: Node.js, Express.js

Database: MongoDB Atlas

Authentication: Firebase Authentication

Maps & Location Services: Google Maps API, Geolocation API

Machine Learning: K-Means Clustering (for danger zone detection)

⚙️ How It Works

User Registration and Login through Firebase.

Save Emergency Contacts inside the app.

Detect Danger Zones from historical crime data using K-Means clustering.

Suggest Safe Route based on current location and danger zones.

Trigger SOS Alert during emergency with a single tap, sharing live location with contacts.

📈 Future Enhancements

Crowd-sourced unsafe location reporting.

Real-time crime updates from public APIs.

Advanced AI models for predicting new danger zones.

Full UI/UX redesign for production release.

🙌 Acknowledgements
Thanks to all researchers, open-data contributors, and community members who are striving to make the world a safer place.

"Empowering women to move freely and confidently through technology." 💙

