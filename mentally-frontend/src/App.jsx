import React from "react";
import {Routes, Route} from "react-router-dom";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import StarterTest from "./pages/StarterTest"
import SignUpForm from "./pages/SignUp";
import LogInForm from "./pages/LogIn";
import Account from "./pages/Account";
import MentalHealthTests from "./pages/MentalHealthTests";


const App = () => {

    return (
        <div>
            {/*<header>
                <h1>Mentally</h1>
            </header>*/}
            <main>
                <Routes>
                    <Route path="/" element={<Landing/>}/>
                    <Route path="/starter-test" element={<StarterTest/>}/>
                    <Route path="/signup" element={<SignUpForm/>}/>
                    <Route path="/login" element={<LogInForm/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/user-tests" element={<MentalHealthTests/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>   
            </main>
        </div>
    );
};

export default App;