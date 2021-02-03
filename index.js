const express = require('express')
const cors = require('cors')
const timeout = require('connect-timeout')

const app = express()
app.use(timeout('5s'))
app.use(haltOnTimedout)

app.use(cors({ origin: true, credentials: true }))

app.use(express.json())

app.set('port', (process.env.PORT || 5000))

require('./startup/routes')(app)

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next()
}

app.listen(app.get('port'), function () {
    console.log(`Listing on port ${app.get('port')}...`)
})
