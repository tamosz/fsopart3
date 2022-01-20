const express = require('express')
const app = express()

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

//landing page
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//fetch all entries
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//fetch a single entry by specifying an id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//info page with date and number of persons in phonebook
app.get('/info', (request, response) => {
  let date = new Date().toUTCString()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
