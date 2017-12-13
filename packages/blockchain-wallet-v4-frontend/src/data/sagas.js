import { api } from 'services/ApiService'
import { socket } from 'services/Socket'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as auth from './auth/sagas.js'
import * as data from './data/sagas.js'
import * as payment from './payment/sagas.js'
import * as settings from './settings/sagas.js'
import * as wallet from './wallet/sagas.js'

const core = coreSagasFactory({ api, socket })

export {
  auth,
  core,
  data,
  payment,
  settings,
  wallet
}
