import { Wallet, HDWallet, HDWalletList, HDAccountList, AddressMap,
         TXNotes, Address, HDAccount, AddressBook, AddressBookEntry } from '../../types'
import { prop, compose, curry, mapAccum, isNil, not,
         propSatisfies, ifElse, always, propEq, propOr, find } from 'ramda'

// ---------------------------------------------------------------------------------------------
const unpackInput = prop('prev_out')
const isLegacy = (wallet, coin) => compose(not, isNil, AddressMap.selectAddress(coin.addr), Wallet.selectAddresses)(wallet)
const isAccount = coin => !!coin.xpub
const isAccountChange = x => isAccount(x) && x.xpub.path.split('/')[1] === '1'
const accountPath = (index, coin) => index + coin.xpub.path.substr(1)
const receiveIndex = coin => {
  if (!coin || !coin.xpub || !coin.xpub.path) return
  if (!coin.xpub.path.split('/').length === 3) return
  return parseInt(coin.xpub.path.substr(1).split('/')[2])
}

// const isCoinBase = (input) => (input == null || input.prev_out == null || input.prev_out.addr == null)
// function unpackInput (input) {
//   if (isCoinBase(input)) {
//     var totalOut = this.out.reduce(function (sum, out) { return sum + out.value; }, 0);
//     return {addr: 'Coinbase', value: totalOut};
//   } else {
//     return input.prev_out;
//   }
// }

const tagCoin = curry((wallet, coin) => {
  switch (true) {
    case isLegacy(wallet, coin):
      const address = compose(AddressMap.selectAddress(coin.addr), Wallet.selectAddresses)(wallet)
      return {
        address: coin.addr,
        amount: coin.value,
        change: false,
        coinType: 'legacy',
        label: Address.selectLabel(address),
        isWatchOnly: Address.isWatchOnly(address)
      }
    case isAccount(coin):
      const account = compose(HDAccountList.selectByXpub(coin.xpub.m),
                              HDWallet.selectAccounts,
                              HDWalletList.selectHDWallet,
                              Wallet.selectHdWallets)(wallet)
      const index = HDAccount.selectIndex(account)
      return {
        accountIndex: index,
        address: coin.addr,
        amount: coin.value,
        change: isAccountChange(coin),
        coinType: accountPath(index, coin),
        label: HDAccount.selectLabel(account),
        isWatchOnly: HDAccount.isWatchOnly(account),
        receiveIndex: receiveIndex(coin) //only if change?
      }
    default:
      const bookEntry = compose(AddressBook.selectAddressLabel(coin.addr), Wallet.selectAddressBook)(wallet)
      return {
        address: coin.addr,
        amount: coin.value,
        change: false,
        coinType: 'external',
        label: bookEntry ? AddressBookEntry.selectLabel(bookEntry) : null,
        isWatchOnly: false
      }
  }
})

const txtype = (result, fee) => {
  const impact = result + fee
  switch (true) {
    case impact === 0:
      return 'Transferred'
    case result < 0:
      return 'Sent'
    case result > 0:
      return 'Received'
    default:
      return 'Unknown'
  }
}

// amount is what we show on the transaction feed
// result is internalreceive - internalspend
const computeAmount = (type, inputData, outputData) => {
  switch (type) {
    case 'Transferred':
      return propOr(0, 'internal', outputData) - propOr(0, 'change', outputData)
    case 'Sent':
    case 'Received':
    default:
      return propOr(0, 'internal', outputData) - propOr(0, 'internal', inputData)
  }
}

const init = {
  total: 0,
  internal: 0,
  isWatchOnly: false,
  change: 0
}

// internalAmount :: taggedCoin -> Integer
const internalAmount = ifElse(
  propSatisfies(x => x !== 'external', 'coinType'),
  prop('amount'),
  always(0)
)

const changeAmount = ifElse(
  propEq('change', true),
  prop('amount'),
  always(0)
)

const reduceCoins = (acc, taggedCoin) => {
  return {
    total: acc.total + taggedCoin.amount,
    internal: acc.internal + internalAmount(taggedCoin),
    isWatchOnly: acc.isWatchOnly || taggedCoin.isWatchOnly,
    change: acc.change + changeAmount(taggedCoin)
  }
}

var appender = curry((tagger, acc, coin) => {
  const taggedCoin = tagger(coin)
  return [reduceCoins(acc, taggedCoin), taggedCoin]
})

const selectFromAndto = (inputs, outputs) => {
  const myOutput = find(propEq('change', false))(outputs) || outputs[0]
  return {
    from: inputs[0].label || inputs[0].address,
    to: myOutput.label || myOutput.address
  }
}

// ---------------------------------------------------------------------------------------------
export const transformTx = curry((wallet, currentBlockHeight, tx) => {
  const txNotes = Wallet.selectTxNotes(wallet)
  const conf = currentBlockHeight - tx.block_height + 1
  const confirmations = conf > 0 ? conf : 0
  const type = txtype(tx.result, tx.fee)
  const inputTagger = compose(tagCoin(wallet), unpackInput)
  const outputTagger = tagCoin(wallet)
  const [inputData, inputs] = mapAccum(appender(inputTagger), init, prop('inputs', tx))
  const [outputData, outputs] = mapAccum(appender(outputTagger), init, prop('out', tx))
  const { from, to } = selectFromAndto(inputs, outputs)
  return ({
    double_spend: tx.double_spend,
    hash: tx.hash,
    amount: computeAmount(type, inputData, outputData),
    type: type,
    description: TXNotes.selectNote(tx.hash, txNotes),
    time: tx.time,
    fee: tx.fee,
    confirmations: confirmations,
    inputs: inputs,
    outputs: outputs,
    formWatchOnly: inputData.isWatchOnly,
    toWatchOnly: outputData.isWatchOnly,
    from: from, // based on inputs 
    to: to,  // based on outputs
    // properties that frontend should compute
    status: null, // based on confirmations
    initial_value: null, // when the user opens the modal
  })
})
