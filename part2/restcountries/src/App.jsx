import { useEffect, useState } from 'react'
//import './App.css'
import countriesService from './services/countries'
import weatherService from './services/weather'


const Country = ({props}) => {
  const valuesArr = Object.values(props.languages)
  return (
    <>
      <h3>{props.name.common}</h3>
      <p>capital: {props.capital[0]}</p>
      <p>area: {props.area} km&sup2;</p>

      <h5>languages:</h5>
      <ul>

        {valuesArr.map(value=><li key={value}>{value}</li>)}

      </ul>
      <img src={props.flags.png} alt={props.name.common + " flag"}></img>
    </>
  )
}

const Weather = ({countryObj, report}) => {
  
  return (
    <>
      <h3>Weather in {countryObj.capital[0]}</h3>
      <p>Temperature {report.main.temp} Fahrenheit</p>
      <img src={`https://openweathermap.org/img/wn/${report.weather[0].icon}@2x.png`}></img>
      <p>Wind {report.wind.speed}mph</p>
    </>
  )

}

const Button = ({handler}) => {

  return (
    <button type="button" onClick={handler}>show</button>
  )
}

const Countries = ({countries, searchValue, handler}) => {
  const countriesArr = countries.filter((country) => country.name.common.toLowerCase().includes(searchValue.toLowerCase()))
  
  const tooManyFlag = countriesArr.length > 10
  return (
    <div>  
      {tooManyFlag && searchValue !== '' ? 
        <p>Too many please refine your search term</p>
        :    
      countriesArr.length === 1 ? 
        <Country props={countriesArr[0]} />
       :<table>
          <tbody>
          {
          countriesArr.map(country =><tr key={country.name.common}><td>{country.name.common}</td><td><Button handler={()=> handler(country)}/></td></tr>)
          }
          </tbody>
      </table>
      
    }
    </div>

  )
}




function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [weatherReport, setWeatherReport] = useState()
  const [country, setCountry] = useState({})


  const handleShow = (countryName) => {
    setSearch(countryName.name.common)
  }

  const getAll = () => {
   countriesService.getAll()
    .then(countriesResponse=>{
      setCountries(countriesResponse)
    })
    .catch(error => console.log(error, "error in getAll hook"))
  }
  useEffect(getAll, [])

  const handleSearch = event => {
    const value = event.target.value
    setSearch(value);
  }

  const getWeatherReport = (country) => {
    weatherService.getReport(country.capitalInfo.latlng[0], country.capitalInfo.latlng[0])
    .then(weatherResponse=> {
      setWeatherReport(weatherResponse)
    })
    .catch(error => console.log(error, " weather error in getting weather report."))
  }

  //useEffect(getWeatherReport, search);

  return (
    
    <div>
      find countries <input value={search} onChange={handleSearch} />
      <Countries countries={countries} searchValue={search} handler={handleShow}/>
      {weatherReport !== undefined ? <Weather countryObj={country} report={weatherReport} /> : null}
    </div>
  )
}
export default App