import data from './data/sagas'
import settings from './settings/sagas'
import wallet from './wallet/sagas'
import webSocket from './webSocket/sagas'
import walletOptions from './walletOptions/sagas'
import kvStore from './kvStore/sagas'
import refresh from './refresh/sagas'

export default ({ api, socket }) => ({
  data: data({ api }),
  settings: settings({ api }),
  wallet: wallet({ api }),
  walletOptions: walletOptions({ api }),
  webSocket: webSocket({ api, socket }),
  kvStore: kvStore({ api }),
  refresh: refresh({ api })
})
