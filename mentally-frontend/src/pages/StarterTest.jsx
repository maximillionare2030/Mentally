import React, { useState, useEffect } from 'react';
import MCQ from "../components/mcq.jsx";
import data from "../utils/mental-health-tests.json";
import { signUp} from "../utils/api/user_auth.js";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const StarterTest = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [testComplete, setTestComplete] = useState(false);
    const [scorePHQ, setScorePHQ] = useState(0);
    const [fade, setFade] = useState(false);

    // User data hooks
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpStatus, setSignUpStatus] = useState('');

    // Initialize the navigate function
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log('SignUp working');
        try {
            const message = await signUp(nickname, email, password);
            setSignUpStatus(message);

            // After successful signup, navigate to /account page
            if (message === "Successfully signed up") {
                navigate("/account");  // Redirect to /account
            }
        } catch (error) {
            setSignUpStatus("Error signing up: " + error.message);
        }
    };

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
                        if (newIndex >= data["PHQ-9"]["items"].length) {
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

    const responsesArray = questionIndex < data["PHQ-9"]["items"].length
        ? Object.keys(data["PHQ-9"]["items"][questionIndex]["responses"])
        : [];

    return (
        <div className="h-screen bg-gradient-to-b from-mint via-lightBlue to-darkBlue flex items-center justify-center">
            <div className={`w-1/2 p-8 bg-white rounded-lg shadow-lg`}>
                {!testComplete && (
                    <>
                        <h2 className="font-semibold text-dimGrey text-center mb-8 text-gray-700">{data["PHQ-9"]["question"]}</h2>
                        {responsesArray.length > 0 && (
                            <div>
                                <MCQ
                                    className={`transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'}`}
                                    question={data["PHQ-9"]["items"][questionIndex]["question"]}
                                    responses={responsesArray}
                                    onResponseSelect={handleResponseSelect}  // Pass callback to child 
                                />
                            </div>
                        )}
                    </>
                )}
                {testComplete && (
                    <div className="flex flex-col items-center justify-center mt-8">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                            Sign Up to Get Your Score!
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                            Join us today to gain insights, track your progress, and improve your well-being.
                        </p>
                        <div className="w-full max-w-md">
                            <form className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                               <input
                                    type="text"
                                    placeholder="Enter a nickname"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className='text-xs text-center'>{signUpStatus}</p>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                    onClick={handleSignUp}
                                >
                                    Sign Up
                                </button>
                            </form>
                        </div>
                        <p className="text-gray-600 text-sm mt-4">
                            Already have an account?{" "}
                            <a 
                            href="#" 
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
