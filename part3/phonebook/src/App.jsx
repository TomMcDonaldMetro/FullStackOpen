import axios from 'axios'
import { useState, useEffect } from 'react'
import personsService from './services/persons'
import Notification from './components/notification'

const Search = ({searchValue, handleSearchValue}) => {
  return (
    <>
      search: <input value={searchValue} onChange={handleSearchValue} />
    </>
  )
}

const Button = ({name, handleDelete}) =>{
  return (
    <button type="button" onClick={handleDelete}>{name}</button>
  )
}



const Person = ({id, name, number, handleDelete}) => {
  return (
    <p>{name} {number} <Button name="delete" handleDelete={handleDelete} /></p>
  )
}

const PersonForm = ({addName, newName, newNumber, handleNewName, handleNewNumber}) => {

  return (
    <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNewName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({searchValue, persons, handleDelete}) => {

    if(searchValue === ''){
      return persons.map(person=>
        <Person key ={person.id} name={person.name} number={person.number} handleDelete={()=> handleDelete(person.id)}/>
      )
    }else{
      return persons.filter((obj)=>obj.name.toLowerCase().includes(searchValue)).map(person=>
        <Person key={person.id} name={person.name} number={person.number} handleDelete={()=> handleDelete(person.id)}/>
      )
    }
}

const App = () => {
  const [persons, setPersons] = useState([]) 


  const getAll = () => {
    personsService.getAll()
    .then(personsResult=> {
      setPersons(personsResult)
    })
  }

  // call the getAll hook handler to set the results of GET /persons to the state hook persons
  useEffect(getAll, [])



  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('')

  const addName = (event) => {
    event.preventDefault();
    const newObject = {name: newName, number: newNumber};
    const findPerson = persons.find(person => person.name === newName)

    persons.find(element =>element.name === newName) !== undefined ? 

      window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`) ? 
        personsService.update(findPerson.id, newObject) 
        .then(personResponse=> {
          setPersons(persons.map(n => n.name != newName ? n : personResponse))
        })
        .catch(error =>{
          setNotificationMessage(error.response.data.error)
          setNotificationType("error")

          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationType(null)
          }, 5000)
        })
        : console.log("aborted")
      
    : personsService.create({name: newName, number: newNumber})
    
    .then(personResponse=>{
      console.log(personResponse, "creating person then response")
      setPersons(persons.concat({name: newName, number: newNumber}))  
    })
    .catch(error => {
      console.log('the error response', error.response.data.error)
      setNotificationMessage(error.response.data.error)
      setNotificationType('error')
    })
   
    setNotificationMessage(
      `Added '${newObject.name}' successfully`
    )
    setNotificationType("success")

    setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
    setNewName(''); // revert to the default label
    setNewNumber('');

    
  }

  const handleNewName= (event) => {
    setNewName(event.target.value);
  }

  const handleNewNumber= (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearchValue = (event) => {
    setSearchValue(event.target.value)
  }

  const handleDelete = (id) => {
    console.log(id)
    const personById = persons.find(person=> person.id === id).name
    const confirm = window.confirm(`Are you sure you wish to delete ${personById}?`) 
    confirm ? personsService.remove(id)
    .then(deletedPerson=>{
      setPersons(persons.filter(person => person.id !== id))
    }) : 
    console.log("aborted")
  }

  const personsArr = persons;
   
  return (
    <div>
      <Notification message={notificationMessage} type={notificationType} />
      <h2>Phonebook</h2>

      <div>
        <Search searchValue={searchValue} handleSearchValue={handleSearchValue}/>
      </div>

      <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNewName={handleNewName} handleNewNumber={handleNewNumber}/>
      <h2>Numbers</h2>
      <div>
    
      <Persons searchValue={searchValue} persons={personsArr} handleDelete={handleDelete}/>
    

      </div>
    </div>
  )
}

export default App