import { commonSagasFactory } from './common/sagas.js'
import { dataSagasFactory } from './data/sagas.js'
import { settingsSaga } from './settings/sagas.js'
import { walletSaga } from './wallet/sagas.js'
import { webSocketSaga } from './webSocket/sagas.js'
import { walletOptionsSaga } from './walletOptions/sagas.js'
import { kvStoreSagasFactory } from './kvStore/sagas.js'

export const coreSagasFactory = ({ api, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket } = {}) => ({
  common: commonSagasFactory({ api, dataPath, walletPath, settingsPath, walletOptionsPath, kvStorePath, socket }),
  data: dataSagasFactory({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  settings: settingsSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  wallet: walletSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  walletOptions: walletOptionsSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  webSocket: webSocketSaga({ api, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  kvStore: kvStoreSagasFactory({ api, kvStorePath, walletPath })
})
