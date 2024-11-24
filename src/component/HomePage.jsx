import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { setCurrentInput, setCurrentPage, setLoading, setInputShowing } from "../redux/searchSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useSearch from "../hooks/useSearch";

function homePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleSearch } = useSearch();

    useEffect(() => {
        dispatch(setInputShowing(false));
    }, [])

    const handleSearchNews = (e) => {
        if (e) e.preventDefault();
        const searchInput = document.getElementById("searchInput").value;
        handleSearch(searchInput);
    }

    return (
        <div className="bg-neutral-500 h-screen w-screen flex flex-col">
            <Navbar />
            <div id="homePage" className="flex-grow flex flex-col items-center justify-center">
                <h1 id="logo" className="text-white text-4xl">News App!</h1>
                <form className="flex flex-row items-center justify-center mt-2 w-full" onSubmit={handleSearchNews}>
                    <input className="w-1/3 rounded-md p-2" type="search" id="searchInput" placeholder="Search News..." />
                    <button className=" rounded-md ml-1 bg-green-700 text-white p-2"
                        type="button" id="searchButton" onClick={handleSearchNews}>Search</button>
                </form>

            </div>
        </div>
    )
}

export default homePage;