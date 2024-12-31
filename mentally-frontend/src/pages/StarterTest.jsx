import React, { useState, useEffect } from 'react';
import MCQ from "../components/mcq.jsx";
import data from "../utils/mental-health-tests.json";
import { signUp } from "../utils/api/user.js";
import { useNavigate, Link } from 'react-router-dom'; 

const StarterTest = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [testComplete, setTestComplete] = useState(false);
    const [scorePHQ, setScorePHQ] = useState(0);
    const [fade, setFade] = useState(false);

    // Initialize the navigate function
    const navigate = useNavigate();

    const handleResponseSelect = (index) => {
        setSelectedIndex(index);  // Update the selected index when a response is selected
    };


    useEffect(() => {
        if (selectedIndex !== null) {
            // Trigger fade animation
            setFade(true);

            const time = setTimeout(() => {
                try {
                    setScorePHQ(scorePHQ + selectedIndex);
                    setQuestionIndex((prevIndex) => {
                        const newIndex = prevIndex + 1;

                        // Check if it's the last question
                        if (newIndex >= data["Mental-Health-Tests"]["PHQ-9"]["questions"].length) {
                            setTestComplete(true);
                        }

                        return newIndex;
                    });
                    setSelectedIndex(null);
                    setFade(false);  // Reset fade state after transition
                } catch (error) {
                    setTestComplete(true);
                }
            }, 500);

            return () => clearTimeout(time); 
        }
    }, [selectedIndex, scorePHQ]);

    const responsesArray = questionIndex < data["Mental-Health-Tests"]["PHQ-9"]["questions"].length
        ? Object.keys(data["Mental-Health-Tests"]["PHQ-9"]["questions"][questionIndex]["responses"])
        : [];

    return (
        <div className="h-screen bg-gradient-to-b from-mint via-lightBlue to-darkBlue flex items-center justify-center">
            <div className={`w-1/2 p-8 bg-white rounded-lg shadow-lg`}>
                {!testComplete && (
                    <>
                        <h2 className="font-semibold text-dimGrey text-center mb-8 text-gray-700">
                            {data["Mental-Health-Tests"]["PHQ-9"]?.prompt}
                        </h2>
                        {responsesArray.length > 0 && (
                            <div>
                                <MCQ
                                    className={`transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'}`}
                                    question={data["Mental-Health-Tests"]["PHQ-9"]["questions"][questionIndex]["question"]}
                                    responses={responsesArray}
                                    onResponseSelect={handleResponseSelect}  // Pass callback to child 
                                />
                            </div>
                        )}
                    </>
                )}
                {testComplete && (
                    <div 
                        className={"flex flex-col items-center justify-center mt-8 transition-opacity duration-2000 ${fade ? 'opacity-0' : 'opacity-100'}"}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                            Sign Up to Get Your Score!
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            Join us today to gain insights, track your progress, and improve your well-being.
                        </p>
                        <div className="w-full max-w-md">
                            <Link 
                                to={`/signup?PHQ_score=${scorePHQ}`} // Passing PHQ_score as a query parameter
                            >
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                >
                                    Join Us Today!
                                </button>
                            </Link>
                        </div>
                        <p className="text-gray-600 text-sm mt-4">
                            Already have an account?{" "}
                            <a 
                                href="/login" 
                                className="text-blue-500 hover:underline"
                            >
                                Log in
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StarterTest;
