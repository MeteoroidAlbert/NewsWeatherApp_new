import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { setCurrentInput, setCurrentPage, setLoading, setInputShowing } from '../redux/searchSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';


function NewsPage() {
    const { currentInput, currentPage, loading } = useSelector(state => state.search);
    const [newsData, setNewsData] = useState({});
    const [localPage, setLocalPage] = useState();

    const headingRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!currentInput) {
            navigate("/");
        }
        dispatch(setInputShowing(true));
    }, []);

    useEffect(() => {
        console.log("Page changed to be", currentPage);
        fetchNews(currentPage, currentInput);
    }, [currentPage, currentInput]);

    function fetchNews(page, input) {
        console.log(`Fetching news for ${input}, page number ${page}`);
        const url = `https://news-weather-app-4.onrender.com/news?q=${input}&page=${page}`;

        axios.get(url)
            .then((res) => {
                setNewsData(res.data);
                setLocalPage(page);
                setTimeout(() => {
                    dispatch(setLoading(false));
                }, 1000);
                headingRef.current.scrollIntoView(true, {behavior: "auto"});
                console.log(res.data);
            })
            .catch(err => console.log(err));
    }

    const handlePageChange = (delta) => {
        if (currentPage === 1 && delta === -1) {
            alert("It's the first page!");
        }
        else if (currentPage === 5 && delta === +1) {
            alert("It's the last page!");
        }
        else{
            dispatch(setCurrentPage(currentPage + delta));

        }
        
    }


    const handleLocalPageChange = (e) => {
        const value = e.target.value;
        setLocalPage(value);        
    }

    const handleGoToPage = () => {
        if (localPage > 6 || localPage < 1) {
            alert("The range of input should not greater than 5 or lower than 1 !");
        }
        else {
            dispatch(setCurrentPage(localPage));
        }
    }

    return (
        <div id="newsPage" className="bg-neutral-500 h-screen flex flex-col ">
            <Navbar />
            {loading ?
                <div className="flex-grow flex justify-center items-center">
                    <div className="h-12 w-12 border-4 border-white border-dashed rounded-full animate-spin"></div>
                    <div className="text-white text-3xl ml-2">Fetching News...</div>
                </div>
                :
                <div className="w-[95%] lg:w-4/5 mx-auto  mt-6 flex-grow">
                    <h1 id="found" className="text-white text-4xl mb-4" ref={headingRef}>
                        Welcom to News App (<span>{newsData.totalResults}</span> results about "<span>{currentInput ? currentInput : "sports"}</span>" found)
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
                        {newsData.articles.map( (article, index) => {
                            return (
                                <div className=" border mb-2 p-2 bg-neutral-100/[0.85] rounded-md relative" key={`${article.publishedAt}+${index}`}>
                                    <a href={article.url} target="_blank" >
                                        <img src={article.urlToImage} className="mt-2 rounded-md"/>
                                        <h1 className="font-bold text-lg p-2">{article.title}</h1>
                                        <p className="px-2 mb-10 text-gray-700">{article.description}</p>
                                        <div className="absolute bottom-1 right-2 mt-2">
                                            <p className="text-gray-400">{article.publishedAt.substring(5, 10)}, {article.source.name}</p>
                                        </div>
                                    </a>
                                    
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex justify-center items-center gap-1 mx-auto p-2">
                        <button id="previousP" className=" bg-green-700 p-1 rounded-md" onClick={() => {handlePageChange(-1)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <input type="number" id="pageInput" className="w-10" value={localPage} onChange={(e) => {handleLocalPageChange(e)}}/>
                        <span id="totalPages" className="text-white">{`/ ${Math.ceil(newsData.totalResults / 20) > 5 ? 5 : Math.ceil(newsData.totalResults / 20)}`}</span>
                        <button id="pageSearch" className="bg-green-700 text-white p-1 rounded-md" onClick={handleGoToPage}>Go to page</button>
                        <button id="nextP" className=" bg-green-700 p-1 rounded-md" onClick={() => {handlePageChange(+1)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}

export default NewsPage;