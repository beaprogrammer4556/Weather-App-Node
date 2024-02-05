const http =require("http");
const fs =require("fs");
const requests = require("requests");
const homeFile = fs.readFileSync("home.html","utf-8");
const replaceval = (tempval,orgval) =>{
  let temperature = tempval.replace("{%tempval%}",orgval.current.temp_c);
  temperature = temperature.replace("{%tempmin%}",orgval.location.lat);
  temperature = temperature.replace("{%tempmax%}",orgval.location.lon);
  temperature = temperature.replace("{%location%}",orgval.location.name);
  temperature = temperature.replace("{%country%}",orgval.location.country);
  temperature = temperature.replace("{%tempStatus%}",orgval.current.condition.text);
  return temperature;
  // let temperature = tempval.replace("{%tempval%}",orgval.main.temp);
  // temperature = temperature.replace("{%tempmin%}",orgval.main.temp_min);
  // temperature = temperature.replace("{%tempmax%}",orgval.main.temp_max);
  // temperature = temperature.replace("{%location%}",orgval.name);
  // temperature = temperature.replace("{%country%}",orgval.sys.country);
  // temperature = temperature.replace("{%tempStatus%}",orgval.weather[0].main);
  // return temperature;
} 


const server = http.createServer((req,res)=>{
   if(req.url=="/"){
    requests('http://api.weatherapi.com/v1/current.json?key=817774e981534fc9bdc64812240502&q=kolkata&aqi=no')
    .on('data',  (chunk)=> {
        let objData = JSON.parse(chunk);
        let arrData = [objData];
        //console.log(arrData[0].main.temp);
        let realTimeData = arrData.map((val)=>replaceval(homeFile,val)).join("");
        res.write(realTimeData);
    })
    .on('end', (err)=> {
      if (err) return console.log('connection closed due to errors', err);
      res.end();
      //console.log('end');
    });
   }
})
server.listen(8000,"127.0.0.1")
