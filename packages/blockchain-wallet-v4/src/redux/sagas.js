import data from './data/sagas'
import settings from './settings/sagas'
import wallet from './wallet/sagas.ts'
import walletOptions from './walletOptions/sagas'
import kvStore from './kvStore/sagas'
import payment from './payment/sagas'

export default ({ api, networks, options, ...rest }) => ({
  data: data({ api, options, networks, ...rest }),
  settings: settings({ api }),
  wallet: wallet({ api, networks, ...rest }),
  walletOptions: walletOptions({ api }),
  kvStore: kvStore({ api, networks }),
  payment: payment({ api, options })
})
