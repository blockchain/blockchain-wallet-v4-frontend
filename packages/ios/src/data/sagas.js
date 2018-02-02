// -- EXPOSE ALL SAGAS (INCLUDING SAGAS FROM THE CORE) -- //
import { api } from '../services/ApiService.js'
import { socket } from '../services/SocketService.js'
import * as auth from './auth/sagas'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'

const core = coreSagasFactory({ api, socket })

export {
  auth,
  core
}
