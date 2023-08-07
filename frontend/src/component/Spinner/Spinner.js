import React from "react";
import "./Spinner.css";
const Spinner = () => {
    return (
        <div className="w-full h-screen bg-baby-powder flex justify-center items-center">
            <div className="custom-loader"></div>
        </div>
    );
};

export default Spinner;
