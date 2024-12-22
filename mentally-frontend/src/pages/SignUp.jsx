import React, { useState, useEffect } from 'react';
import { signUp, logIn, getUserData, updateUserData } from "../utils/api/user_auth.js";
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate from react-router-dom

const SignUpForm = () => {
    const navigate = useNavigate();
    const location = useLocation();  // Get location object using useLocation hook
    // Get query parameters using URLSearchParams
    const queryParams = new URLSearchParams(location.search);
    const PHQ_score = queryParams.get('PHQ_score');

    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUpStatus, setSignUpStatus] = useState('');
    const [isFormValid, setIsFormValid] = useState(false); // Track form validity

    useEffect(() => {
        // Validate the form whenever any input changes
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordMinLength = 6; // Password should be at least 6 characters
        const isValid = emailRegex.test(email) && nickname && password.length >= passwordMinLength;
        setIsFormValid(isValid);
    }, [email, nickname, password]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log('SignUp process started');
    
        try {
            console.log('Sending sign-up request...');
            const signUpResponse = await signUp(nickname, email, password);
            console.log('Sign-up response:', signUpResponse);
    
            if (signUpResponse.message === "User account created successfully") {
                console.log("Sign-up successful, proceeding to log in...");
    
                const logInResponse = await logIn(email, password);
                console.log('Log-in response:', logInResponse);
    
                if (!logInResponse?.token) {
                    throw new Error("Login failed: No token received.");
                }
    
                if (PHQ_score) {
                    console.log('Updating mental health data with PHQ_score:', PHQ_score);
                    const updateResponse = await updateUserData(logInResponse.token, { PHQ_score });
                    console.log('Mental health data updated successfully:', updateResponse);
                }
    
                console.log('Fetching user data...');
                const userData = await getUserData(logInResponse.token);
                console.log('User data retrieved:', userData);
    
                localStorage.setItem('userData', JSON.stringify(userData));
                console.log('User data saved to localStorage');
    
                navigate('/account', { state: { userData } });
                console.log('Navigation to /account completed');
            } else if (typeof signUpResponse === "string") {
                setSignUpStatus(signUpResponse);
            } else if (typeof signUpResponse === "object" && signUpResponse.message) {
                setSignUpStatus(signUpResponse.message);
            } else {
                setSignUpStatus("An unexpected error occurred during sign-up.");
            }
        } catch (error) {
            console.error('Error during sign-up process:', error);
            setSignUpStatus(error.message || "Unknown error occurred");
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
                    <form className="space-y-4" onSubmit={handleSignUp}>
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
                        <p className="text-xs text-center">{signUpStatus}</p>
                        <button
                            type="submit"
                            className={`w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!isFormValid}
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
    );
};

export default SignUpForm;
