const express = require('express');
const mongoose = require('mongoose');
const Contact = require('./models/contact');
const cors = require('cors');
require('dotenv').config(); 
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.error('MongoDB connection error:', err));
  app.get('/', (req, res) => {
    res.send('Server is up and running 🚀');
  });
  

  app.get('/api/contacts/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const userContacts = await Contact.findOne({ userId });
      res.json(userContacts?.contacts || []);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Add a new contact
  app.post('/api/contacts/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, phone, relation } = req.body;
   console.log("user id is:",userId)
    try {
      let userContacts = await Contact.findOne({ userId });
  
      if (!userContacts) {
        userContacts = new Contact({ userId:userId, contacts: [] });
      }
  
      userContacts.contacts.push({ name, phone, relation });
      await userContacts.save();
  
      res.status(201).json(userContacts.contacts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

    // Delete a contact
app.delete('/api/contacts/:userId/:contactId', async (req, res) => {
  const { userId, contactId } = req.params;
  
  try {
    const userContacts = await Contact.findOne({ userId });
    
    if (!userContacts) {
      return res.status(404).json({ error: "User contacts not found" });
    }
    
    // Find the index of the contact to delete
    const contactIndex = userContacts.contacts.findIndex(
      contact => contact._id.toString() === contactId
    );
    
    if (contactIndex === -1) {
      return res.status(404).json({ error: "Contact not found" });
    }
    
    // Remove the contact from the array
    userContacts.contacts.splice(contactIndex, 1);
    
    // Save the updated contacts
    await userContacts.save();
    
    res.json(userContacts.contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a contact
app.put('/api/contacts/:userId/:contactId', async (req, res) => {
  const { userId, contactId } = req.params;
  const { name, phone, relation } = req.body;
  
  try {
    const userContacts = await Contact.findOne({ userId });
    
    if (!userContacts) {
      return res.status(404).json({ error: "User contacts not found" });
    }
    
    // Find the index of the contact to update
    const contactIndex = userContacts.contacts.findIndex(
      contact => contact._id.toString() === contactId
    );
    
    if (contactIndex === -1) {
      return res.status(404).json({ error: "Contact not found" });
    }
    
    // Update the contact
    userContacts.contacts[contactIndex] = {
      ...userContacts.contacts[contactIndex],
      name,
      phone,
      relation
    };
    
    // Save the updated contacts
    await userContacts.save();
    
    res.json(userContacts.contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log("Server is running on port", PORT);
    console.log("Access the server at:", `http://192.168.233.247:${PORT}`);
  });
