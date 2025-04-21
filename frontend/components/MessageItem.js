// frontend/components/MessageItem.js
'use client'; // Needed if we add event handlers later, good practice here

import React from 'react';
import styles from './MessageItem.module.css'; // We'll create this CSS Module

// This component receives a single 'message' object as a prop
function MessageItem({ message, onSend }) {

  // Helper function to format the date (can be improved with libraries later)
  const formatDate = (dateString) => {
    try {
      // Create a Date object, assuming UTC if no timezone info is present
      // Adjust parsing if your dates have specific timezones
      const date = new Date(dateString + 'T00:00:00Z'); // Treat as UTC start of day
      // Format options can be adjusted
      return date.toLocaleDateString('en-CA', { // 'en-CA' often gives YYYY-MM-DD
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC' // Specify timezone for consistency
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid Date";
    }
  };

  const formattedExpiryDate = formatDate(message.expiryDate);

  // Handle the "Send" button click (will be implemented fully later)
  const handleSendClick = () => {
    // Check if the onSend prop is actually provided (good practice)
    if (onSend) {
      console.log(`MessageItem: Calling onSend for message ID: ${message.id}`);
      // Call the function passed down from the parent (app/page.js),
      // providing the ID of this specific message.
      onSend(message.id);
    } else {
      console.error("MessageItem: onSend prop is missing!");
    }
  };

  return (
    // Apply base style and conditional style for expired messages
    <div className={`${styles.item} ${message.isExpired ? styles.expired : styles.active}`}>
      <h4 className={styles.title}>{message.title}</h4>
      <p className={styles.description}>{message.description}</p>
      <div className={styles.meta}>
        <span>Expires: {formattedExpiryDate}</span>
        {/* Use the isExpired flag directly from the data */}
        <span>Status: {message.isExpired ? 'Expired' : 'Active'}</span>
        <span>Sent Count: {message.sentCount}</span>
      </div>
      <button
        className={styles.sendButton}
        onClick={handleSendClick}
        // Disable the button if the message is expired
        disabled={message.isExpired}
      >
        Simulate Send
      </button>
    </div>
  );
}

export default MessageItem;