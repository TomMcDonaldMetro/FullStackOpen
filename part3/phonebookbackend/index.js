require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require("morgan")

// activate the express json parser
app.use(express.json())

app.use(express.static('dist'))

const cors = require('cors')

app.use(cors())


morgan.token('person', function getPerson (req) {
    if(req.method === "POST")
        return JSON.stringify(req.body)
    else
        return
  })

  

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      req.method === "POST" ? tokens['person'](req,res) : ""
    ].join(' ')
  }))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)



app.get("/", (request,response) => {
    response.send("<h1>Hello World!</h1>")
})

// estimated document count is fastest way to return a count for large collections because
// it uses metadata rather than scanning the entire collection.
app.get("/info", (request, response) => {
    
    Person.estimatedDocumentCount()
        .then(result => {
            console.log(result)
            const time = new Date(Date.now())
            const info = `<p>Phonebook has info for ${result} people</p>
                  <p>${time}<p>`;
             response.send(info);
        })
})

// create
app.post("/api/persons", (request, response, next) => {

    const body = request.body
    
     const person = new Person({
        name: body.name,
        number: body.number
    })
   
    person.save()
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            console.log(error)
            next(error)
        })

 })


app.put("/api/persons/:id", (request, response, next) => {

    const {name, number} = request.body


    Person.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            // send the updated person to the client
            response.json(updatedPerson)
        })
        .catch(error => next(error))

})

// read
app.get("/api/persons", (request,response) => {

    Person.find({}).then(persons => {
        response.json(persons)
    })

})

// read single
app.get("/api/persons/:id", (request, response, next) => {

    // cast request query string to Number because our person object has Number
    // find person with id
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else{
                response.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })


})

// delete
app.delete("/api/persons/:id", (request, response, next) => {

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
    
})

const generateId = () => {
    return Math.ceil(Math.random() * 1000)
}


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    // cast error throws if an invalid object id for Mongo is presented.
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }
  
    next(error)
  }

// middleware order of operations is imperative so if we add this higher than our actual request routes it'll
// incorrectly route them.
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
