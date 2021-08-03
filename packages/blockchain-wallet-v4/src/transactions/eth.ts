import moment from 'moment'
import { any, curry, equals, filter, head, includes, lift, map, path, prop, toLower } from 'ramda'

import { calculateFee } from 'blockchain-wallet-v4/src/utils/eth'
import { EthRawTxType } from 'core/network/api/eth/types'

import {
  getDefaultAddress,
  getDefaultLabel,
  getErc20Accounts,
  getErc20TxNote,
  getEthTxNote
} from '../redux/kvStore/eth/selectors'
import { getLockboxEthAccounts } from '../redux/kvStore/lockbox/selectors'
import Remote from '../remote'

//
// Shared Utils
//
export const getTime = (timeStamp) => {
  const date = moment.unix(timeStamp).local()
  return equals(date.year(), moment().year())
    ? date.format('MMMM D @ h:mm A')
    : date.format('MMMM D YYYY @ h:mm A')
}

const getType = (tx, addresses) => {
  const lowerAddresses = map(toLower, addresses)

  switch (true) {
    case includes(tx.from, lowerAddresses) && includes(tx.to, lowerAddresses):
      return 'Transferred'
    case includes(tx.from, lowerAddresses):
      return 'Sent'
    case includes(tx.to, lowerAddresses):
      return 'Received'
    default:
      return 'Unknown'
  }
}

//
// ETH
//

export const getLabel = (address, state) => {
  const defaultLabelR = getDefaultLabel(state)
  const defaultAddressR = getDefaultAddress(state)
  const lockboxEthAccountsR = getLockboxEthAccounts(state)
  const transform = (defaultLabel, defaultAddress, lockboxEthAccounts) => {
    switch (true) {
      case equals(toLower(defaultAddress), toLower(address)):
        return defaultLabel
      case any(
        // @ts-ignore
        (x) => equals(toLower(x.addr), toLower(address)),
        lockboxEthAccounts
      ):
        const ethAccounts = filter(
          // @ts-ignore
          (x) => equals(toLower(x.addr), toLower(address)),
          lockboxEthAccounts
        )
        // @ts-ignore
        return prop('label', head(ethAccounts))
      default:
        return address
    }
  }
  const labelR = lift(transform)(defaultLabelR, defaultAddressR, lockboxEthAccountsR)
  return labelR.getOrElse(address)
}

export const _transformTx = curry((addresses, erc20Contracts, state, tx: EthRawTxType) => {
  const fee = calculateFee(tx.gasPrice, tx.state === 'CONFIRMED' ? tx.gasUsed : tx.gasLimit, false)
  const type = toLower(getType(tx, addresses))
  const amount =
    type === 'sent' ? parseInt(tx.value, 10) + parseInt(fee, 10) : parseInt(tx.value, 10)
  // @ts-ignore
  const time = tx.timestamp || tx.timeStamp
  const isErc20 = includes(tx.to, erc20Contracts.map(toLower))

  return {
    amount,
    blockHeight: tx.state === 'CONFIRMED' ? tx.blockNumber : undefined,
    data: isErc20 ? tx.data : null,
    description: getEthTxNote(state, tx.hash).getOrElse(''),
    erc20: isErc20,
    fee: Remote.Success(fee),
    from: getLabel(tx.from, state),
    hash: tx.hash,
    insertedAt: Number(time) * 1000,
    state: tx.state,
    time,
    timeFormatted: getTime(time),
    to: getLabel(tx.to, state),
    type
  }
})

//
// ERC20
//
export const getErc20Label = (address, token, state) => {
  const ethAddressR = getDefaultAddress(state)
  const transform = (ethAddress) => {
    if (equals(toLower(ethAddress), toLower(address))) {
      return `${token} Private Key Wallet`
    }
    return address
  }
  const labelR = lift(transform)(ethAddressR)
  return labelR.getOrElse(address)
}

export const _transformErc20Tx = curry((addresses, state, token, tx) => {
  const type = toLower(getType(tx, addresses))
  const time = tx.timestamp || tx.timeStamp

  return {
    amount: parseInt(tx.value, 10),
    blockHeight: tx.blockNumber,
    coin: token,
    description: getErc20TxNote(state, token, tx.transactionHash).getOrElse(''),
    fee: Remote.NotAsked,
    from: getErc20Label(tx.from, token, state),
    hash: tx.transactionHash,
    insertedAt: Number(time) * 1000,
    state: tx.state,
    time,
    timeFormatted: getTime(time),
    to: getErc20Label(tx.to, token, state),
    type
  }
})

export const transformTx = _transformTx
export const transformErc20Tx = _transformErc20Tx
