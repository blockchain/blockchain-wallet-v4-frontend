import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import { sfoxService } from 'services/SfoxService'
import * as auth from './auth/sagas'
import * as modules from './modules/sagas'
import * as wallet from './wallet/sagas'

const core = coreSagasFactory({ api, socket, sfoxService })

export {
  auth,
  modules,
  core,
  wallet
}
