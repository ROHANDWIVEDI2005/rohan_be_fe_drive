// frontend/app/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import styles from './page.module.css';
import MessageItem from '../components/MessageItem';
import MessageForm from '../components/MessageForm'; // <-- Import the new component

const API_BASE_URL = 'http://localhost:3001/api';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Rename error state to be more specific, e.g., listError
  const [listError, setListError] = useState(null);

  // --- Fetch Messages Function (Using useCallback) ---
  // Wrap fetchMessages in useCallback to ensure it has a stable identity
  // unless its dependencies change (which are none here).
  const fetchMessages = useCallback(async () => {
    console.log("Frontend: Fetching messages...");
    setIsLoading(true);
    setListError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/messages`);
      if (!response.ok) {
        throw new Error(`Network response was not ok (Status: ${response.status})`);
      }
      const data = await response.json();
      setMessages(data);
      console.log("Frontend: Messages fetched successfully:", data);
    } catch (err) {
      console.error("Frontend: Error fetching messages:", err);
      setListError(`Failed to load messages: ${err.message}. Is the backend running?`);
      setMessages([]);
    } finally {
      setIsLoading(false);
      console.log("Frontend: Fetch attempt finished.");
    }
  }, []); // Empty dependency array: function is created once

  // --- Initial Fetch Effect ---
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]); // Depend on the stable fetchMessages function

  // --- Handle Message Creation (Function to pass to MessageForm) ---
  const handleCreateMessage = async (newMessageData) => {
    console.log("Frontend: Attempting to create message...", newMessageData);
    // Clear previous list errors before trying to create
    setListError(null);
    // Optionally set a specific 'isCreating' state if needed for global UI feedback

    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessageData), // Send data as JSON string
      });

      if (!response.ok) {
        // Try to get error details from backend response body
        const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.error || `Failed to create message.`);
      }

      // Success!
      console.log("Frontend: Message created successfully via API.");
      // Refresh the list to show the new message
      await fetchMessages(); // Re-fetch the entire list
      return true; // Indicate success to the MessageForm

    } catch (err) {
      console.error("Frontend: Error creating message:", err);
      // Set the list error state to display the error near the list/form
      setListError(`Error creating message: ${err.message}`);
      return false; // Indicate failure to the MessageForm
    }
    // Optionally reset 'isCreating' state here if used
  };

  // --- TODO: Implement handleSendMessage function later ---
  const handleSendMessage = async (id) => {
    console.log(`Frontend: Attempting to send message ID ${id}...`);
    // Clear previous list errors before trying to send
    setListError(null);
    // Optional: Set a specific 'isSending' state for the specific item if needed
  
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${id}/send`, {
        method: 'POST',
        // No body or Content-Type header needed for this specific POST request
      });
  
      if (!response.ok) {
        // Try to get error details from backend response body
        const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.error || `Failed to send message.`);
      }
  
      // Get the updated message data from the response body
      const updatedMessage = await response.json();
      console.log("Frontend: Message send simulated successfully, updated data:", updatedMessage);
  
      // --- Update the state ---
      // Find the message in the current state and update its sentCount
      // and isExpired status (in case the backend recalculates it)
      setMessages(currentMessages =>
        currentMessages.map(msg =>
          msg.id === id ? updatedMessage : msg // Replace the old message with the one from the API response
        )
      );
      // Return true or the updated message if needed elsewhere
      return true;
  
    } catch (err) {
      console.error(`Frontend: Error sending message ID ${id}:`, err);
      // Set the list error state to display the error near the list
      setListError(`Error sending message: ${err.message}`);
      // Return false or error if needed elsewhere
      return false;
    }
    // Optionally reset 'isSending' state here if used
  };

  return (
    <main className={styles.main}>
      <h1>Promo Message Tool</h1>

      {/* --- Render the MessageForm component --- */}
      {/* Pass the handleCreateMessage function as the 'onCreate' prop */}
      <MessageForm onCreate={handleCreateMessage} />
      {/* Display list-related errors (like creation failure) above the list */}
      {listError && !isLoading && <p style={{ color: 'red', marginTop: '15px' }}>{listError}</p>}


      <hr />
      <h2>Messages List</h2>

      {isLoading ? (
        <p>Loading messages...</p>
      // Use listError here now
      ) : listError && messages.length === 0 ? ( // Only show fetch error if list is empty
         <p style={{ color: 'red' }}>{listError}</p>
      ) : messages.length > 0 ? (
        <div>
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              // Pass handleSendMessage down (still placeholder)
              onSend={handleSendMessage}
            />
          ))}
        </div>
      ) : (
         <p>No messages found.</p> // Shown if loading is done, no error, empty list
      )}
    </main>
  );
}