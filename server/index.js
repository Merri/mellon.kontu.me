import express from 'express'

import { handler } from '../dist/server/entry.mjs'

const app = express()
app.use(express.static('./dist/client'))
app.use(handler)
app.listen(8080)

console.log('Server started on http://localhost:8080')
