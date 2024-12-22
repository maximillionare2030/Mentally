import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from "../utils/api/user_auth.js"; // Assuming getUserData is imported from the correct path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Account = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        const storedUserData = localStorage.getItem('userData');
        
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            const { currentJWT } = parsedUserData;
            
            try {
                const updatedData = await getUserData(currentJWT);
                
                if (updatedData) {
                    localStorage.setItem('userData', JSON.stringify(updatedData));
                    setUserData(updatedData);
                } else {
                    setError('User data could not be fetched');
                    navigate('/');
                }
            } catch (error) {
                setError('An error occurred while fetching user data');
                navigate('/');
            } finally {
                setLoading(false);
            }
        } else {
            setError('No user data found, please log in');
            navigate('/');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const { email, nickname, mental_health_data } = userData;
    const { surprise, disgust, happiness, PHQ_score, anger, sadness, fear } = mental_health_data;

    const scrollToInstructions = () => {
        const instructionsSection = document.getElementById('instructions');
        instructionsSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
        <div className="min-h-screen bg-gradient-to-b from-lavendar via-lightBlue to-mint flex flex-col items-center py-10">
            {/* Navbar */}
            <div className="w-full bg-white p-4 flex justify-between items-center shadow-lg">
                <div className="text-2xl font-semibold">
                    <FontAwesomeIcon icon={faUser} /> <span>{nickname}</span>
                </div>
                <div>
                    <h1 className="font-semibold">Mentally</h1>
                </div>
                <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faSignOutAlt} className="cursor-pointer" onClick={() => navigate('/')} />
                    <a href="/account" className="">Dashboard</a>
                </div>
            </div>

            {/* Mental Health Data Section */}
            <div className="flex justify-center mt-8 gap-6 px-4 w-full max-w-6xl">
    
                {/* Left Section: PHQ Score */}
                <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 relative group">
                    <h3 className="text-xl font-semibold text-center mb-4">PHQ Score</h3>
                    <div className="text-center">
                        <p className="text-2xl">{PHQ_score}</p>
                    </div>
                    <div className="absolute inset-0 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center text-black text-lg p-4 transition-opacity">
                        <p className="text-xs">The PHQ score helps to assess depression severity based on a series of questions.</p>
                    </div>
                </div>

                {/* Right Section: Ekman's Emotions */}
                <div className="w-full sm:w-1/2 lg:w-2/3 xl:w-3/4 grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {[
                        { label: "Surprise", value: surprise, description: "A feeling of shock or amazement." },
                        { label: "Disgust", value: disgust, description: "A strong sense of revulsion or distaste." },
                        { label: "Happiness", value: happiness, description: "A state of feeling joy or pleasure." },
                        { label: "Anger", value: anger, description: "A strong feeling of displeasure or rage." },
                        { label: "Sadness", value: sadness, description: "A state of sorrow or unhappiness." },
                        { label: "Fear", value: fear, description: "An emotion induced by perceived danger or threat." }
                    ].map(({ label, value, description }, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 relative group"
                        >
                            <h3 className="text-xl font-semibold text-center mb-4">{label}</h3>
                            <div className="text-center">
                                <p className="text-2xl">{value}</p>
                            </div>
                            <div className="absolute inset-0 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center text-black text-lg p-4 transition-opacity">
                                <p className="text-xs">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insights Section */}
            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 bg-white p-6 rounded-lg shadow-lg mt-8 flex justify-center items-center">
                <p className="text-lg">Insights will be displayed here.</p>
            </div>

            {/* Scroll Button */}
            <button
                className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg"
                onClick={scrollToInstructions}
            >
                Scroll to Instructions
            </button>

        </div>
             <div className="min-h-screen bg-gradient-to-b from-mint via-lightBlue to-lavendar flex flex-col items-center py-10">
                {/* Instructions Section */}
                <div id="instructions" className="mt-16 p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">How to Use the App</h2>
            <p>Here you can provide instructions for how to use the app, guiding the user through the features and steps for utilizing the mental health insights.</p>
            </div>
            </div>
        </>
    );
};

export default Account;
