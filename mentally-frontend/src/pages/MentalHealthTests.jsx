import React, { useState, useEffect, useRef } from 'react';
import MCQ from "../components/mcq.jsx";
import data from "../utils/mental-health-tests.json";
import { useNavigate, useLocation } from 'react-router-dom';
import { generate_response } from '../utils/api/openai.js';
import { updateUserData } from '../utils/api/user_auth.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


const MentalHealthTests = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const testKey = state?.testKey;
    const questions = data["Mental-Health-Tests"][testKey]?.questions || [];

    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [testComplete, setTestComplete] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [fade, setFade] = useState(false);

    const [openAIResponse, setOpenAIresponse] = useState("");
    const scoreTestRef = useRef(0);

    const storedUserData = localStorage.getItem('userData');
    const userData = JSON.parse(storedUserData);
    const currentJWT = userData?.currentJWT;

    const handleResponseSelect = (key) => {
        const responseKeys = Object.keys(questions[questionIndex]?.responses || {});
        setSelectedIndex(key);
        setSelectedResponse(responseKeys[key]);
    };

    const handleOpenAIResponse = async (prompt) => {
        try {
            const response = await generate_response(prompt);
            setOpenAIresponse(response.response);
    
            // Prepare the data to update
            const dataToUpdate = {
                ...userData?.mentalHealthData, // Preserve existing data
                [testKey === "PHQ-9" ? "PHQ_score" : "BDI_score"]: scoreTestRef.current, // Dynamically update the right score
            };
            console.log("Front end:" , dataToUpdate)
    
            await handleUpdateUserData(dataToUpdate);
        } catch (error) {
            console.error("Error generating OpenAI response or updating user data:", error);
        }
    };
    
    const handleUpdateUserData = async (dataToUpdate) => {
        try {
            if (currentJWT) {
                console.log(dataToUpdate);
                await updateUserData(currentJWT, dataToUpdate);
            } else {
                console.warn("No valid JWT token found. Skipping user data update.");
            }
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    useEffect(() => {
        if (selectedIndex !== null) {
            setFade(true);

            const timer = setTimeout(() => {
                const selectedValue = questions[questionIndex]?.responses[selectedResponse];
                scoreTestRef.current += selectedValue || 0;

                setQuestionIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    if (nextIndex >= questions.length) {
                        setTestComplete(true);
                        handleOpenAIResponse(`${testKey}: ${scoreTestRef.current}`);
                    }
                    return nextIndex;
                });

                setSelectedIndex(null);
                setFade(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [selectedIndex, questionIndex, selectedResponse]);

    return (
        <div className="h-screen bg-gradient-to-b from-mint via-lightBlue to-darkBlue flex flex-col items-center">
            {/* Navbar */}
            <div className="w-full bg-white p-4 flex justify-between items-center shadow-lg mb-72">
                <div className="text-2xl font-semibold"></div>
                <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faSignOutAlt} className="cursor-pointer" onClick={() => navigate('/account')} />
                    <a href="/account" className="">Dashboard</a>
                </div>
            </div>

                
            <div className="w-1/2 p-8 bg-white items-center justify-center rounded-lg shadow-lg">
                        
               
                {!testComplete ? (
                    <>
                        <h2 className="font-semibold text-dimGrey text-center mb-8 text-gray-700">
                            {data["Mental-Health-Tests"][testKey]?.prompt}
                        </h2>
                        <MCQ
                            className={`transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'}`}
                            question={questions[questionIndex]?.question}
                            responses={Object.keys(questions[questionIndex]?.responses || {})}
                            onResponseSelect={handleResponseSelect}
                        />
                    </>
                ) : (
                    <div className="text-center transition-opacity duration-1000 opacity-100">
                        <h2 className="font-bold text-3xl text-gray-800 mb-4">Test Complete!</h2>
                        <p className="text-xl text-gray-700 mb-6">Your total score: {scoreTestRef.current}</p>

                        {openAIResponse ? (
                            <div className="space-y-4">
                                <p className="text-lg text-gray-800">{openAIResponse}</p>
                                <button 
                                    onClick={() => navigate('/account')} 
                                    className="w-1/4 bg-mint hover:bg-blue-700 font-semibold py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    Back To Home
                                </button>
                                <p className="text-xs text-gray-600 mt-4">Your results will be saved and added to your profile.</p>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center space-x-2 mt-6">
                                <div className="w-8 h-8 border-4 border-t-4 border-gray-500 border-solid rounded-full animate-spin"></div>
                                <span className="text-gray-700 text-lg">Loading response...</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentalHealthTests;
