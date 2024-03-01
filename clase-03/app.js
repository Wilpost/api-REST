const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const validateData = require('./schema/schema')
const validatePartialData = require('./schema/schema')
const fixedProblemCors = require('./utils/cors')

const PORT = process.send.PORT ?? 3000
const app = express()

app.disable('X-Powered-By') // Hide the power
app.use(express.json())
app.use(fixedProblemCors())

app.get('/movies', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*')
  const { genre, offset, limit } = req.query

  if (genre) {
    const movie = movies.filter(m =>
      m.genre.some(g => g.toLocaleLowerCase() === genre.toLocaleLowerCase())
    )

    return res.json(movie)
  }

  if (offset && limit) {
    // Me vas a traer los productos desde (offset) hasta (limit + offset)
    const bodyMovie = []

    movies.forEach((movie, index) => {
      if (index > parseInt(limit) + parseInt(offset) - 1) {
        return
      }

      return bodyMovie.push(movie)
    })

    return res.json(bodyMovie)
  }

  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  const movie = movies.find(movie => movie.id === id)

  res.json(movie)
})

app.post('/movies', (req, res) => {
  const result = validateData(req.body)

  if (!result.success) {
    return res
      .status(401)
      .json({ error: 'Invalid type' + JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialData(req.body)

  if (!result.success) {
    return res.status(400).json(JSON.parse(result.error.message))
  }

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(400).json('No movie with provided ID')
  }

  const movieModified = {
    ...movies[movieIndex],
    ...result.data
  }

  res.json(movieModified)
})

app.listen(PORT, () => {
  console.log(`Server init on the port: http://localhost:${PORT}`)
})
