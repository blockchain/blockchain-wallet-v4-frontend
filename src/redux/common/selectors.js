import { Wrapper, Wallet, HDWallet, HDAccount, Address } from '../../types'

export const commonSelectorsFactory = ({walletPath, dataPath, settingsPath}) => {

  const wallet = state => state[walletPath]

  return {
    wallet: wallet,
  }
}
