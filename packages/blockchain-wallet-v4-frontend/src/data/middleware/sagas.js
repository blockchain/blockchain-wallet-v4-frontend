import webSocket from './webSocket/sagas'

export default ({ api, coinsSocket, ratesSocket }) => ({
  webSocket: webSocket({
    api,
    ratesSocket,
    coinsSocket
  })
})
