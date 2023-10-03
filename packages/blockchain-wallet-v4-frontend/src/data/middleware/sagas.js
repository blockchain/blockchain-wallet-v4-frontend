import webSocket from './webSocket/sagas'

export default ({ activitiesSocket, api, coinsSocket, ratesSocket }) => ({
  webSocket: webSocket({
    activitiesSocket,
    api,
    coinsSocket,
    ratesSocket
  })
})
