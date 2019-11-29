import data from './data/sagas'
import settings from './settings/sagas'
import wallet from './wallet/sagas'
import walletOptions from './walletOptions/sagas'
import kvStore from './kvStore/sagas'
import payment from './payment/sagas'

export default (...args) => ({
  data: data(...args),
  settings: settings(...args),
  wallet: wallet(...args),
  walletOptions: walletOptions(...args),
  kvStore: kvStore(...args),
  payment: payment(...args)
})
