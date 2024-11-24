import React from 'react';
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import NewsPage from './NewsPage';
import HomePage from './HomePage';
import WeatherPage from './WeatherPage';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/newspage" element={<NewsPage/>} />
                <Route path="/weatherpage" element={<WeatherPage/>}/>
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </HashRouter>
    )
}

export default App;