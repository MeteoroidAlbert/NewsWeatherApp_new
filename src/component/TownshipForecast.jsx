import React, { useEffect } from "react";
import { setSelectedTownship, setTownshipData, setTownshipDataToShow } from "../redux/townshipWeatherSlice";
import { useDispatch, useSelector } from "react-redux";

function TownshipForecast() {
    const { selectedTownship, townshipData, townshipDataToShow } = useSelector(state => state.townshipWeather);
    const { isForecastStartAtMorning } = useSelector(state => state.cityWeather);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(townshipDataToShow);
    }, [townshipDataToShow])

    useEffect(() => {
        updateTownshipWeatherInfoShowToUser();
    }, [selectedTownship])


    function updateTownshipWeatherInfoShowToUser() {
        if (townshipData && selectedTownship) {
            const townshipIndex = townshipData.records.locations[0].location.findIndex(item => item.locationName === selectedTownship);

            const searchWeatherElement = (weatherElementInput) => townshipData.records.locations[0].location[townshipIndex].weatherElement?.find(item => item.elementName === weatherElementInput);
            const targetTownshipAvgTemp = (index) => searchWeatherElement("T")?.time[index].elementValue[0].value;
            const targetTownshipPoP12h = (index) => searchWeatherElement("PoP12h")?.time[index].elementValue[0].value;
            const targetTownshipWx = (index) => searchWeatherElement("Wx")?.time[index].elementValue[0].value;
            const targetTownshipMaxT = (index) => searchWeatherElement("MaxT")?.time[index].elementValue[0].value;
            const targetTownshipMinT = (index) => searchWeatherElement("MinT")?.time[index].elementValue[0].value;
            const targetTownshipMaxAT = (index) => searchWeatherElement("MaxAT")?.time[index].elementValue[0].value;
            const predictTime = (index) => searchWeatherElement("MaxAT")?.time[index].endTime;
            const predictDate = (index) => searchWeatherElement("MaxAT")?.time[index].startTime;

            const arrayLength = isForecastStartAtMorning ? 10 : 9;

            let dataArray = [];
            for (let i = 0; i < arrayLength; i++) {

                const data = {
                    AvgTemp: targetTownshipAvgTemp(i),
                    PoP12h: targetTownshipPoP12h(i),
                    Wx: targetTownshipWx(i),
                    MaxTtoMinT: `${targetTownshipMinT(i)} ~ ${targetTownshipMaxT(i)}`,
                    MaxAT: targetTownshipMaxAT(i),
                    Predict: (predictTime(i).substring(11, 16) === "18:00") ? "白天" : "夜晚",
                    Date: predictDate(i).substring(0, 10),
                }
                dataArray.push(data);
            };


            if (!isForecastStartAtMorning) {
                const data = {
                    no_data: "no_data",
                    Date: dataArray[0].Date
                };
                dataArray.unshift(data);
            }
            dispatch(setTownshipDataToShow(dataArray));
        }


    }

    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

    return (
        <div className="border-4 border-gray-400 rounded-md px-4 mx-2 mb-2 py-2">
            <div className="text-2xl mb-2">{selectedTownship || "請選擇鄉鎮"}</div>
            {/*斷點md以上使用table布局*/}
            <table className="hidden md:block border-separate border-spacing-0 lg:border-spacing-x-4 w-full text-center">
                <thead>
                    <tr>
                        {/* 日期和星期 */}
                        {townshipDataToShow && townshipDataToShow
                            .filter((data, index) => index % 2 === 0) // 碰到0、偶數索引值的資料時渲染日期和星期
                            .map((data, index) => (
                                <th key={`header-${index}`} className="border border-gray-400 rounded-t-md bg-gray-300 w-1/5">
                                    <div>
                                        <span>{new Date(data.Date).getMonth() + 1}月</span>
                                        <span>{new Date(data.Date).getDate()}日</span>
                                    </div>
                                    <div>{weekdays[new Date(data.Date).getDay()]}</div>
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {/*索引值0、2、4資料為白天天氣資訊*/}
                        {townshipDataToShow && townshipDataToShow
                            .filter((data, index) => index % 2 === 0)
                            .map((data, index) => {
                                if (data.no_data) {
                                    return (
                                        <td key={`row1-${index}`} className="border-x border-b border-gray-400 p-2">
                                            No Data
                                        </td>
                                    )
                                }
                                else {
                                    return (
                                        <td key={`row1-${index}`} className=" border-x border-b border-gray-400 p-2 text-sm text-start lg:text-base">
                                            <div className="flex justify-between">
                                                    <div className="font-bold text-lg">{data.Predict}</div>
                                                    <div className="text-lg">{data.AvgTemp}&deg;C</div>
                                            </div>
                                            <div>{data.Wx}</div>
                                            <div className="flex items-center gap-1">
                                                <i className="wi wi-raindrops text-4xl"></i>
                                                <p>{data.PoP12h.trim() === "" ? "(暫無資料)" : `${data.PoP12h}%`}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <i className="wi wi-thermometer text-lg"></i>
                                                <p>{data.MaxTtoMinT}&deg;C</p>
                                            </div>
                                            <div className="flex justify-start text-start ">最高體感溫度: {data.MaxAT}&deg;C</div>
                                        </td>
                                    )
                                }

                            })}
                    </tr>
                    <tr>
                        {/*索引值1、3、5資料為夜晚天氣資訊*/}
                        {townshipDataToShow && townshipDataToShow
                            .filter((data, index) => index % 2 === 1)
                            .map((data, index) => (
                                <td key={`row2-${index}`} className=" border-x border-b rounded-b-md border-gray-400 p-2 text-sm text-start lg:text-base">
                                            <div className="flex justify-between">
                                                    <div className="font-bold text-lg">{data.Predict}</div>
                                                    <div className="text-lg">{data.AvgTemp}&deg;C</div>                                                                                          
                                            </div>
                                            <div>{data.Wx}</div>
                                            <div className="flex items-center gap-1">
                                                <i className="wi wi-raindrops text-4xl"></i>
                                                <p>{data.PoP12h.trim() === "" ? "(暫無資料)" : `${data.PoP12h}%`}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <i className="wi wi-thermometer text-lg"></i>
                                                <p>{data.MaxTtoMinT}&deg;C</p>
                                            </div>
                                            <div className="flex justify-start text-start ">最高體感溫度: {data.MaxAT}&deg;C</div>
                                        </td>
                            ))}
                    </tr>
                </tbody>
            </table>
            {/*斷點小於md時使用grid布局*/}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {townshipDataToShow && townshipDataToShow.map((data, index) => {
                    if (data.no_data) {
                        return null;
                    }
                    else {
                        if (index % 2 === 0) {
                            return (
                                <div key={index} className="border-b border-gray-400 pb-4">
                                <div className="flex flex-col">
                                    <div className="flex justify-between">
                                        <div className="text-lg font-extrabold">{new Date(data.Date).getMonth() + 1}月 {new Date(data.Date).getDate()}日</div>
                                        <div>{weekdays[new Date(data.Date).getDay()]}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <div className="font-semibold">{data.Predict}</div>
                                            <div>{data.Wx}</div>
                                        </div>
                                        <div className="text-lg">{data.AvgTemp}&deg;C</div>
                                    </div>
                                    <div className="mt-2 ">
                                        <div className="flex items-center gap-1">
                                            <i className="wi wi-raindrops text-2xl"></i>
                                            <p>{data.PoP12h.trim() === "" ? "(暫無資料)" : `${data.PoP12h}%`}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <i className="wi wi-thermometer text-lg"></i>
                                            <p>{data.MaxTtoMinT}&deg;C</p>
                                        </div>
                                        <div className="text-sm">最高體感溫度: {data.MaxAT}&deg;C</div>
                                    </div>

                                </div>
                            </div>
                            )
                        }
                        else {
                            return (
                                <div key={index} className="border-b-4 border-gray-400 pb-4">
                                <div className="flex flex-col">
                                    <div className="flex justify-between">
                                        <div className="text-lg font-extrabold">{new Date(data.Date).getMonth() + 1}月 {new Date(data.Date).getDate()}日</div>
                                        <div>{weekdays[new Date(data.Date).getDay()]}</div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <div className="font-semibold">{data.Predict}</div>
                                            <div>{data.Wx}</div>
                                        </div>
                                        <div className="text-lg">{data.AvgTemp}&deg;C</div>
                                    </div>
                                    <div className="mt-2 ">
                                        <div className="flex items-center gap-1">
                                            <i className="wi wi-raindrops text-2xl"></i>
                                            <p>{data.PoP12h.trim() === "" ? "(暫無資料)" : `${data.PoP12h}%`}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <i className="wi wi-thermometer text-lg"></i>
                                            <p>{data.MaxTtoMinT}&deg;C</p>
                                        </div>
                                        <div className="text-sm">最高體感溫度: {data.MaxAT}&deg;C</div>
                                    </div>

                                </div>
                            </div>
                            )
                        } 

                    }
                })}
            </div>
        </div>
    );

}

export default TownshipForecast;