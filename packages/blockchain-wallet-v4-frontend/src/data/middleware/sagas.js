import webSocket from './webSocket/sagas'

export default ({ api, coinsSocket }) => ({
  webSocket: webSocket({
    api,
    coinsSocket
  })
})
