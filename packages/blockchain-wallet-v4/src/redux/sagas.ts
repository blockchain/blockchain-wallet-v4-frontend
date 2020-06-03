import data from './data/sagas'
import kvStore from './kvStore/sagas'
import payment from './payment/sagas'
import settings from './settings/sagas'
import wallet from './wallet/sagas'
import walletOptions from './walletOptions/sagas'

export default ({ api, libcoins, networks, options }) => ({
  data: data({ api, networks }),
  settings: settings({ api }),
  wallet: wallet({ api, libcoins, networks }),
  walletOptions: walletOptions({ api }),
  kvStore: kvStore({ api, networks }),
  payment: payment({ api, options })
})
