// -- EXPOSE ALL ACTIONS (INCLUDING ACTIONS FROM THE CORE) -- //
import { coreActions as core } from 'blockchain-wallet-v4/src'
import * as auth from './auth/actions'

export {
  core,
  auth
}
