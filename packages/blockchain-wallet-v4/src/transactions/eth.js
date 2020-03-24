import {
  any,
  curry,
  equals,
  filter,
  head,
  includes,
  lift,
  map,
  path,
  prop,
  toLower
} from 'ramda'
import {
  getDefaultAddress,
  getDefaultLabel,
  getErc20Accounts,
  getErc20TxNote,
  getEthTxNote
} from '../redux/kvStore/eth/selectors'
import { getLockboxEthAccounts } from '../redux/kvStore/lockbox/selectors'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import Remote from '../remote'

//
// Shared Utils
//
export const getTime = timeStamp => {
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
export const calculateEthTxFee = tx =>
  new BigNumber(tx.gasPrice || 0).multipliedBy(tx.gasUsed || tx.gas).toString()

export const getLabel = (address, state) => {
  const defaultLabelR = getDefaultLabel(state)
  const defaultAddressR = getDefaultAddress(state)
  const lockboxEthAccountsR = getLockboxEthAccounts(state)
  const transform = (defaultLabel, defaultAddress, lockboxEthAccounts) => {
    switch (true) {
      case equals(toLower(defaultAddress), toLower(address)):
        return defaultLabel
      case any(
        x => equals(toLower(x.addr), toLower(address)),
        lockboxEthAccounts
      ):
        const ethAccounts = filter(
          x => equals(toLower(x.addr), toLower(address)),
          lockboxEthAccounts
        )
        return prop('label', head(ethAccounts))
      default:
        return address
    }
  }
  const labelR = lift(transform)(
    defaultLabelR,
    defaultAddressR,
    lockboxEthAccountsR
  )
  return labelR.getOrElse(address)
}

export const _transformTx = curry((addresses, erc20Contracts, state, tx) => {
  const fee = calculateEthTxFee(tx)
  const type = toLower(getType(tx, addresses))
  const amount =
    type === 'sent' ? parseInt(tx.value) + parseInt(fee) : parseInt(tx.value)
  const time = tx.timestamp || tx.timeStamp

  return {
    amount,
    blockHeight: tx.blockNumber,
    description: getEthTxNote(state, tx.hash).getOrElse(''),
    fee: Remote.Success(fee),
    from: getLabel(tx.from, state, ''),
    hash: tx.hash,
    time,
    timeFormatted: getTime(time),
    insertedAt: Number(time) * 1000,
    to: getLabel(tx.to, state, ''),
    erc20: includes(tx.to, erc20Contracts.map(toLower)),
    type
  }
})

//
// ERC20
//
export const getErc20Label = (address, token, state) => {
  const erc20AccountsR = getErc20Accounts(state)
  const ethAddressR = getDefaultAddress(state)
  const transform = (ethAddress, erc20Accounts) => {
    if (equals(toLower(ethAddress), toLower(address))) {
      return path([token, 'label'], erc20Accounts)
    }
    return address
  }
  const labelR = lift(transform)(ethAddressR, erc20AccountsR)
  return labelR.getOrElse(address)
}

export const _transformErc20Tx = curry((addresses, state, token, tx) => {
  const type = toLower(getType(tx, addresses))
  const time = tx.timestamp || tx.timeStamp

  return {
    amount: parseInt(tx.value),
    blockHeight: tx.blockNumber,
    description: getErc20TxNote(state, token, tx.transactionHash).getOrElse(''),
    fee: Remote.NotAsked,
    from: getErc20Label(tx.from, token, state),
    hash: tx.transactionHash,
    timeFormatted: getTime(time),
    insertedAt: Number(time) * 1000,
    time,
    to: getErc20Label(tx.to, token, state),
    type
  }
})

export const transformTx = _transformTx
export const transformErc20Tx = _transformErc20Tx
