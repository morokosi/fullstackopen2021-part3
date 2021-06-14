require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  } else {
    return ''
  }
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
/** @type {(fn: (req: express.Request, res: express.Response) => Promise<any>)) => any} */
const asyncMw = (fn) => {
  return (req, res, next) => fn(req, res, next).catch(next)
}
app.get(
  '/api/persons/:id',
  asyncMw(async (req, res) => {
    const id = req.params.id
    const thePerson = await Person.findById(id)
    if (thePerson) {
      res.json(thePerson)
    } else {
      res.status(404).end()
    }
  })
)
app.delete(
  '/api/persons/:id',
  asyncMw(async (req, res) => {
    const id = req.params.id
    await Person.findByIdAndDelete(id)
    res.status(204).end()
  })
)
app.get(
  '/api/persons',
  asyncMw(async (req, res) => {
    const people = await Person.find({})
    res.json(people)
  })
)
app.post(
  '/api/persons',
  asyncMw(async (req, res) => {
    if (!req.body.name) {
      res.json({ error: 'name must be non-empty' })
      return
    }
    if (!req.body.number) {
      res.json({ error: 'number must be non-empty' })
      return
    }
    const sameNamePerson = await Person.exists({ name: req.body.name })
    if (sameNamePerson) {
      res.json({ error: 'name must be unique' })
      return
    }
    const newPerson = new Person({
      name: req.body.name,
      number: req.body.number,
    })
    await newPerson.save()
    res.status(204).end()
  })
)
app.get(
  '/info',
  asyncMw(async (req, res) => {
    const entries = await Person.countDocuments()
    res.send(`
  <p>Phonebook has info for ${entries} people</p>
  <p>${new Date()}</p>
  `)
  })
)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
