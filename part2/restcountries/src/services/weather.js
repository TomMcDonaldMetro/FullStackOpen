import axios from "axios";
const api_key = import.meta.env.VITE_WAPI_KEY

const getReport = (lat, lon, exclude ='') =>{
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`
    const request = axios.get(url)
    return request.then(response=>response.data)
    .catch(error=> console.log("error in getReport weather service"))

}

export default {getReport}
