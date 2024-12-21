import React, { useEffect, useState, useRef } from "react";
import MCQ from "../components/mcq.jsx";
import { sleep, typeText } from "../utils/util.js";

const Home = () => {
  const [message, setMessage] = useState("");
  const [MCQ_prompt, setMCQ] = useState(false);
  const welcomeRef = useRef(null);
  const MCQ_container = useRef(null);
  const mentalHealthTestRef = useRef(null); // Reference to new section

  const welcome_msg = "Welcome to MENTALLY!";
  const welcome_msg2 = "How are you feeling today?";

  // Function to run typing sequence and show MCQ
  const runTypingSequence = async () => {
    await typeText(welcome_msg, setMessage);
    await sleep(1000);
    await typeText(welcome_msg2, setMessage);
    await sleep(1000);

    if (welcomeRef.current) {
      welcomeRef.current.classList.add("animate-fadeOutUp");

      // Wait for animation to finish and hide element
      welcomeRef.current.addEventListener("animationend", () => {
        welcomeRef.current.classList.add("hidden");
        setMCQ(true); // Trigger showing MCQ after the animation
      }, { once: true }); // Ensures event listener is removed after one use
    }
  };

  useEffect(() => {
    runTypingSequence();
  }, []);

  // Scroll to the MCQ section
  const scrollToMCQ = () => {
    if (MCQ_container.current) {
      MCQ_container.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to the Mental Health Test section
  const scrollToTest = () => {
    if (mentalHealthTestRef.current) {
      mentalHealthTestRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
    {/* Welcome message section */}
    <div className="h-screen bg-gradient-to-b from-mint to-lightBlue flex flex-col gap-12 justify-center items-center">
      <div
        ref={welcomeRef}
        className="text-center bg-lightGrey opacity-80 border-2 border-darkGrey rounded-2xl p-16 w-3/4 animate-fadeInUp hover:scale-105 hover:opacity-90 transition-transform duration-500 shadow-lg"
      >
        <h1 className="text-6xl font-bold text-darkBlue mb-4">{message}</h1>
        <p className="text-xl text-gray-700">
          We're here to help you take meaningful steps toward better mental health.
        </p>
      </div>
          {/* MCQ prompt section */}
    {MCQ_prompt && (
      <div
        ref={MCQ_container}
        className="text-center bg-lightGrey opacity-80 border-2 border-darkGrey rounded-2xl p-12 w-3/4 animate-fadeInUp hover:scale-105 hover:opacity-90 transition-transform duration-500 shadow-lg"
      >
        <p className="text-5xl font-semibold text-darkBlue mb-6">
          Ready to take steps toward improving your mental health?
        </p>
        <p className="text-lg text-gray-700 mb-8">
          Start your journey with personalized and clinically backed resources designed for you.
        </p>
        <div className="flex justify-center">
          <button
            onClick={scrollToTest}
            className="bg-lavendar text-3xl text-white font-medium py-3 px-8 rounded-lg hover:bg-darkLavendar transition-transform duration-300"
          >
            Let's Begin!
          </button>
        </div>
      </div>
    )}
    </div>
  
    {/* New section - Mental Health Test link */}
    <div
      ref={mentalHealthTestRef}
      className="h-screen bg-gradient-to-b from-lightBlue to-lavendar flex flex-col gap-12 justify-center items-center"
    >
      <div className="w-3/4 bg-lightGrey p-12 border-2 border-darkGrey rounded-2xl text-center opacity-90 hover:opacity-100 transition-transform duration-500 shadow-lg">
        <p className="text-5xl text-darkBlue font-semibold mb-6">Clinically Validated Mental Health Assessment</p>
        <p className="text-xl text-gray-700 mb-8">
          This test is designed by mental health professionals and supported by extensive research. Your results are confidential and intended to guide your well-being journey.
        </p>
        <a
          href="/starter-test"
          className="bg-lavendar text-3xl text-white font-medium py-3 px-8 rounded-lg hover:bg-darkLavendar transition-colors duration-300"
        >
          Access the Test
        </a>
      </div>
    </div>
  </div>
  
  );
};

export default Home;
