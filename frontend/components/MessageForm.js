// frontend/components/MessageForm.js
'use client'; // Needed for useState and event handlers

import React, { useState } from 'react';
import styles from './MessageForm.module.css'; // We'll create this CSS Module

// This component receives an 'onCreate' function as a prop
function MessageForm({ onCreate }) {
  // State for each input field
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // State for managing submission status and errors within the form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(''); // Form-specific error message

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default browser page reload
    setError(''); // Clear previous form errors

    // Basic validation
    if (!title.trim() || !description.trim() || !expiryDate) {
      setError('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true); // Indicate submission is in progress

    // Prepare the data object to send
    const newMessageData = {
      title,
      description,
      expiryDate // Should be in YYYY-MM-DD format from the input type="date"
    };

    // Call the function passed from the parent component (app/page.js)
    // The parent function will handle the actual API call
    const success = await onCreate(newMessageData);

    setIsSubmitting(false); // Submission attempt finished

    if (success) {
      // Clear the form fields if the parent indicates success
      setTitle('');
      setDescription('');
      setExpiryDate('');
      console.log("MessageForm: Fields cleared after successful creation.");
    } else {
      // The parent component (app/page.js) should handle displaying
      // API-related errors. We can set a generic form error here if needed.
      setError('Failed to create message. Check console or page errors.');
      console.log("MessageForm: Creation failed (indicated by parent).");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Create New Promo Message</h3>
      {/* Display form-specific error messages */}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.formGroup}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          // Update state whenever the input value changes
          onChange={(e) => setTitle(e.target.value)}
          required // Basic HTML5 validation
          disabled={isSubmitting} // Disable input while submitting
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="expiryDate">Expiry Date:</label>
        <input
          type="date" // Use the native date picker input
          id="expiryDate"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? 'Creating...' : 'Create Message'}
      </button>
    </form>
  );
}

export default MessageForm; // <-- Make sure to export the component