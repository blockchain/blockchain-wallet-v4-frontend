import {
  any,
  curry,
  contains,
  equals,
  head,
  filter,
  lift,
  map,
  prop,
  toLower
} from 'ramda'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import {
  getDefaultAddress,
  getDefaultLabel,
  getEthereumTxNote
} from '../redux/kvStore/eth/selectors.js'
import { getLockboxEthAccounts } from '../redux/kvStore/lockbox/selectors.js'

// getType :: TX -> [String] -> String
const getType = (tx, addresses) => {
  const lowerAddresses = map(toLower, addresses)

  switch (true) {
    case contains(tx.from, lowerAddresses) && contains(tx.to, lowerAddresses):
      return 'Transferred'
    case contains(tx.from, lowerAddresses):
      return 'Sent'
    case contains(tx.to, lowerAddresses):
      return 'Received'
    default:
      return 'Unknown'
  }
}

export const getConfirmations = (blockNumber, latestBlockHeight) => {
  const conf = latestBlockHeight - blockNumber + 1
  return conf > 0 ? conf : 0
}

export const getTime = tx => {
  const date = moment.unix(tx.timeStamp).local()
  return equals(date.year(), moment().year())
    ? date.format('MMMM D @ h:mm A')
    : date.format('MMMM D YYYY @ h:mm A')
}

export const getFee = tx =>
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

export const _transformTx = curry(
  (addresses, latestBlock, getPartnerLabel, state, tx) => {
    const fee = getFee(tx)
    const type = toLower(getType(tx, addresses))
    const amount =
      type === 'sent' ? parseInt(tx.value) + parseInt(fee) : parseInt(tx.value)
    return {
      type,
      fee,
      amount,
      hash: tx.hash,
      to: getLabel(tx.to, state),
      from: getLabel(tx.from, state),
      description: getEthereumTxNote(state, tx.hash).getOrElse(''),
      partnerLabel: getPartnerLabel && getPartnerLabel(tx.hash),
      confirmations: getConfirmations(tx.blockNumber, latestBlock),
      timeFormatted: getTime(tx),
      time: tx.timeStamp
    }
  }
)

export const transformTx = _transformTx
