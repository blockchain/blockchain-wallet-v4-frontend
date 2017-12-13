import { bitcoin } from './bitcoin/sagas.js'
import { ethereum } from './ethereum/sagas.js'

export const commonSagasFactory = ({ api, socket } = {}) => ({
  bitcoin: bitcoin({ api, socket }),
  ethereum: ethereum({ api, socket })
})
