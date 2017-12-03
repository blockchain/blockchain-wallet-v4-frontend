import express from 'express'
import * as civicSip from 'civic-sip-api'

const app = express()
const civicClient = civicSip.newClient({ appId: 'Hk--MyWeM' })

app.get('/exchange-token', (req, res) => {
  let jwtToken = req.params.jwtToken
  civicClient.exchangeCode(jwtToken).then((userData) => {
    console.log(userData)
  })
})
