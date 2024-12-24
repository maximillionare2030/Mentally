import React, { useState, useEffect, useRef } from 'react';
import MCQ from "../components/mcq.jsx";
import data from "../utils/mental-health-tests.json";
import { useNavigate, useLocation } from 'react-router-dom';
import { generate_response } from '../utils/api/openai.js';
import { updateUserData } from '../utils/api/user_auth.js';

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
    const scoreTestRef = useRef(0); // Use ref to store score and avoid issues with async state updates

    const storedUserData = localStorage.getItem('userData'); // Intern user Data, using it for currentJWT
    const userData = JSON.parse(storedUserData);
    const currentJWT = userData.currentJWT;

    // Handle response selection
    const handleResponseSelect = (key) => {
        const responseKeys = Object.keys(questions[questionIndex]?.responses || {});
        setSelectedIndex(key);
        setSelectedResponse(responseKeys[key]);
    };

    // Handle OpenAI response
    const handleOpenAIResponse = async (prompt) => {
        const OpenAIResponse = await generate_response(prompt);
        setOpenAIresponse(OpenAIResponse.response);

        if (testKey === "PHQ-9") {
            // Access the current score value from scoreTestRef
            let PHQ_score = scoreTestRef.current; // Correctly access the current value
        
            // Prepare the data to update with the PHQ_score
            const dataToUpdate = { PHQ_score };
        
            // Call updateUserData with the currentJWT and dataToUpdate
            const updateDataResponse = await updateUserData(currentJWT, dataToUpdate);
            
        }
        
    };

    // Update score and move to next question
    useEffect(() => {
        if (selectedIndex !== null) {
            setFade(true);

            const timer = setTimeout(() => {
                // Update the score using scoreTestRef to make sure the correct value is used
                const selectedValue = questions[questionIndex]?.responses[selectedResponse];
                scoreTestRef.current += selectedValue; // Directly modify ref value

                // Move to the next question
                setQuestionIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1;
                    if (nextIndex >= questions.length) {
                        setTestComplete(true);
                        // Send the final score to OpenAI after the test is complete
                        handleOpenAIResponse(`${testKey} : ${scoreTestRef.current}`);
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
        <div className="h-screen bg-gradient-to-b from-mint via-lightBlue to-darkBlue flex items-center justify-center">
            <div className="w-1/2 p-8 bg-white rounded-lg shadow-lg">
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
                
                    {/* Show loading spinner if the response is still being fetched */}
                    {openAIResponse ? (
                        <div className="space-y-4">
                            <p className="text-lg text-gray-800">{openAIResponse}</p>
                
                            {/* Back to Home Button */}
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
