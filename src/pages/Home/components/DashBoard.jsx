import React, { useState } from "react";
import CountUp from "react-countup";
import { v4 as uuidv4 } from "uuid";
import * as Icon from "../../../components/Icon";

// setting current time
const timeNow = new Date();
const time = {
  month: timeNow.getMonth() + 1,
  date: timeNow.getDate(),
  hour: timeNow.getHours(),
  day: timeNow.getDay(),
  timeRange: timeRange(timeNow.getHours()),
};

const dayArr = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

// for day property
function dayProp(dayNum) {
  let dayValue = "";
  switch (dayNum % 7) {
    case 0:
      dayValue = "星期一";
      break;
    case 1:
      dayValue = "星期二";
      break;
    case 2:
      dayValue = "星期三";
      break;
    case 3:
      dayValue = "星期四";
      break;
    case 4:
      dayValue = "星期五";
      break;
    case 5:
      dayValue = "星期六";
      break;
    case 6:
      dayValue = "星期日";
      break;
    default:
  }
  return dayValue;
}

function timeRange(hour) {
  let res = {
    range: "06:00~18:00",
    timeDesc: ["今天白天", "今晚明晨", "明天白天"],
    sunRise: "day",
  };
  if (hour >= 6 && hour < 12) {
  } else if (hour >= 12 && hour < 18) {
    res.range = "12:00~18:00";
    res.timeDesc = ["今天下午", "今晚明晨", "明天白天"];
  } else {
    res.range = "18:00~06:00";
    res.timeDesc = ["今晚明晨", "明天上午", "明天下午"];
    res.sunRise = "night";
  }

  return res;
}

const DashBoard = (prop) => {
  let { locationName, setLocationName, weekData, observationData, airData } =
    prop;

  // data want to show
  let weekParams = weekData.find((i) => i.location === locationName);
  let observationPrams = observationData.find(
    (i) => i.location === locationName
  );
  let airParams = airData.find((i) => i.location === locationName);

  let dayIndex = time.day;
  let weekArr = weekParams.forecast.reduce((accumulator, value, index) => {
    if (index === 1) {
      value = { day: dayProp(dayIndex), ...value };
      accumulator.push(value);
      dayIndex++;
    }
    if (index > 2) {
      value = { day: dayProp(dayIndex), ...value };
      accumulator.push(value);
      dayIndex++;
    }
    return accumulator;
  }, []);

  function faceIcon(aqiNum) {
    if (aqiNum > 50 && aqiNum < 101) {
      return <Icon.MedianAir />;
    } else if (aqiNum > 100 && aqiNum < 151) {
      return <Icon.MedianAir />;
    } else if (aqiNum > 150 && aqiNum < 201) {
      return <Icon.BadAir />;
    } else if (aqiNum > 200 && aqiNum < 301) {
      return <Icon.BadAir />;
    } else if (aqiNum > 300) {
      return <Icon.BadAir />;
    } else {
      return <Icon.GoodAir />;
    }
  }

  // event handler
  const handleChangeCity = (e) => {
    setLocationName(e.target.value);
  };

  return (
    <div className="dashboard">
      <div className="today">
        <div className="left">
          <div className="location">
            <form className="countyform">
              <select
                name="county"
                onChange={handleChangeCity}
                value={locationName}
              >
                <option value="基隆市">基隆市</option>
                <option value="臺北市">台北市</option>
                <option value="新北市">新北市</option>
                <option value="桃園市">桃園市</option>
                <option value="新竹市">新竹市</option>
                <option value="新竹縣">新竹縣</option>
                <option value="苗栗縣">苗栗縣</option>
                <option value="臺中市">台中市</option>
                <option value="彰化縣">彰化縣</option>
                <option value="南投縣">南投縣</option>
                <option value="雲林縣">雲林縣</option>
                <option value="嘉義市">嘉義市</option>
                <option value="嘉義縣">嘉義縣</option>
                <option value="臺南市">台南市</option>
                <option value="高雄市">高雄市</option>
                <option value="屏東縣">屏東縣</option>
                <option value="宜蘭縣">宜蘭縣</option>
                <option value="花蓮縣">花蓮縣</option>
                <option value="臺東縣">台東縣</option>
                <option value="澎湖縣">澎湖縣</option>
                <option value="金門縣">金門縣</option>
                <option value="連江縣">連江縣</option>
              </select>
            </form>
          </div>
          <div className="time">
            <p>{`${time.month} / ${time.date}`}</p>
            <p>{dayArr[time.day]}</p>
            <p>{time.timeRange.range}</p>
          </div>
        </div>
        <div className="weatherCard right">
          <p className="timepart">{time.timeRange.timeDesc[0]}</p>
          <div className="wxicon">
            <img
              src={`https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${time.timeRange.sunRise}/${weekParams.forecast[0].wx[1]}.svg`}
              alt={`${weekParams.forecast[0].wx[0]}`}
              title={`${weekParams.forecast[0].wx[0]}`}
            />
          </div>
          <span className="temp">
            <p className="minTemp">{`${weekParams.forecast[0].minT}°`}</p>
            <p className="maxTemp">{`${weekParams.forecast[0].maxT}°`}</p>
          </span>
          <span className="pop">
            <Icon.Umbrella className="umbrella" title="降雨機率" />
            {`${weekParams.forecast[0].pop}%`}
          </span>
        </div>
      </div>
      <div className="tomorrow">
        <div className="weatherCard left">
          <p className="timepart">{time.timeRange.timeDesc[1]}</p>
          <div className="wxicon">
            <img
              src={`https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${time.timeRange.sunRise}/${weekParams.forecast[1].wx[1]}.svg`}
              alt={`${weekParams.forecast[1].wx[0]}`}
              title={`${weekParams.forecast[1].wx[0]}`}
            />
          </div>
          <span className="temp">
            <p className="minTemp">{`${weekParams.forecast[1].minT}°`}</p>
            <p className="maxTemp">{`${weekParams.forecast[1].maxT}°`}</p>
          </span>
          <span className="pop">
            <Icon.Umbrella className="umbrella" title="降雨機率" />
            {`${weekParams.forecast[1].pop}%`}
          </span>
        </div>
        <div className="weatherCard right">
          <p className="timepart">{time.timeRange.timeDesc[2]}</p>
          <div className="wxicon">
            <img
              src={`https://www.cwb.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/${time.timeRange.sunRise}/${weekParams.forecast[2].wx[1]}.svg`}
              alt={`${weekParams.forecast[2].wx[0]}`}
              title={`${weekParams.forecast[2].wx[0]}`}
            />
          </div>
          <span className="temp">
            <p className="minTemp">{`${weekParams.forecast[2].minT}°`}</p>
            <p className="maxTemp">{`${weekParams.forecast[2].maxT}°`}</p>
          </span>
          <span className="pop">
            <Icon.Umbrella className="umbrella" title="降雨機率" />
            {`${weekParams.forecast[2].pop}%`}
          </span>
        </div>
      </div>
      <div className="weatherParams">
        <div className="params">
          <div>
            <p>目前溫度</p>
            <p>{`${observationPrams.observation.temp}°`}</p>
          </div>
          <div>
            <p>相對溼度</p>
            <p>{`${observationPrams.observation.hum}%`}</p>
          </div>
          <div>
            <p>紫外線指數</p>
            <p className={observationPrams.observation.uvi.grade}>
              {observationPrams.observation.uvi.value}
            </p>
          </div>
          <div>
            <p>日降雨量</p>
            <p>{`${observationPrams.observation.rain} mm`}</p>
          </div>
        </div>
        <div className="air">
          <p>空氣品質監測(AQI)</p>
          <div className="air-index">
            {faceIcon(airParams.aqi)}
            <div className="bar">
              <div key={uuidv4()} className={airParams.grade}>
                <CountUp end={airParams.aqi} duration={2} className="index" />
              </div>
            </div>
          </div>
          <p>資料來源：環保署</p>
        </div>
      </div>
      <div className="week">
        {weekArr.map((i) => {
          return (
            <div key={uuidv4()}>
              <p>{i.day}</p>
              <div>
                <p>{`${i.minT}°`}</p>
                <p className="maxTemp">{`${i.maxT}°`}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashBoard;
