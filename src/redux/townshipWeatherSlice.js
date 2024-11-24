import { createSlice } from "@reduxjs/toolkit";


    
const initialState = {
    selectedTownship: null,
    townshipData: null,   //存有選定的單一縣市內所有鄉鎮的天氣資訊
    townshipDataToShow: [],   //存有實際要展示給用戶看的鄉鎮天氣資訊(3天內，包含:均溫、天氣描述、降雨、最高/低溫、體感溫度)
};

const townshipWeatherSlice = createSlice({
    name: "townshipWeather",
    initialState,
    reducers: {
        setSelectedTownship(state, action) {
            state.selectedTownship = action.payload;
        },
        setTownshipData(state, action) {
            state.townshipData = action.payload;
        },
        setTownshipDataToShow(state, action) {
            state.townshipDataToShow = action.payload
        },
        resetTownshipState: () => initialState,
    }
});


export const {setSelectedTownship, setTownshipData, setTownshipDataToShow, resetTownshipState} = townshipWeatherSlice.actions;

export default townshipWeatherSlice.reducer;


