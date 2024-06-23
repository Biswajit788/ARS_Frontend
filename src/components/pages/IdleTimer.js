import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the idle timeout period (10 minutes)
const IDLE_TIMEOUT = 1 * 60 * 1000;

const IdleTimer = () => {
    const navigate = useNavigate();
    const timeoutRef = useRef(null);
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
  
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(onIdle, IDLE_TIMEOUT);
    };
  
    const onIdle = () => {
      alert('You have been logged out due to inactivity.');
      localStorage.removeItem('authToken'); // Clear the token (or cookie)
      navigate('/sign-in'); // Redirect to login page
    };
  
    useEffect(() => {
      events.forEach((event) => window.addEventListener(event, resetTimeout));
      resetTimeout(); // Initialize the timeout
  
      return () => {
        events.forEach((event) => window.removeEventListener(event, resetTimeout));
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [events, resetTimeout]);
  
    return null;
  };  

export default IdleTimer