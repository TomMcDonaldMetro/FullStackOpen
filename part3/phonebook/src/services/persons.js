import axios from 'axios'
const baseUrl = '/api/persons'


const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response=>response.data)
    .catch(exception => {
        console.log(`Error in get all resources from ${baseUrl}`)
    })
}

const create = newObject => {
    const request = axios.post(baseUrl, {name: newObject.name, number: newObject.number})
      return request.then(response=>{response.data})
    //   .catch(error =>{
    //     console.log("received an error from the server after attempting to post", error.response.data.error)
    //   })
}

const update = (id, newObject) => {
    console.log("in the update method")
    console.log(`${baseUrl}/${id}`)
    console.log(newObject)
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response=>response.data)
    // .catch(error => {

    // })
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response=>{
        console.log(response, " response after delete")
    })
    .catch(error=>{
        console.log("received after attempted delete: ", error)
    })
}

export default { getAll, create, update, remove }