require('../config')

const app = require('../app')
const port = process.env.PORT || 3000
const { version } = require('../package.json')

app.get('/health', (req, res) => {
  res.send('ok')
})

app.get('/version', (req, res) => {
  res.send(version)
})

app.get('/', (req, res) => {
  res.send('<h1>Blog app backend!</h1>')
})

app.listen(port)
console.log(`Server is running on port ${ port }`)
