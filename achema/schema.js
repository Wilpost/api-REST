const z = require('zod')

const schema = z.object({
  title: z.string().min(1).max(20),
  year: z.number().min(1900).max(2025),
  duration: z.number().int().positive(),
  poster: z.string().url(),
  genre: z.array(
    z.enum([
      'Action',
      'Adventure',
      'Crime',
      'Comedy',
      'Drama',
      'Fantasy',
      'Horror',
      'Thriller',
      'Sci-Fi',
      'Biography'
    ]),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  ),
  rate: z.number().max(10).default(0)
})

function validateData(object) {
  return schema.safeParse(object)
}

function validatePartialData(input) {
  return schema.partial().safeParse(input)
}

module.exports = validateData
module.exports = validatePartialData
