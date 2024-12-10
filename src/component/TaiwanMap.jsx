import React, { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom/client';
import * as d3 from "d3";
import taiwanMapData from "../source/taiwan_map.json";
import { setLoading, setInputShowing } from "../redux/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { setIsForecastStartAtMorning, setCityMinT_MaxT_Wx, setCityWeatherData, setSelectedCity } from "../redux/cityWeatherSlice";

import { cityWeatherBlockPositionData } from "../source/cityWeatherBlockPositionData";
import { wxIcon } from "../source/wxIcon";

const CityWeatherBlock = ({ cityInput, minT, maxT, wxIcon }) => {
    return (

        <div className="cityWeatherBlock bg-[rgba(255,250,240,0.7)] border border-gray-400 text-xs text-center cursor-pointer w-full h-full p-1">
            <div className="flex justify-center gap-1">{cityInput} <i className={`wi wi-${wxIcon} text-lg `} /></div>
            <p>{minT}&deg;C ~ {maxT}&deg;C</p>
        </div>

    );
};


function TaiwanMap() {
    const { isForecastStartAtMorning, cityMinT_MaxT_Wx, cityWeatherData, selectedCity } = useSelector(state => state.cityWeather);
    const dispatch = useDispatch();
    const selectedCityRef = useRef();
    const [mapLoading, setMapLoading] = useState(true);

    useEffect(() => {
        dispatch(setInputShowing(true));
    }, []);


    useEffect(() => {
        if (selectedCity) {
            selectedCityRef.current = selectedCity;
            [...document.querySelectorAll("path")].filter(element => element.id !== "info" && element.id !== selectedCityRef.current).forEach(item => item.setAttribute("fill", "#808000"));
            document.getElementById(selectedCityRef.current)?.setAttribute("fill", "#ffa500");
        }

    }, [selectedCity])

    useEffect(() => {
        if (cityMinT_MaxT_Wx) {
            getTaiwanMap();
            setMapLoading(false);
        }
    }, [cityMinT_MaxT_Wx])

    //建立互動式台灣地圖svg
    function getTaiwanMap() {
        //使SVG圖像的寬、高等於其所在的<div>
        const taiwanMapFrame = document.getElementById("map");
        const width = taiwanMapFrame.offsetWidth;
        const height = taiwanMapFrame.offsetHeight;

        //調整地圖放大倍率
        let mercatorScale;
        let mercatorScaleLJ;

        let w = window.innerWidth;

        if (w > 1366) {
            mercatorScale = 10000;
            mercatorScaleLJ = 25000;

        } else if (w <= 1366 && w > 480) {
            mercatorScale = 7800;
            mercatorScaleLJ = 20000;
        } else {
            mercatorScale = 6000;
            mercatorScaleLJ = 12000;
        }


        //使用d3.js開始進行地理資訊可視化
        const allProjection = d3.geoMercator()
            .center([121, 24])
            .scale(mercatorScale)
            .translate([width / 1.75, height / 2]);
        const path = d3.geoPath().projection(allProjection);


        const LJProjection = d3.geoMercator()
            .center([119.9500, 26.2000])
            .scale(mercatorScaleLJ)
            .translate([width * 0.25 / 2, height * 0.25 / 2]);

        const LJPath = d3.geoPath().projection(LJProjection);

        const KMProjection = d3.geoMercator()
            .center([118.3225, 24.4303])
            .scale(mercatorScale)
            .translate([width * 0.25 / 2, height * 0.25 / 2]);

        const KMPath = d3.geoPath().projection(KMProjection);


        //使用d3 selector繪製svg畫布
        const svgMain = d3.select("#svgMain")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("fill", "#808000");

        const svgLJ = d3.select("#svgLJ")
            .attr("width", width * 0.25)
            .attr("height", width * 0.25)
            .attr("viewBox", `0 0 ${width * 0.25} ${width * 0.25}`)
            .attr("fill", "#808000");

        const svgKM = d3.select("#svgKM")
            .attr("width", width * 0.25)
            .attr("height", width * 0.25)
            .attr("viewBox", `0 0 ${width * 0.25} ${width * 0.25}`)
            .attr("fill", "#808000");

        //建立互動式台灣地圖svg
        d3.json(taiwanMapData).then(geometry => {
            const mainFeatures = geometry.features.filter(d => d.properties.name !== "連江縣" && d.properties.name !== "金門縣")
            const LJFeatures = geometry.features.filter(d => d.properties.name === "連江縣")
            const KMFeatures = geometry.features.filter(d => d.properties.name === "金門縣")

            const mapGenerator = (svgInput, dataInput, pathGenerator) => {
                svgInput.selectAll("path")                                          //選擇所有<svg>中的<path/>，形成一個選擇集，但目前HTML中並沒有任何<path/>存在
                    .data(dataInput)                                                    //將引入的數據與現存<path/>綁定，但由於目前沒有任何<path/>存在，因此所有數據尚待分配
                    .enter().append("path")                                             //使用enter()，可以進入選擇集，此時發現選擇集是空的!，因此使用append()，加入<path/>，此時每筆數據會對應產生一個<path/>
                    .attr("d", pathGenerator)                                           //對每個<path/>新增d attribute，並以先前宣稱的path變數作為繪製路徑     
                    .attr("id", d => d.properties.id)                                   //對每個<path/>新增id attribute，用每一組與<path/>對應的data(此處便是指d，此d並不是path元素的d屬性!!)中的properties.name，形成獨有的id
                    .attr("stroke", "white")
                    .attr("stroke-width", 0.1)
                    .style("cursor", "pointer")
                    .on('click', function (event, d) {
                        //更新右側天氣資訊欄並使地圖上的該縣市地區標色
                        dispatch(setSelectedCity(d.properties.id));
                        updateRegionColor(this);
                    })
                    .on("mouseover", function (event, d) {
                        if (d.properties.id !== selectedCityRef.current) {
                            d3.select(this).attr("fill", "#ffd700")
                        }
                    })
                    .on("mouseout", function (event, d) {
                        if (d.properties.id !== selectedCityRef.current) {
                            d3.select(this).attr("fill", "#808000")
                        }
                    })

            }

            mapGenerator(svgMain, mainFeatures, path);
            mapGenerator(svgLJ, LJFeatures, LJPath);
            mapGenerator(svgKM, KMFeatures, KMPath);

            //建立每個縣市地區的地理中心資訊array，準備用來繪置地圖上的各縣市天氣資訊方塊
            let cityCenterData = [];
            const findCenterData = (svgInput, dataInput, pathInput) => {
                svgInput.selectAll("path")
                    .data(dataInput)
                    .each(d => {
                        const center = pathInput.centroid(d);

                        const cityCenter = {
                            name: d.properties.name,
                            x: center[0],
                            y: center[1]
                        }
                        cityCenterData.push(cityCenter);
                    });
            }
            findCenterData(svgMain, mainFeatures, path);
            findCenterData(svgLJ, LJFeatures, LJPath);
            findCenterData(svgKM, KMFeatures, KMPath);
            // console.log(cityCenterData);
            
            const createCityWeatherBlock = (svgInput, cityInput, calX, calY) => {
                const wxCode = isForecastStartAtMorning ?
                    wxIcon.find(item => item.id === cityMinT_MaxT_Wx.find(item => item.name === cityInput).wxID)?.icon[0] :
                    wxIcon.find(item => item.id === cityMinT_MaxT_Wx.find(item => item.name === cityInput).wxID)?.icon[1];

                const foreignObject = svgInput.append("foreignObject")
                    .attr("x", cityCenterData.find(item => item.name === cityInput).x + calX)
                    .attr("y", cityCenterData.find(item => item.name === cityInput).y + calY)
                    .attr("width", 80)
                    .attr("height", 40)
                    .style("background", "transparent")
                    .on("click", () => {
                        dispatch(setSelectedCity(cityInput));
                        [...document.querySelectorAll("path")].filter(element => element.id !== "info").forEach(item => item.setAttribute("fill", "#808000"));
                        document.getElementById(cityInput).setAttribute("fill", "#ffa500")
                    })
                    .on("mouseover", function (event, d) {
                        if (cityInput !== selectedCityRef.current) {
                            d3.select(`#${cityInput}`).attr("fill", "#ffd700");
                        }
                    })
                    .on("mouseout", function (event, d) {
                        if (cityInput !== selectedCityRef.current) {
                            const pathRegion = document.getElementById(cityInput);
                            d3.select(`#${cityInput}`).attr("fill", "#808000");
                        }
                    })
                    .node();

                const container = document.createElement("div");
                container.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
                container.setAttribute("id", `container-${cityInput}`);
                container.style.width = "100%";
                container.style.height = "100%";
                foreignObject.appendChild(container);

                ReactDOM.createRoot(container)
                    .render(
                        <CityWeatherBlock
                            cityInput={cityInput}
                            x={0}
                            y={0}
                            minT={cityMinT_MaxT_Wx.find(item => item.name === cityInput).minT}
                            maxT={cityMinT_MaxT_Wx.find(item => item.name === cityInput).maxT}
                            wxIcon={wxCode}
                        />
                    );
            }


            cityWeatherBlockPositionData.forEach(item => {
                if (item.name === "連江縣") {
                    createCityWeatherBlock(svgLJ, item.name, item.calX, item.calY)
                }
                else if (item.name === "金門縣") {
                    createCityWeatherBlock(svgKM, item.name, item.calX, item.calY)
                }
                else {
                    createCityWeatherBlock(svgMain, item.name, item.calX, item.calY)
                }

            })

            //處理點擊地圖上特定縣市時將該地區標色
            function updateRegionColor(element) {
                //將未選定區域標標色為統一顏色
                svgMain.selectAll("path")
                    .attr("fill", "#808000");
                svgLJ.selectAll("path")
                    .attr("fill", "#808000");
                svgKM.selectAll("path")
                    .attr("fill", "#808000");
                //將選定的縣市地區標色
                d3.select(element)
                    .attr("fill", "#ffa500");
            }

        });
    }




    return (
        <div id="taiwan" className="hidden md:block w-full lg:w-[40%] h-full animate-none lg:animate-slide-left ">
            <div id="taiwan-map" className="h-full" >
                <div id="map" className="relative h-full">
                    {
                        mapLoading ?
                            <div className="absolute top-0 z-40 flex justify-center items-center bg-gray-300 w-full h-full">
                                <div className="h-12 w-12 border-4 border-black border-dashed rounded-full animate-spin"></div>
                                <div className="text-black text-3xl ml-2 ">Fetching Map Info...</div>
                            </div>
                            :
                            null
                    }
                    <svg id="svgMain" className=" border-2 border-black rounded-md bg-sky-300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"></svg>
                    <div id="offshore" className=" absolute top-2 left-2 z-20 flex flex-col gap-2">
                        <svg id="svgLJ" className="border-2 border-black rounded-md" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"></svg>
                        <svg id="svgKM" className="border-2 border-black rounded-md" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"></svg>
                    </div>

                    <div id="info-block" className="flex absolute top-2 right-2 border border-gray-400 rounded-md bg-white p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path id="info" strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        <span>點擊地圖或選單查看詳細資訊</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaiwanMap;