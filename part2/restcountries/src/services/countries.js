import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response=>response.data)
    .catch(exception => console.log(`exception at ${baseUrl} get request in services exception: ${exception}`))
}

export default {getAll}