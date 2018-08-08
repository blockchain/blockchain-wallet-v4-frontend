import data from './data/sagas'
import settings from './settings/sagas'
import wallet from './wallet/sagas'
import walletOptions from './walletOptions/sagas'
import kvStore from './kvStore/sagas'
import payment from './payment/sagas'

export default ({ api, networks }) => ({
  data: data({ api }),
  settings: settings({ api }),
  wallet: wallet({ api, networks }),
  walletOptions: walletOptions({ api }),
  kvStore: kvStore({ api }),
  payment: payment({ api })
})
