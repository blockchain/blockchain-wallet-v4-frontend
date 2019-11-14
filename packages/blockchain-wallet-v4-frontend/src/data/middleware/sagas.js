import webSocket from './webSocket/sagas'

export default ({ api, ratesSocket, coinsSocket }) => ({
  webSocket: webSocket({
    api,
    ratesSocket,
    coinsSocket
  })
})
