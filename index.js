const DingRobot = require('ding-robot');
const axios = require("axios");
const schedule = require('node-schedule');
// https://oapi.dingtalk.com/robot/send?access_token=1b6936aa83b4293ccc0598a989726c0359a6fdee1cd81d7797fb76be8720c194
const robot = new DingRobot('1b6936aa83b4293ccc0598a989726c0359a6fdee1cd81d7797fb76be8720c194');


const scheduleCronstyle1 = () => {
    //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('00 00 9 * * *', () => {

        axios({
            url: "https://chp.shadiao.app/api.php", //需要访问的资源链接
            method: "GET",
        }).then((res) => {
            robot.at('18612333178').text("宝宝，" + res.data);
            //robot.at('15290261671').text("宝宝，" + res.data);
        })
    });
}

scheduleCronstyle1();

const scheduleCronstyle2 = () => {

    schedule.scheduleJob('00 00 8 * * *', () => {
        axios({
            url: "http://api.k780.com/?app=weather.today&weaid=1&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json", //需要访问的资源链接
            method: "GET",
        }).then((res) => {
            let weatherStr = "";

            if (res.data.success === '1') {
                const weatherData = res.data.result;
                weatherStr = `
         ${weatherData.citynm}  ${weatherData.wind}
         ${weatherData.days}   ${weatherData.week}
         ${weatherData.weather}   ${weatherData.temperature}
         PM2.5 ${weatherData.aqi}   湿度 ${weatherData.humidity}
         宝宝，当前温度是${weatherData.temperature_curr},要注意保暖哦~~
        `
            } else {
                weatherStr = "宝宝，没有获取到天气委屈屈~~~"
            }
            robot.at('18612333178').text(weatherStr);
            //robot.at('15290261671').text(weatherStr);
        })
    })
}

scheduleCronstyle2();

