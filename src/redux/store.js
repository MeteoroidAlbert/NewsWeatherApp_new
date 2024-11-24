import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import cityWeatherReducer from "./cityWeatherSlice";
import townshipWeatherReducer from "./townshipWeatherSlice";

export const store = configureStore({
    reducer: {
        search: searchReducer,
        cityWeather: cityWeatherReducer,
        townshipWeather: townshipWeatherReducer,
    },
});