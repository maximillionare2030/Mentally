import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from "../utils/api/user_auth.js"; // Assuming getUserData is imported from the correct path

const Account = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Function to check and fetch user data
    const fetchUserData = async () => {
        const storedUserData = localStorage.getItem('userData');
        
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            const { currentJWT } = parsedUserData; // Extract the JWT from the stored data
            
            try {
                // Pass the JWT to the backend to get the updated user data
                const updatedData = await getUserData(currentJWT);
                
                if (updatedData) {
                    // If user data is retrieved, store it in localStorage and set state
                    localStorage.setItem('userData', JSON.stringify(updatedData));
                    setUserData(updatedData);
                } else {
                    // If no user data, navigate to the login page
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/');
            }
        } else {
            // If no stored user data, navigate to the login page
            navigate('/');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []); // Empty dependency array to run only once when component mounts

    if (!userData) {
        // Optionally render a loading spinner or message
        return <p>Loading...</p>;
    }

    // Destructure the values you want to display
    const { email, nickname, mental_health_data } = userData;
    const { surprise, disgust, happiness, PHQ_score, anger, sadness, fear } = mental_health_data;

    return (
        <div className="h-screen bg-gradient-to-b from-mint via-lightBlue to-darkBlue flex items-center justify-center">
            <div className="flex flex-col items-center justify-center mt-8 bg-white w-1/2 p-4 border-2 rounded-xl">
                <h1>Account Info</h1>
                <p>Email: {email}</p>
                <p>Nickname: {nickname}</p>
                <h2>Mental Health Data</h2>
                <ul>
                    <li>Surprise: {surprise}</li>
                    <li>Disgust: {disgust}</li>
                    <li>Happiness: {happiness}</li>
                    <li>PHQ Score: {PHQ_score}</li>
                    <li>Anger: {anger}</li>
                    <li>Sadness: {sadness}</li>
                    <li>Fear: {fear}</li>
                </ul>
            </div>
        </div>
    );
};

export default Account;
