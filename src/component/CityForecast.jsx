import React, { useEffect, useState } from "react";
import { citySourceID } from "../source/citySourceID";
import { wxIcon } from "../source/wxIcon";
import { setSelectedCity, setCityWeatherData, setCityMinT_MaxT_Wx, setIsForecastStartAtMorning, setCityWx, setCityWxIcon, setCityRainDrop, setCityAvgTemp, setCityMinToMaxTemp, setCityWS, setCityWD, setCityRH, setCityMaxAT, setCityUVI, setCityMaxCI } from "../redux/cityWeatherSlice";
import { setSelectedTownship, setTownshipData } from "../redux/townshipWeatherSlice";
import { setLoading } from "../redux/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import TownshipForecast from "./TownshipForecast";

function CityForecast() {
    const { selectedCity, cityWeatherData, cityMinT_MaxT_Wx, isForecastStartAtMorning, cityWx, cityWxIcon, cityRainDrop, cityAvgTemp, cityMinToMaxTemp, cityWS, cityWD, cityRH, cityMaxAT, cityUVI, cityMaxCI } = useSelector(state => state.cityWeather);
    const { selectedTownship, townshipData } = useSelector(state => state.townshipWeather);
    const { loading } = useSelector(state => state.search);
    const dispatch = useDispatch();

    useEffect(() => {
        const cityDropdown = document.getElementById("cityDropdown");

        //建立縣市下拉式選單
        citySourceID.forEach((item) => {
            cityDropdown.innerHTML += `<option value=${item.name}>${item.name}</option>`;
        });
        //取得全台縣市天氣資訊
        axios.get(`https://news-weather-app-4.onrender.com/city-weather`)
            .then(res => {
                dispatch(setCityWeatherData(res.data));
            })
            .catch(err => console.log(err));
    }, [])

    useEffect(() => {
        if (cityWeatherData?.records?.locations[0]?.location) {
            const updatedData = cityWeatherData.records.locations[0].location.map(item => ({
                name: item.locationName,
                minT: item.weatherElement[8]?.time[0].elementValue[0].value,
                maxT: item.weatherElement[12]?.time[0].elementValue[0].value,
                wxID: item.weatherElement[6]?.time[0].elementValue[1].value
            }));

            dispatch(setCityMinT_MaxT_Wx(updatedData));

            const morning = /18:00:00/;
            const booleanVal = morning.test(cityWeatherData.records.locations[0].location[0].weatherElement[0].time[0].endTime);
            dispatch(setIsForecastStartAtMorning(booleanVal));
        }
    }, [cityWeatherData]);





    useEffect(() => {
        //建立鄉鎮下拉式選單
        if (townshipData) {
            const townshipDropdown = document.getElementById("townshipDropdown");
            townshipData.records.locations[0].location.forEach((item) => {
                townshipDropdown.innerHTML += `<option value="${item.locationName}">${item.locationName}</option>`;
            });
            dispatch(setSelectedTownship(townshipData.records.locations[0].location[0].locationName));
        }
    }, [townshipData])


    useEffect(() => {
        // 更新鄉鎮下拉式選單(根據所選縣市改變)
        const cityIndex = citySourceID.findIndex(item => item.name == selectedCity);
        getTownship(cityIndex)
        if (cityWeatherData) {
            updateCityWeatherInfoShowToUser();
        }
    }, [selectedCity])


    //取得鄉鎮天氣資訊(根據所選縣市改變時而呼叫)
    function getTownship(index) {
        townshipDropdown.innerHTML = "";
        if (index === 0) {
            return;
        }
        else {
            dispatch(setLoading(true));
            const cityID = citySourceID[index].id;
            axios.get(`https://news-weather-app-4.onrender.com/townships?cityID=${cityID}`)
                .then(res => {
                    console.log(res.data);
                    dispatch(setTownshipData(res.data));
                    setTimeout(() => {
                        dispatch(setLoading(false));
                    }, 1000);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    //取得選定縣市天氣資訊(根據所選縣市改變時呼叫)
    function updateCityWeatherInfoShowToUser() {
        //建立搜索天氣數據的函式
        if (cityWeatherData) {
            const cityIndex = cityWeatherData.records.locations[0].location.findIndex(item => item.locationName === selectedCity);
            const searchWeatherElement = (weatherElementInput, elementValueIndex) => {
                const value = cityWeatherData.records.locations[0].location[cityIndex].weatherElement?.find(item => item.elementName === weatherElementInput).time[0].elementValue[elementValueIndex].value;
                return value;
            }

            //取得天氣狀態描述的id，在根據早晚來決定實際使用的icon
            const searchWxId = cityWeatherData.records.locations[0].location[cityIndex].weatherElement?.find(item => item.elementName === "Wx").time[0].elementValue[1].value;
            const wxCode = isForecastStartAtMorning ? wxIcon.find(item => item.id === searchWxId).icon[0] : wxIcon.find(item => item.id === searchWxId).icon[1];

            //使用搜索天氣數據函式將數據一一代入個個state，即可將數據呈現給用戶
            dispatch(setCityWxIcon(`<i class="wi wi-${wxCode}" id="wxIcon"></i>`));
            dispatch(setCityAvgTemp(searchWeatherElement("T", 0)));
            dispatch(setCityWx(searchWeatherElement("Wx", 0)));
            dispatch(setCityRainDrop(searchWeatherElement("PoP12h", 0)));
            dispatch(setCityMinToMaxTemp(`${searchWeatherElement("MinT", 0)} ~ ${searchWeatherElement("MaxT", 0)}`));
            dispatch(setCityWS(searchWeatherElement("WS", 0)));
            dispatch(setCityWD(searchWeatherElement("WD", 0)));
            dispatch(setCityRH(searchWeatherElement("RH", 0)));
            dispatch(setCityMaxAT(searchWeatherElement("MaxAT", 0)));
            dispatch(setCityUVI(`${searchWeatherElement("UVI", 0)} (${searchWeatherElement("UVI", 1)})`));
            dispatch(setCityMaxCI(searchWeatherElement("MaxCI", 1)));
        }


    }



    //處理器
    const handleCityChange = (e) => {
        dispatch(setSelectedCity(e.target.value));
    }

    const handleTownshipChange = (e) => {
        dispatch(setSelectedTownship(e.target.value));
    }

    return (
        <div id="weatherCard" className=" border-2 border-[#808000] flex-grow rounded-md bg-neutral-300 flex flex-col animate-none lg:animate-slide-bottom">
            <div className=" flex-grow flex flex-col" id="cityWeatherCard">

                <div className="bg-[#808000] p-2 text-white md:flex">
                    <div>
                    <label htmlFor="cityDropdown">選擇縣市</label>
                    <select id="cityDropdown" className="bg-neutral-300 rounded-md mx-2 text-gray-600" value={selectedCity} onChange={handleCityChange}></select>
                    </div>
                    <div>
                    <label htmlFor="townshipDropdown">選擇鄉鎮</label>
                    <select id="townshipDropdown" className="bg-neutral-300 rounded-md mx-2 text-gray-600" value={selectedTownship} onChange={handleTownshipChange}></select>
                    </div>
                    
                </div>
                {(selectedCity === "選擇一個縣市") ?
                    <div className="text-gray-600 flex-grow flex justify-center items-center">請使用下拉式選單選擇一個縣市</div>
                    :
                    loading ?
                        <div className="flex-grow flex justify-center items-center">
                            <div className="h-12 w-12 border-4 border-gray-600 border-dashed rounded-full animate-spin"></div>
                            <div className="text-gray-600 text-3xl ml-2">Fetching Weather Info...</div>
                        </div>
                        :
                        <div className=" text-gray-600" id="weatherCardInfo">
                            <div className="border-4 border-gray-400 rounded-md flex p-4 m-2" id="localNameAndWxAndT">
                                <div className="flex flex-col justify-center items-start ">
                                    <h1 className="text-4xl" id="locationName">{selectedCity}</h1>
                                    <p className="" id="weatherDescription">{cityWx}</p>

                                </div>
                                <div className="flex-grow flex justify-end items-end gap-2">
                                    <h1 id="avgTemp" className=" text-3xl">{cityAvgTemp}&deg;C</h1>
                                    <div id="wxIconPosition" className="text-6xl" dangerouslySetInnerHTML={{ __html: cityWxIcon }} />
                                </div>
                            </div>
                            <div id="forecastCard" className="px-6">
                                <div className="flex items-center gap-1">
                                    <i className="wi wi-raindrops text-4xl "></i>
                                    <p className="" id="rainProbability">{cityRainDrop}%</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <i className="wi wi-thermometer text-lg"></i>
                                    <p className="" id="minToMaxTemp">{cityMinToMaxTemp}&deg;C</p>
                                </div>

                                <p>
                                    風向: <span id="WD">{cityWD}</span><br />
                                    最大風速: <span id="WS">{cityWS} 公尺/秒</span><br />
                                    濕度: <span id="RH">{cityRH}%</span><br />
                                    最高體感溫度:<span id="maxAT">{cityMaxAT}&deg;C</span><br />
                                    紫外線指數: <span id="UVI">{cityUVI}</span><br />
                                    最大舒適指數: <span id="maxCI">{cityMaxCI}</span><br />
                                </p>

                                <div>
                                    <p className="text-end" id="predict">預測: {isForecastStartAtMorning ? `今日白天 (6:00 AM ~ 18:00 PM)` : `今晚至凌晨 (18:00 PM ~ 6: 00 AM)`}</p>
                                </div>
                            </div>
                            <TownshipForecast />
                        </div>


                }


            </div>

        </div>
    )
}

export default CityForecast;