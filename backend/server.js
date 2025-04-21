// backend/server.js

// 1. Import required modules
const express = require('express'); // Import the Express library
const cors = require('cors');       // Import the CORS library

// 2. Create an Express application instance
const app = express();

// 3. Define the port the server will run on
// Use the environment variable PORT if available (e.g., for deployment),
// otherwise default to port 3001
const PORT = process.env.PORT || 3001;

// --- In-Memory Storage ---
let messages = [
    // Let's add some initial example data for testing
    {
        id: 1,
        title: "Summer Kick-off Sale",
        description: "Get 15% off all summer items!",
        expiryDate: "2024-08-31", // Use YYYY-MM-DD format for consistency
        sentCount: 12
    },
    {
        id: 2,
        title: "Flash Deal (Expired)",
        description: "4-hour flash sale on electronics.",
        expiryDate: "2023-12-01",
        sentCount: 155
    }
];
let nextId = 3; // Start IDs after the initial data


// 4. Apply Middleware
// Enable CORS for all incoming requests
app.use(cors());
// Enable Express to parse JSON data in the request body
app.use(express.json());

// 5. Define a simple root route (optional, just for testing)
//app.get('/', (req, res) => {
//  res.send('Hello from the Promo Message API Backend!');
//});

// === API Endpoints ===

// GET /api/messages - Retrieve all messages with expiry status
app.get('/api/messages', (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/messages received`);
  
    const now = new Date(); // Get the current date and time
  
    // Create a new array where each message includes its expiry status
    const messagesWithStatus = messages.map(msg => {
      const expiry = new Date(msg.expiryDate); // Convert expiry string to Date object
      return {
        ...msg, // Copy all existing properties from the message
        isExpired: expiry < now // Add the 'isExpired' boolean property
      };
    });
  
    console.log(`[${new Date().toISOString()}] Sending ${messagesWithStatus.length} messages.`);
    res.status(200).json(messagesWithStatus); // Send the array as JSON with a 200 OK status
  });
  
  // --- Add other endpoints below ---
// POST /api/messages - Create a new message
app.post('/api/messages', (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/messages received`, req.body);
  
    // 1. Extract data from the request body
    const { title, description, expiryDate } = req.body;
  
    // 2. Basic Validation
    if (!title || !description || !expiryDate) {
      console.log(`[${new Date().toISOString()}] Validation failed: Missing fields.`);
      // Send an error response if any required field is missing
      return res.status(400).json({ error: 'Title, description, and expiryDate are required fields.' });
      // 400 Bad Request status indicates client error
    }
  
    // Optional: More validation (e.g., check if expiryDate is a valid date format) could go here
  
    // 3. Create the new message object
    const newMessage = {
      id: nextId++, // Assign the current nextId, then increment it
      title: title,
      description: description,
      expiryDate: expiryDate,
      sentCount: 0 // New messages always start with 0 sends
    };
  
    // 4. Add the new message to our in-memory array
    messages.push(newMessage);
  
    console.log(`[${new Date().toISOString()}] Message created:`, newMessage);
  
    // 5. Send the newly created message back as confirmation
    // 201 Created is the standard success status for creating a resource
    res.status(201).json(newMessage);
  });
  
  // --- Add other endpoints below ---
  // POST /api/messages/:id/send - Simulate sending a message (increment sentCount)
app.post('/api/messages/:id/send', (req, res) => {
    // 1. Extract the ID from the URL parameters
    const messageId = parseInt(req.params.id, 10); // req.params contains route parameters
                                                   // parseInt converts the string ID to a number
    console.log(`[${new Date().toISOString()}] POST /api/messages/${messageId}/send received`);
  
    // 2. Find the index of the message with the matching ID
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
  
    // 3. Handle case where message is not found
    if (messageIndex === -1) {
      console.log(`[${new Date().toISOString()}] Message with ID ${messageId} not found.`);
      // 404 Not Found is the standard status for resource not found
      return res.status(404).json({ error: `Message with id ${messageId} not found.` });
    }
  
    // Optional: Add logic here to prevent sending expired messages if desired
    // const now = new Date();
    // const expiry = new Date(messages[messageIndex].expiryDate);
    // if (expiry < now) {
    //   console.log(`[${new Date().toISOString()}] Attempted to send expired message ID ${messageId}.`);
    //   return res.status(400).json({ error: 'Cannot send an expired message.' });
    // }
  
    // 4. Increment the sentCount for the found message
    messages[messageIndex].sentCount += 1; // Or messages[messageIndex].sentCount++;
  
    const updatedMessage = messages[messageIndex];
    console.log(`[${new Date().toISOString()}] Message ID ${messageId} sentCount updated:`, updatedMessage);
  
    // 5. Send the updated message object back
    // Also include expiry status for consistency with GET response
    const now = new Date();
    const updatedMessageWithStatus = {
        ...updatedMessage,
        isExpired: new Date(updatedMessage.expiryDate) < now
    };
  
    res.status(200).json(updatedMessageWithStatus); // 200 OK is appropriate here
  });
  
  // --- End of API Endpoints ---
  

// 6. Start the server and listen for incoming connections
app.listen(PORT, () => {
  // This message will be printed to the console when the server starts successfully
  console.log(`Backend server is running and listening on http://localhost:${PORT}`);
});