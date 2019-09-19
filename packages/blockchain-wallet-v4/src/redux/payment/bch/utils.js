import { Wallet, HDAccount } from '../../../types'
import { ADDRESS_TYPES } from '../btc/utils'
import * as S from '../../selectors'

export const fromAccount = (network, state, index, coin) => {
  const wallet = S.wallet.getWallet(state)
  let account = Wallet.getAccount(index, wallet).get()
  let xpub = HDAccount.selectXpub(account, 'legacy')

  let changeIndex = S.data.bch.getChangeIndex(xpub, state)
  let changeAddress = changeIndex
    .map(index => HDAccount.getChangeAddress(account, index, network, 'legacy'))
    .getOrFail('missing_change_address')

  return {
    fromType: ADDRESS_TYPES.ACCOUNT,
    from: [xpub],
    change: changeAddress,
    fromAccountIdx: index
  }
}
