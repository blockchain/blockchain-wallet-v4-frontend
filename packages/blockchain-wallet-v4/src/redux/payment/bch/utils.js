import { HDAccount, Wallet } from '../../../types'
import * as S from '../../selectors'
import { ADDRESS_TYPES } from '../btc/utils'

export const fromAccount = (network, state, index, coin) => {
  const wallet = S.wallet.getWallet(state)
  let account = Wallet.getAccount(index, wallet).get()
  if (account.derivations) {
    let xpub = HDAccount.selectXpub(account, 'legacy')

    let changeIndex = S.data.bch.getChangeIndex(xpub, state)
    let changeAddress = changeIndex
      .map(index =>
        HDAccount.getChangeAddress(account, index, network, 'legacy')
      )
      .getOrFail('missing_change_address')

    return {
      fromType: ADDRESS_TYPES.ACCOUNT,
      from: [xpub],
      change: changeAddress,
      fromAccountIdx: index
    }
    // TODO: SEGWIT remove w/ DEPRECATED_V3
  } else {
    let changeIndex = S.data.bch.getChangeIndex(account.xpub, state)
    let changeAddress = changeIndex
      .map(index => HDAccount.getChangeAddress(account, index, network))
      .getOrFail('missing_change_address')

    return {
      fromType: ADDRESS_TYPES.ACCOUNT,
      from: [account.xpub],
      change: changeAddress,
      fromAccountIdx: index
    }
  }
}
