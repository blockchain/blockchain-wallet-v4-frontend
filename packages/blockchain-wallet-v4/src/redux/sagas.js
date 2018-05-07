import data from './data/sagas'
import settings from './settings/sagas'
import wallet from './wallet/sagas'
import walletOptions from './walletOptions/sagas'
import kvStore from './kvStore/sagas'
import refresh from './refresh/sagas'
import payment from './payment/sagas'

export default ({ api }) => ({
  data: data({ api }),
  settings: settings({ api }),
  wallet: wallet({ api }),
  walletOptions: walletOptions({ api }),
  kvStore: kvStore({ api }),
  refresh: refresh({ api }),
  payment: payment({ api })
})
