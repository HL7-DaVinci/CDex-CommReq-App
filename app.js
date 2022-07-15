const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const http = require('http')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors');

const PORT = process.env.PORT || 9090

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false, limit: '32mb' }))
app.use(bodyParser.json({ limit: '32mb' }))
app.use(helmet({
    contentSecurityPolicy: false,
  }))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', require('./routes/index'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/users', require('./routes/thirdparty'));
app.use('/api/attachments', require('./routes/attachments'));
app.use('/api/sign', require('./routes/sign'))


const server = http.createServer(app)

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))