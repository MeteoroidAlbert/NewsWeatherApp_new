import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import './css/index.css';
// import "weather-icons/css/weather-icons.min.css";
import './css/weather-icons.min.css';

import App from "./component/App";

ReactDOM.createRoot(document.getElementById("root"))
    .render(
        <React.StrictMode>
            <Provider store={store}>  
                <App />
            </Provider>
            
        </React.StrictMode>
    );
