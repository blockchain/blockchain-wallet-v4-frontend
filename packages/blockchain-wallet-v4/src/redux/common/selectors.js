import { bitcoin } from './bitcoin/selectors.js'
import { ethereum } from './ethereum/selectors.js'

export const commonSelectorsFactory = ({ api, kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket } = {}) => ({
  bitcoin: bitcoin({ kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket }),
  ethereum: ethereum({ kvStorePath, dataPath, walletPath, settingsPath, walletOptionsPath, socket })
})
