import { createSlice } from "@reduxjs/toolkit";

    
const initialState = {
    selectedCity: "選擇一個縣市",  
    cityWeatherData: "", //存有全台縣市的天氣資訊
    cityMinT_MaxT_Wx: "", //存有全台縣市的最低溫、高溫、天氣描述資訊，可以將此數據轉換到地圖上
    isForecastStartAtMorning: "", //用來針對預測時間
    cityWx: "",
    cityWxIcon: "",
    cityRainDrop: "",
    cityAvgTemp: "",
    cityMinToMaxTemp: "",
    cityWS: "",
    cityWD: "",
    cityRH: "",
    cityMaxAT: "",
    cityUVI: "",
    cityMaxCI:"",
};

const cityWeatherSlice = createSlice({
    name: "cityWeather",
    initialState,
    reducers: {
        setSelectedCity(state, action) {
            state.selectedCity = action.payload;
        },
        setCityWeatherData(state, action) {
            state.cityWeatherData = action.payload
        },
        setCityMinT_MaxT_Wx(state, action) {
            state.cityMinT_MaxT_Wx = action.payload;
        },
        setIsForecastStartAtMorning(state, action) {
            state.isForecastStartAtMorning = action.payload;
        },
        setCityWx(state, action) {
            state.cityWx = action.payload;
        },
        setCityWxIcon(state, action) {
            state.cityWxIcon = action.payload;
        },
        setCityRainDrop(state, action) {
            state.cityRainDrop = action.payload;
        },
        setCityAvgTemp(state, action) {
            state.cityAvgTemp = action.payload;
        },
        setCityMinToMaxTemp(state, action) {
            state.cityMinToMaxTemp = action.payload;
        },
        setCityWS(state, action) {
            state.cityWS = action.payload;
        },
        setCityWD(state, action) {
            state.cityWD = action.payload;
        },
        setCityRH(state, action) {
            state.cityRH = action.payload;
        },
        setCityMaxAT(state, action) {
            state.cityMaxAT = action.payload;
        },
        setCityUVI(state, action) {
            state.cityUVI = action.payload;
        },
        setCityMaxCI(state, action) {
            state.cityMaxCI = action.payload;
        },
        resetCityState: () => initialState,
    }
});


export const {
    setSelectedCity, setCityWeatherData, setCityMinT_MaxT_Wx, setIsForecastStartAtMorning, 
    setCityWx, setCityWxIcon, setCityRainDrop, setCityAvgTemp, setCityMinToMaxTemp,
    setCityWS, setCityWD, setCityRH, setCityMaxAT, setCityUVI, setCityMaxCI, resetCityState} = cityWeatherSlice.actions;

export default cityWeatherSlice.reducer;


