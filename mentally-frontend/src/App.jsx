import React from "react";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import StarterTest from "./pages/StarterTest"


const App = () => {

    return (
        <div>
            {/*<header>
                <h1>Mentally</h1>
            </header>*/}
            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/starter-test" element={<StarterTest/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>   
            </main>
        </div>
    );
};

export default App;