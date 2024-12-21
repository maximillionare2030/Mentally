import React, { useState, useEffect } from 'react';
import { signUp } from "../utils/api/user_auth.js";
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom


const SignUpForm = () => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpStatus, setSignUpStatus] = useState('');

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

    return (
        <div className="h-screen bg-gradient-to-b from-mint via-lightBlue to-darkBlue flex items-center justify-center">
              <div className="flex flex-col items-center justify-center mt-8 bg-white w-1/2 p-4 border-2 rounded-xl">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                            Sign Up
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
                            href="/login" 
                            className="text-blue-500 hover:underline"
                            >
                                Log in
                            </a>
                        </p>
                    </div>
        </div>
    )

}


export default SignUpForm;