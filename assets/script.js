const form = document.getElementById('form')
const search = document.getElementById('search')



/// api URL ///
const apiGeo = 'https://api.openweathermap.org/geo/1.0/direct?q=';
const apiForecast = 'https://api.openweathermap.org/data/2.5/forecast?lat='
const apiCurr = 'https://api.openweathermap.org/data/2.5/weather?lat='
const apiKey = '62fcc5e65140208a39c01d6de285dca8';
var lat = "";
var lon = "";
var city = "";


$(function () {
    $('.btn').on('click',function(e){
        e.preventDefault();
        searchValue = search.value.trim()
        if(!searchValue){
        alert("There is nothing to search")
        }
        else{ 
        Weather(searchValue)
        }})

        function Weather(searchValue){
            fetch(`${apiGeo}${searchValue}&appid=${apiKey}`)
                .then(function (response){
                    const info = response.json();
                    // console.log(info);
                    return info;
                })
                .then(function(info){
                    lat =info[0].lat
                    // console.log(lat)
                    lon = info[0].lon
                    // console.log(lon)
                    city = info[0].name
                })
                .then(CityWeather)
                .then(Forecast)
                .then(CreateBtn)
                
        }})


        function CityWeather(){
            fetch(`${apiCurr}${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
            .then(function (forecast){
                data = forecast.json()
                // console.log(data)
                return data
            })
            .then(function(data){
                let currDate = dayjs().format('D /MM /YYYY h:mm a')
                document.querySelector('.current_city').textContent = city;
                document.querySelector('.current_date').textContent = currDate;
                document.querySelector('.current_icon').src = 'https://openweathermap.org/img/wn/'+data.weather[0].icon+"@2x.png"
                document.querySelector('.current_temperature').textContent= 'Temp: '+ data.main.temp;
                document.querySelector('.current_wind').textContent= 'Wind: '+ data.wind.speed + ' ft/s';
                document.querySelector('.current_humidity').textContent= 'Humidity: '+ data.main.humidity + '%';
                localStorage.setItem(city, JSON.stringify(data))
            })
            
        }

        function Forecast(){
            fetch(`${apiForecast}${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
            .then(function(response){
                return response.json()
            })
            .then(function(data){
                for(var i = 7; i < data.list.length; i+=8){
                let date = dayjs.unix(data.list[i].dt).format('D /MM /YYYY h:mm a')
                document.querySelector('.date_'+ i).textContent = date
                document.querySelector(".icon_"+i).src = "https://openweathermap.org/img/wn/"+data.list[i].weather[0].icon+"@2x.png"
                document.querySelector('.temperature_'+i).textContent = 'Temp: '+ data.list[i].main.temp + '°F';
                document.querySelector('.wind_'+i).textContent = 'Wind: '+ data.list[i].wind.speed + ' ft/s';
                document.querySelector('.humidity_'+i).textContent = 'Humidity: '+ data.list[i].main.humidity + '%';
                }
            })
        }

        function CreateBtn(){
            var cityBtn = document.createElement("button");
            cityBtn.classList.add("btn", "btn-primary", "btn-sm", 'city_searched_history');
            cityBtn.setAttribute("id",city);
            cityBtn.setAttribute("onClick","showHist(this.id)");
            cityBtn.innerText = city;
            document.querySelector(".city_searched").appendChild(cityBtn);
            
        }

        function showHist(city_selected){
            var cityBtn = JSON.parse (localStorage.getItem(city_selected))
            var city2 = cityBtn.name
            fetch(`${apiGeo}${city2}&appid=${apiKey}`)
                .then(function (response){
                    const info = response.json();
                    console.log(info);
                    return info;
                })
                .then(function(info){
                    lat =info[0].lat
                    console.log(lat)
                    lon = info[0].lon
                    console.log(lon)
                    city = info[0].name
                })
                .then(CityWeather)
                .then(Forecast)
        }