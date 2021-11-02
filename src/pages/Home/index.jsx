import React, { useState, useEffect } from "react";
import DashBoard from "./components/DashBoard";
import Map from "./components/Map";
import {
  CWB_APIkeys,
  CWB_host,
  EPA_host,
  EPA_APIkeys,
  availableLocation,
} from "../../global/constants";

// fetch weather data
const fetchWeather = async (forecastId, setData) => {
  const res = await fetch(`${CWB_host}/${forecastId}?${CWB_APIkeys}`);
  let data = await res.json();
  setData((prev) => {
    return getWeatherValue(data);
  });
};

// fetch air data
const fetchAir = async (setData) => {
  let airId = "aqx_p_432";
  let res = await fetch(`${EPA_host}/${airId}?api_key=${EPA_APIkeys}`);
  let data = await res.json();
  setData((prev) => getAirValue(data));
};

// parse weatherdata data
function getWeatherValue(data) {
  let res = [];
  if (data.result.resource_id === "F-D0047-091") {
    // parse week data
    const weekData = data.records.locations[0].location;
    weekData.forEach((data) => {
      // get each cityObj of availableLocation
      let cityObj = availableLocation.find(
        (city) => city.location === data.locationName
      );
      cityObj = { forecast: [], ...cityObj };

      // find array of forecast data in fetched data
      let pop12h = data.weatherElement.find((i) => i.elementName === "PoP12h");
      let weatherDesc = data.weatherElement.find((i) => i.elementName === "Wx");
      let min = data.weatherElement.find((i) => i.elementName === "MinT");
      let max = data.weatherElement.find((i) => i.elementName === "MaxT");

      // get forecast data of time[0], [1], [2], [4], [6], [8], [10], [12]
      let j = 0;
      for (let i = 0; i < 8; i++) {
        let appendObj = { pop: "", minT: "", maxT: "", wx: "" };
        if (j < 2) {
          appendObj.pop = pop12h.time[j].elementValue[0].value;
          appendObj.minT = min.time[j].elementValue[0].value;
          appendObj.maxT = max.time[j].elementValue[0].value;
          appendObj.wx = weatherDesc.time[j].elementValue.map((i) => i.value);
          j++;
        } else {
          appendObj.pop = pop12h.time[j].elementValue[0].value;
          appendObj.minT = min.time[j].elementValue[0].value;
          appendObj.maxT = max.time[j].elementValue[0].value;
          appendObj.wx = weatherDesc.time[j].elementValue.map((i) => i.value);
          j += 2;
        }
        cityObj.forecast.push(appendObj);
      }
      res.push(cityObj);
    });
  } else {
    // parse observation data
    const observationData = data.records;
    observationData.location.forEach((data) => {
      // filter data by availableLocation & get cityObj
      let cityObj = availableLocation.find(
        (i) => i.locationName === data.locationName
      );
      if (cityObj) {
        let temp = data.weatherElement.find((i) => i.elementName === "TEMP");
        let hum = data.weatherElement.find((i) => i.elementName === "HUMD");
        let uvi = data.weatherElement.find((i) => i.elementName === "H_UVI");
        let rain = data.weatherElement.find((i) => i.elementName === "24R");

        if (hum.elementValue >= 0) {
          hum.elementValue *= 100;
        }

        // rounding temp, rain value, percentage hun value, floor uvi value
        // if cannot get data(value = -99), return 0
        function roundValue(num, position = 0) {
          // if num == -99, return "-"
          if (num === "-99") {
            return 0;
          }

          if (position === 0) {
            return Math["round"](num);
          }

          num = +num;
          position = +position;
          // If the value is not a number or the exp is not an integer...
          if (
            isNaN(num) ||
            !(typeof position === "number" && position % 1 === 0)
          ) {
            return NaN;
          }
          // Shift
          num = num.toString().split("e");
          num = Math["round"](
            +(num[0] + "e" + (num[1] ? +num[1] - position : -position))
          );
          // Shift back
          num = num.toString().split("e");
          return +(num[0] + "e" + (num[1] ? +num[1] + position : position));
        }

        // floor uvi value & set -99 to "-" & grade uvi value
        function gradeUvi(uviNum) {
          let uviValue = Math.floor(uviNum.elementValue);
          let uviGrade = null;
          if (uviValue === -99) {
            uviValue = "-";
          } else if (uviValue <= 2) {
            uviGrade = "green";
          } else if (uviValue <= 5) {
            uviGrade = "yellow";
          } else if (uviValue <= 7) {
            uviGrade = "orange";
          } else if (uviValue <= 10) {
            uviGrade = "red";
          } else {
            uviGrade = "purple";
          }
          return { uviValue, uviGrade };
        }

        cityObj = {
          observation: {
            temp: roundValue(temp.elementValue, -1),
            hum: roundValue(hum.elementValue, 0),
            uvi: {
              value: gradeUvi(uvi).uviValue,
              grade: gradeUvi(uvi).uviGrade,
            },
            rain: roundValue(rain.elementValue, 0),
          },
          ...cityObj,
        };

        res.push(cityObj);
      }
    });
  }

  return res;
}

// parse air data
function getAirValue(data) {
  let res = [];
  let airData = data.records;
  airData.forEach((data) => {
    // filter data by availableLocation & get cityObj
    let cityObj = availableLocation.find((i) => i.airSite === data.SiteName);
    if (cityObj) {
      let aqi = data.AQI;
      // grade aqi value
      function gradeAqi(aqiNum) {
        let aqiGrade = "airGreen";
        if (aqiNum > 50 && aqiNum < 101) {
          aqiGrade = "airYellow";
        } else if (aqiNum > 100 && aqiNum < 151) {
          aqiGrade = "airOrange";
        } else if (aqiNum > 150 && aqiNum < 201) {
          aqiGrade = "airRed";
        } else if (aqiNum > 200 && aqiNum < 301) {
          aqiGrade = "airPurple";
        } else if (aqiNum > 300) {
          aqiGrade = "airBrown";
        }

        return aqiGrade;
      }

      cityObj = {
        aqi: aqi,
        grade: gradeAqi(aqi),
        ...cityObj,
      };
      res.push(cityObj);
    }
  });

  return res;
}

const Home = () => {
  let [locationName, setLocationName] = useState("臺北市");
  let [airData, setAirData] = useState([{ location: "臺北市", aqi: 0 }]);
  let [weekData, setWeekData] = useState([
    {
      location: "臺北市",
      forecast: [
        { pop: 0, temp: 22, minT: 18, maxT: 26, wx: ["晴時多雲", "02"] },
        { pop: 0, temp: 22, minT: 18, maxT: 26, wx: ["晴時多雲", "02"] },
        { pop: 0, temp: 22, minT: 18, maxT: 26, wx: ["晴時多雲", "02"] },
        { pop: 0, temp: 22, minT: 18, maxT: 26, wx: ["晴時多雲", "02"] },
        { pop: 0, temp: 22, minT: 18, maxT: 26, wx: ["晴時多雲", "02"] },
        { pop: 0, temp: 22, minT: 18, maxT: 26, wx: ["晴時多雲", "02"] },
        { pop: 0, temp: 22, minT: 18, maxT: 26, wx: ["晴時多雲", "02"] },
        { pop: 0, temp: 22, minT: 18, maxT: 26, wx: ["晴時多雲", "02"] },
      ],
    },
  ]);
  let [observationData, setObservationData] = useState([
    { location: "臺北市", observation: { uvi: 9, hum: 50, rain: 0, temp: 0 } },
  ]);

  // fetch data at first loading
  useEffect(() => {
    let weekDataId = "F-D0047-091"; // week forecast
    let nowDataId = "O-A0003-001"; // observation data
    fetchWeather(weekDataId, setWeekData);
    fetchWeather(nowDataId, setObservationData);
    fetchAir(setAirData);
  }, []);

  return (
    <div className="homepage">
      <div className="homepage-container">
        <DashBoard
          locationName={locationName}
          setLocationName={setLocationName}
          weekData={weekData}
          observationData={observationData}
          airData={airData}
        />
        <Map locationName={locationName} setLocationName={setLocationName} />
      </div>
    </div>
  );
};

export default Home;
