import { dataSagasFactory } from './data/sagas.js'
import { settingsSaga } from './settings/sagas.js'
import { walletSaga } from './wallet/sagas.js'
import { webSocketSaga } from './webSocket/sagas.js'
import { walletOptionsSaga } from './walletOptions/sagas.js'
import { kvStoreSagasFactory } from './kvStore/sagas.js'

export const coreSagasFactory = ({ api, socket } = {}) => ({
  data: dataSagasFactory({ api, socket }),
  settings: settingsSaga({ api, socket }),
  wallet: walletSaga({ api, socket }),
  walletOptions: walletOptionsSaga({ api, socket }),
  webSocket: webSocketSaga({ api, socket }),
  kvStore: kvStoreSagasFactory({ api })
})
