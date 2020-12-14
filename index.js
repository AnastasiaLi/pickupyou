const DingRobot = require('ding-robot');
const axios = require("axios");
const schedule = require('node-schedule');
// https://oapi.dingtalk.com/robot/send?access_token=1b6936aa83b4293ccc0598a989726c0359a6fdee1cd81d7797fb76be8720c194
const robot = new DingRobot('1b6936aa83b4293ccc0598a989726c0359a6fdee1cd81d7797fb76be8720c194');

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
let holidayData = {};

async function holiday() {
    const currentDate = new Date().format("yyyy-MM-dd");
    if(holidayData.date === currentDate){
        return  holidayData;
    }

    const info = await axios({
        url: "http://api.tianapi.com/txapi/jiejiari/index?key=bddd3dfd723c540b175107643078b4da&date=" + currentDate, //需要访问的资源链接
        method: "GET",
    })
    holidayData = info.data.newslist[0];
    return holidayData;
}

const scheduleCronstyle1 = () => {
    //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('00 00 9 * * *', () => {
        holiday().then(function (data) {
            if (data.info === '工作日') {
                axios({
                    url: "https://chp.shadiao.app/api.php", //需要访问的资源链接
                    method: "GET",
                }).then((res) => {
                    robot.at('18612333178').text("宝宝，" + res.data);
                    //robot.at('15290261671').text("宝宝，" + res.data);
                })
            }
        })
    });
}

const scheduleCronstyle2 = () => {
    schedule.scheduleJob('00 00 8 * * *', () => {
        holiday().then(function (data) {
            if (data.info === '工作日') {
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
            }
        })
    })
}

const scheduleCronstyle3 = () => {
    //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('00 00 10 * * *', () => {
        holiday().then(function (data) {
            if (data.info === '节假日') {
                const info = `
宝宝，${dayinfo.info}快乐
${dayinfo.tip}
${dayinfo.rest}
`
                robot.at('18612333178').text(info);
            }
        })
    })
}


// 发送彩虹屁
scheduleCronstyle1();
// 发送天气预报
scheduleCronstyle2();
// 发送假期攻略
scheduleCronstyle3();
