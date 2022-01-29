const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json()) //json-parser needed to fulfill POST requests
app.use(morgan(':method :url :body', {
  skip: function (req, res) { return req.method !== "POST" }
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

//delete a single resource by specifying an id
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

//generate an id for a new entry using Math.random
const generateId = () => {
  return Math.floor(Math.random() * 1000)
}

//add new person by submitting a POST request
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  //filter existing objects to check for any matching name properties
  let nameMatches = persons.filter(person => {
    return person.name === body.name
  })
  
  if (nameMatches.length !== 0){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
