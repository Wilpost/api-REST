const cors = require('cors')

const SERVICES_ACEPPTEDS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:3001',
  'http://movies.com'
]

function fixedProblemCors() {
    return cors({
    origin: (origin, callback) => {
      if (SERVICES_ACEPPTEDS.includes(origin) || !origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS policy.'))
    }
  })
}

module.exports = fixedProblemCors