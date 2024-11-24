import React, { useState } from "react";
import { Link } from "react-router-dom";
import { setCurrentInput, setCurrentPage, setLoading, setInputShowing } from "../redux/searchSlice";
import { setCityWeatherData, resetCityState } from "../redux/cityWeatherSlice";
import { setTownshipData, resetTownshipState } from "../redux/townshipWeatherSlice";
import { useDispatch, useSelector } from "react-redux";
import useSearch from "../hooks/useSearch";

function Navbar() {
    const dispatch = useDispatch();
    const { handleSearch } = useSearch();
    const { inputShowing } = useSelector(state => state.search);
    const [isMenuShowing, setIsMenuShowing] = useState(false);

    const handleNewsTagClick = (e) => {
        console.log(e.target.innerText);
        const tag = e.target.innerText;

        dispatch(setCurrentPage(1));
        dispatch(setLoading(true));
        dispatch(setCurrentInput(tag.toLowerCase()));
        dispatch(resetCityState());
        dispatch(resetTownshipState());
    }

    const handleHomePageClick = () => {
        dispatch(resetCityState());
        dispatch(resetTownshipState());
    }

    const handleSearchNews = (e) => {
        if (e) e.preventDefault();
        const searchInput = document.getElementById("searchInputInNav").value;
        handleSearch(searchInput);
    }




    return (
        <div className="bg-neutral-100 p-2 sticky top-0 z-50">
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center" >
                    <Link className="text-2xl" to="/" onClick={handleHomePageClick} >News App</Link>
                    <Link className="hidden lg:flex gap-4" to="/newspage" onClick={handleNewsTagClick}>
                        <div className=" text-stone-600 hover:bg-neutral-400" >Sport</div>
                        <div className=" text-stone-600 hover:bg-neutral-400" >Business</div>
                        <div className=" text-stone-600 hover:bg-neutral-400" >Technology</div>
                        <div className=" text-stone-600 hover:bg-neutral-400" >World</div>
                    </Link>


                </div>
                <div className="hidden lg:flex justify-center items-center">
                    <Link className=" text-stone-600 border  border-neutral-500 rounded-md p-1 mr-4" to="/weatherpage" >Weather</Link>
                    {inputShowing ?
                        <form onSubmit={handleSearchNews}>
                            <input type="text" id="searchInputInNav" className="border rounded-md p-1" placeholder="Search News..." />
                            <button className=" rounded-md ml-1 bg-green-700 text-white p-1" type="button" id="searchButton" onClick={handleSearchNews}>Search</button>
                        </form>
                        :
                        <div></div>
                    }
                </div>
                <div className="lg:hidden cursor-pointer" onClick={() => { setIsMenuShowing(true) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
            </div>

            {/*用於RWD斷點lg以下者 */}
            {isMenuShowing ?
                <div className="absolute top-0 right-0 w-[85%] md:w-[40%] h-screen flex flex-col items-start lg:hidden p-4 bg-slate-300 animate-slide-right ">
                    <div className="flex items-center justify-between w-full mb-4">
                        <Link className="text-2xl" to="/" onClick={handleHomePageClick} >News App</Link>
                        <button className="border border-green-700 rounded-md bg-green-700 text-white p-1" onClick={() => { setIsMenuShowing(false) }}>Close</button>
                    </div>
                    {inputShowing ?
                        <form className="mb-4 w-full flex" onSubmit={handleSearchNews}>
                            <input type="text" id="searchInputInNav" className="border rounded-md p-1 flex-grow" placeholder="Search News..." />
                            <button className=" rounded-md ml-1 bg-green-700 text-white p-1" type="button" id="searchButton" onClick={handleSearchNews}>Search</button>
                        </form>
                        :
                        null
                    }
                    <Link className="flex flex-col gap-4" to="/newspage" onClick={handleNewsTagClick}>
                        <div className=" text-stone-600 hover:bg-neutral-400" >Sport</div>
                        <div className=" text-stone-600 hover:bg-neutral-400" >Business</div>
                        <div className=" text-stone-600 hover:bg-neutral-400" >Technology</div>
                        <div className=" text-stone-600 hover:bg-neutral-400" >World</div>
                    </Link>

                    <Link className="inline-block text-stone-600 border  border-neutral-500 rounded-md p-1 mt-3" to="/weatherpage" >Weather</Link>
                </div>
                :
                null
            }


        </div>
    )
}

export default Navbar;