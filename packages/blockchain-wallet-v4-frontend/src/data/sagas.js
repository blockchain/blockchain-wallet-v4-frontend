import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import { sfoxService } from 'services/SfoxService'
import { coinifyService } from 'services/CoinifyService'
import * as auth from './auth/sagas'
import * as components from './components/sagas'
import * as modules from './modules/sagas'
import * as preferences from './preferences/sagas'
import * as wallet from './wallet/sagas'

const core = coreSagasFactory({ api, socket, sfoxService, coinifyService })

export {
  auth,
  components,
  modules,
  preferences,
  core,
  wallet
}
