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
      <div className="h-screen bg-gradient-to-b from-mint to-lightBlue flex flex-col gap-8 justify-center items-center">
        <div
          ref={welcomeRef}
          className="text-center bg-lightGrey opacity-70 border-2 border-lightGrey rounded-2xl p-20 w-3/4 h-1/8 animate-fadeInUp hover:scale-110 hover:opacity-80 transition-transform duration-500"
        >
          <h1>{message}</h1>
        </div>
              {/* MCQ prompt section */}
      {MCQ_prompt && (
          <div
            ref={MCQ_container}
            className="text-center bg-lightGrey opacity-70 border-2 border-lightGrey rounded-2xl p-52 w-3/4 h-1/8 animate-fadeInUp hover:opacity-80 hover:scale-110 transition-transform duration-500"
          >
            <p className="text-6xl">Would you like to take a short Mental Health Test?</p>

            <div className="text-center justify-center p-10 flex flex-row gap-10 mt-20">
              <button
                onClick={scrollToTest} // Scroll to the Mental Health Test section on click
                className="bg-lavendar text-4xl border-2 p-2 rounded-xl"
              >
                Yes
              </button>
            </div>
          </div>
      )}
      </div>


      {/* New section - Mental Health Test link */}
      <div
        ref={mentalHealthTestRef}
        className="h-screen bg-gradient-to-b from-lightBlue to-lavendar flex flex-col gap-8 justify-center items-center"
      >
        <div className="w-3/4 bg-lightGrey p-16 border-2 border-lightGrey rounded-2xl text-center opacity-80 hover:opacity-100 transition-transform duration-500">
          <p className="text-4xl text-darkBlue mb-8">Ready for the Mental Health Test?</p>
          <a
            href="#"
            className="bg-lavendar text-4xl border-2 p-4 rounded-xl"
          >
            Start the Test
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
