import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from "../utils/api/user.js"; // Assuming getUserData is imported from the correct path
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { updateUserData, getUserHistory } from '../utils/api/user.js';

import { Fragment } from 'react';  // Add this import
import { Menu, Transition} from '@headlessui/react';

import data from "../utils/mental-health-tests.json";

import UserCalendar from "../components/ui/calendar.jsx";
import LineGraph from '../components/ui/linegraph.jsx';


const Account = () => {

    const mentalHealthTests = data['Mental-Health-Tests'];
    const emotionTests = data['EKMAN-EMOTIONS'];
    const [userData, setUserData] = useState(null);
    const [userHistory, setUserHistory] = useState(null);
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

    const fetchUserHistory = async () => {
        const history = await getUserHistory(userData?.user_id);
        setUserHistory(history?.snapshot_doc);
        console.log(userHistory);
    }
    


    // Trigger the user data fetch first
    useEffect(() => {
        fetchUserData();
    }, []);  // Runs once when the component mounts

    // Trigger the user history fetch once userData is available
    useEffect(() => {
        if (userData) {
            fetchUserHistory();  // Fetch user history only after userData is set
        }
    }, [userData]);  // Runs when userData is updated

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

    const { user_id, email, nickname, mental_health_data } = userData;
    const { surprise, disgust, happiness, BDI_score, PHQ_score, anger, sadness, fear } = mental_health_data;

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
    
                {/* Left Section: Mental Health Test Scores */}
                <div className="w-1/2 flex justify-around gap-4">
                    <div className="flex-1 max-w-xs bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 relative group">
                        <h3 className="text-xl font-semibold text-center mb-4">PHQ Score</h3>
                        <div className="text-center">
                            <p className="text-2xl">{PHQ_score}</p>
                        </div>
                        <div className="absolute inset-0 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center text-black text-lg p-4 transition-opacity">
                            <p className="text-xs">The PHQ score helps to assess depression severity based on a series of questions.</p>
                        </div>
                    </div>
                    <div className="flex-1 max-w-xs bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 relative group">
                        <h3 className="text-xl font-semibold text-center mb-4">Beckman's Inventory Score</h3>
                        <div className="text-center">
                            <p className="text-2xl">{BDI_score}</p>
                        </div>
                        <div className="absolute inset-0 bg-white bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center text-black text-lg p-4 transition-opacity">
                            <p className="text-xs">The Beckman score helps to assess depression severity based on a series of questions.</p>
                        </div>
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

{/** BUTTONS FOR ASSESSMENTS --- */}
            {/* Take Assessments Section */}
            <div className="flex flex-row justify-center w-full gap-4 mt-8">
            <Menu as="div" className="relative">
                <Menu.Button className="bg-clay px-6 py-3 rounded-lg shadow-md hover:bg-dimGrey focus:outline-none focus:ring-2 focus:ring-grey-400 transition-all duration-200 ease-in-out z-10">
                    Take Mental Health Assessments
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition-transform ease-out duration-300"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition-transform ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="menu-items fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 max-h-screen overflow-y-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                        <div className="p-4">
                            <h3 className="text-center text-lg font-semibold">Mental Health Tests</h3>
                            {Object.keys(mentalHealthTests).map((testKey) => (
                                <Menu.Item key={testKey}>
                                    {({ active }) => (
                                        <div className="group">
                                            <a
                                                onClick={() => navigate(`/user-tests/`, { state: { testKey } })}
                                                className={`block px-4 py-2 text-sm transition-colors duration-200 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'} cursor-pointer`}
                                            >
                                                {testKey}
                                            </a>

                                            {active && (
                                                <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-gray-500">
                                                    {mentalHealthTests[testKey]["description"]}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </Menu.Item>
                            ))}
                            <p className="text-center text-xs mt-8 text-gray-600">
                                <i>Clinically-proven tests that assess different components of your mental health</i>
                            </p>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>

            <Menu as="div" className="relative">
                <Menu.Button className="bg-mint px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 ease-in-out z-0">
                    Evaluate Emotions
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition-transform ease-out duration-300"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition-transform ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="menu-items fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 max-h-screen overflow-y-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                        <div className="p-4">
                            <h3 className="text-center text-lg font-semibold">Ekman's Emotions</h3>
                            {Object.keys(emotionTests).map((testKey) => (
                                <Menu.Item key={testKey}>
                                    {({ active }) => (
                                        <div className="group">
                                            <a
                                                onClick={() => navigate(`/emotion-tests/`, { state: { testKey } })}
                                                className={`block px-4 py-2 text-sm transition-colors duration-200 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'} cursor-pointer`}
                                            >
                                                {testKey}
                                            </a>

                                            {active && (
                                                <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-gray-500">
                                                    {emotionTests[testKey]["description"]}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </Menu.Item>
                            ))}
                            <p className="text-center text-xs mt-8 text-gray-600">
                                <i>Award-winning Pyschologic, Paul Ekman's, six key emotions that he uses to assess the human psyche</i>
                            </p>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>


                <button 
                     onClick={() => navigate(`/chat-bot`)}
                    className="bg-lavendar px-6 py-3 rounded-lg shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400">
                    AI Insights
                </button>
            </div>


            {/* Scroll Button */}
            <button
                className="mt-8 px-6 py-2 bg-white rounded-lg"
                onClick={scrollToInstructions}
            >
                ↓    Instructions ↓
            </button>


            {/* Insights Section */}
            <div className="mt-8  mb-8 px-4 w-3/4 min-h-[300px] bg-white border-2 rounded-lg shadow-lg">
            {/* Top Section: User Calendar */}
            <div className="w-full mb-6 flex justify-center">
                {userHistory ? (
                <UserCalendar history={userHistory} />
                ) : (
                <div className="text-gray-500">Loading user history...</div>
                )}
            </div>

            {/* Bottom Section: Line Graph */}
            <div className="w-full flex justify-center">
                {userHistory ? (
                <LineGraph data={userHistory} />
                ) : (
                <div className="text-gray-500">Loading user history...</div>
                )}
            </div>
            </div>

        

        </div>
        <div className="min-h-screen bg-gradient-to-b from-mint via-lightBlue to-lavendar flex flex-col items-center py-10">
            {/* Instructions Section */}
            <div id="instructions" className="mt-16 p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">How to Use Mentally</h2>
                <p className="mb-4">
                    Mentally is your companion for tracking and improving mental health. Start by taking <b>daily mental health tests based on PHQ (Patient Health Questionnaire) and other clinical studies and standards.</b> The PHQ-2 provides a quick screening for depression, while the more detailed PHQ-9 assesses severity and helps monitor progress over time. The test is most effective when taken bi-weekly.
                </p>
                <p className="mb-4">
                    Mentally also tracks <b>six key emotions as defined by Paul Ekman</b>: <i>fear, sadness, anger, surprise, happiness, and disgust</i>. These emotions provide valuable insights into your mental state and are used alongside PHQ scores to <b>create a comprehensive mental health profile</b>.
                </p>
                <p className="mb-4">
                    For deeper understanding and tailored advice, <b>Mentally's AI therapist offers personalized insights and recommendations</b>. Whether you're looking to reduce stress, improve emotional resilience, or simply understand yourself better, the app guides you every step of the way.
                </p>
                <p className="text-sm italic">
                    Take charge of your mental health journey with Mentally. Track your emotions, gain valuable insights, and build a happier, healthier future.
                </p>
            </div>

            <div id="scoring-instructions" className="mt-16 p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Interpreting Beckman's Depression Inventory</h2>

                
                <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-b py-2 px-4 text-left">Total Score</th>
                            <th className="border-b py-2 px-4 text-left">Levels of Depression</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-b py-2 px-4">1-10</td>
                            <td className="border-b py-2 px-4">These ups and downs are considered normal</td>
                        </tr>
                        <tr>
                            <td className="border-b py-2 px-4">11-16</td>
                            <td className="border-b py-2 px-4">Mild mood disturbance</td>
                        </tr>
                        <tr>
                            <td className="border-b py-2 px-4">17-20</td>
                            <td className="border-b py-2 px-4">Borderline clinical depression</td>
                        </tr>
                        <tr>
                            <td className="border-b py-2 px-4">21-30</td>
                            <td className="border-b py-2 px-4">Moderate depression</td>
                        </tr>
                        <tr>
                            <td className="border-b py-2 px-4">31-40</td>
                            <td className="border-b py-2 px-4">Severe depression</td>
                        </tr>
                        <tr>
                            <td className="border-b py-2 px-4">Over 40</td>
                            <td className="border-b py-2 px-4">Extreme depression</td>
                        </tr>
                    </tbody>
                </table>

                <h2 className="text-2xl font-semibold mb-4">Interpreting the Patient Health Questionnaire (PHQ-9)</h2>
                
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-b py-2 px-4 text-left">Total Score</th>
                            <th className="border-b py-2 px-4 text-left">Levels of Depression</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-b py-2 px-4">0–4</td>
                            <td className="border-b py-2 px-4">No or minimal depression</td>
                        </tr>
                        <tr>
                            <td className="border-b py-2 px-4">5–9</td>
                            <td className="border-b py-2 px-4">Mild depression</td>
                        </tr>
                        <tr>
                            <td className="border-b py-2 px-4">10–14</td>
                            <td className="border-b py-2 px-4">Moderate depression</td>
                        </tr>
                        <tr>
                            <td className="border-b py-2 px-4">15–19</td>
                            <td className="border-b py-2 px-4">Moderately severe depression</td>
                        </tr>
                        <tr>
                            <td className="border-b py-2 px-4">20–27</td>
                            <td className="border-b py-2 px-4">Severe depression</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <section id="ekman-instructions" className="mt-16 p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800">Ekman's Emotions and Depression</h2>
                <p className="mt-4 text-gray-700">
                    Dr. Paul Ekman, a renowned psychologist, identified six basic emotions that are universally recognized across cultures:
                    happiness, sadness, surprise, fear, anger, and disgust. These emotions are crucial for understanding human expression
                    and behavior, particularly in the context of mental health.
                </p>
                <p className="mt-4 text-gray-700">
                    Depression can manifest through a variety of emotional expressions, and understanding these can be helpful for assessing
                    emotional well-being. Below is a guide to how levels of depression might correlate with Ekman's emotional expressions.
                </p>
                
                <div className="mt-8">
                    <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                        <th className="border-b py-2 px-4 text-left font-semibold text-gray-700">Total Score</th>
                        <th className="border-b py-2 px-4 text-left font-semibold text-gray-700">Levels of Depression</th>
                        <th className="border-b py-2 px-4 text-left font-semibold text-gray-700">Associated Emotions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-50">
                        <td className="border-b py-2 px-4">0-10</td>
                        <td className="border-b py-2 px-4">No Depression</td>
                        <td className="border-b py-2 px-4">Happiness, Surprise</td>
                        </tr>
                        <tr>
                        <td className="border-b py-2 px-4">11-20</td>
                        <td className="border-b py-2 px-4">Mild Depression</td>
                        <td className="border-b py-2 px-4">Sadness, Disgust</td>
                        </tr>
                        <tr className="bg-gray-50">
                        <td className="border-b py-2 px-4">21-30</td>
                        <td className="border-b py-2 px-4">Moderate Depression</td>
                        <td className="border-b py-2 px-4">Fear, Sadness</td>
                        </tr>
                        <tr>
                        <td className="border-b py-2 px-4">31-40</td>
                        <td className="border-b py-2 px-4">Severe Depression</td>
                        <td className="border-b py-2 px-4">Anger, Sadness</td>
                        </tr>
                        <tr className="bg-gray-50">
                        <td className="border-b py-2 px-4">41+</td>
                        <td className="border-b py-2 px-4">Extreme Depression</td>
                        <td className="border-b py-2 px-4">Disgust, Anger, Sadness</td>
                        </tr>
                    </tbody>
                    </table>
                </div>

                <p className="mt-6 text-gray-700">
                    Recognizing these emotional expressions in conjunction with depression scores can aid in identifying the emotional
                    state of individuals, allowing for more targeted interventions. If you're experiencing any of these symptoms, consider
                    seeking professional help.
                </p>
                </section>

        </div>

        </>
    );
};

export default Account;
