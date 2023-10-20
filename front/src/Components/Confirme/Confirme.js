import React, { useState, useEffect } from 'react';
import './confirme.css'; 
import axios from "axios";

const EmailConfirmationBar = () => {
    const [daysRemaining, setDaysRemaining] = useState(15);
    const [user, setUser] = useState({});
    const [apiCallCompleted, setApiCallCompleted] = useState(false);

    const fetchData = async () => {
        try {
          // Get the token from localStorage
          const token = localStorage.getItem('token');
      
          // Create headers with the token
          const headers = {
            headers: {
              'token': token,
            },
          };
      
          // Make a GET request to your back-end endpoint with the headers
          const response = await axios.get('http://localhost:3001/users/getDaysRemaining', headers);
          setDaysRemaining(response.data.daysRemaining);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
    const getUser = () => {
      const token = localStorage.getItem("token");
      const headers = {
        headers: {
          token: token,
        },
      };
  
      axios.get(`http://localhost:3001/users/getUser`, headers)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        })
    };

    useEffect(() => {
      fetchData();
      getUser();
    }, []);
    
    useEffect(() => {
      // Delay the rendering for 2 seconds (adjust as needed)
      const timer = setTimeout(() => {
        setApiCallCompleted(true);
      }, 250); // Adjust the delay time as needed

      return () => clearTimeout(timer);
    }, []);

    // Wait for the API call and delay before rendering the email confirmation bar
    if (!apiCallCompleted || daysRemaining === 16) {
      return null; // You can show a loading spinner here if you want
    } 
    else {
      return (
        // Conditionally render based on user.isVerified
        !user.isVerified ? (
          <div className="email-confirmation-bar">
            <div className="email-confirmation-text">
              Vous devez confirmer votre adresse e-mail avant {daysRemaining} {daysRemaining === 1 ? 'jour' : 'jours'}. Sinon, votre compte sera automatiquement supprimé, et vous perdrez toutes vos données.
            </div>
          </div>
        ) : null
      );
    }
};

export default EmailConfirmationBar;
