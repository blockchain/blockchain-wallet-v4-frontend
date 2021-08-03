import { HDAccount, Wallet } from '../../../types'
import * as S from '../../selectors'
import { ADDRESS_TYPES } from '../btc/utils'

export const fromAccount = (network, state, index, coin) => {
  const wallet = S.wallet.getWallet(state)
  const account = Wallet.getAccount(index, wallet).get()
  const xpub = HDAccount.selectXpub(account, 'legacy')

  const changeIndex = S.data.bch.getChangeIndex(xpub, state)
  const changeAddress = changeIndex
    .map((index) => HDAccount.getChangeAddress(account, index, network, 'legacy'))
    .getOrFail('missing_change_address')

  return {
    change: changeAddress,
    from: [xpub],
    fromAccountIdx: index,
    fromType: ADDRESS_TYPES.ACCOUNT
  }
}

export default fromAccount
