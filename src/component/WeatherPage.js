import React from "react";
import Navbar from "./Navbar";
import TaiwanMap from "./TaiwanMap";
import CityForecast from "./CityForecast";

function WeatherPage() {
    return (
        <div className="h-screen w-screen  flex flex-col">
            <Navbar />
            <div className=" flex-grow p-4 flex flex-col lg:flex-row justify-center gap-4">
                <TaiwanMap />
                <CityForecast />
            </div>
        </div>
    )
}

export default WeatherPage;