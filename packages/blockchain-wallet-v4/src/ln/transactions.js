import {fromJS} from 'immutable'
import * as Script from './scripts'
import * as hash from 'bcoin/lib/crypto/digest'
import xor from 'buffer-xor'
import {Direction, Funded} from './state'
import {derivePubKey, deriveRevocationPubKey} from './key_derivation'

let bcoin = require('bcoin/lib/bcoin-browser')
let Tx = bcoin.tx
let ScriptBcoin = bcoin.script
let ec = bcoin.secp256k1
var Long = require('long')

// https://github.com/lightningnetwork/lightning-rfc/blob/master/03-transactions.md#fee-calculation
let commitmentWeight = htlcCount => 724 + 172 * htlcCount
let htlcTimeoutWeight = 663
let htlcSuccessWeight = 703

let weightToFee = (weight, fee) => Math.floor((weight * fee) / 1000)
let roundDown = (num) => num.div(1000).toNumber()

let htlcTimeoutFee = fee => weightToFee(htlcTimeoutWeight, fee)
let htlcSuccessFee = fee => weightToFee(htlcSuccessWeight, fee)

let getCommitmentLocktime = obscuredTxNum => {
  let b = Buffer.from('20000000', 'hex')

  obscuredTxNum.copy(b, 1, 3, 6)
  return b.readUInt32BE()
}

let getCommitmenSequence = obscuredTxNum => {
  let b = Buffer.from('80000000', 'hex')
  obscuredTxNum.copy(b, 1, 0, 3)
  return b.readUInt32BE()
}

export let intTo48Bit = num => {
  let l = new Long(num)

  let b = Buffer.alloc(8)
  b.writeInt32BE(l.hi, 0)
  b.writeInt32BE(l.low, 4)

  return b.slice(2)
}
let obscureTransactionNumber = (transactionNumber, obscuredHash) => {
  let xorHash = obscuredHash.slice(26)
  let number = intTo48Bit(transactionNumber)

  return xor(number, xorHash)
}

let trimPredicate = (feePerKw, dustLimit) => p => {
  let {direction, _, payment} = p.toJS()
  dustLimit = Long.fromNumber(dustLimit)

  if (direction === Direction.OFFERED) {
    return payment.amount.div(1000).sub(htlcTimeoutFee(feePerKw)).greaterThanOrEqual(dustLimit)
  } else {
    return payment.amount.div(1000).sub(htlcSuccessFee(feePerKw)).greaterThanOrEqual(dustLimit)
  }
}

let baseWeight = paymentAmount => commitmentWeight(paymentAmount)
let baseFee = (paymentAmount, feePerKw) => weightToFee(baseWeight(paymentAmount), feePerKw)

let substractFeeFromFunder = (funded, fee) => state => {
  if (funded === Funded.LOCAL_FUNDED) {
    return state
      .update('amountMsatLocal', i => i.sub(fee * 1000))
  } else {
    return state
      .update('amountMsatRemote', i => i.sub(fee * 1000))
  }
}

// getTransactionInput : TransactionOutpoint -> ECKey -> ECKey
export let getTransactionInput = (outpoint, key1, key2) => {
  let fundingScript = Script.getFundingOutputScript(key1.get('pub'), key2.get('pub'))
  return fromJS({outpoint, script: fundingScript})
}

let reverseBytes = (b) => {
  return Buffer.from(b.toString('hex').match(/.{2}/g).reverse().join(''), 'hex')
}

export let createKeySet = (
  commitmentPoint,
  paymentBasepointLocal,
  delayedPaymentBasepointLocal,
  revocationPaymentBasepointLocal,
  paymentBasepointRemote) => {
  return {
    revocationKey: deriveRevocationPubKey(revocationPaymentBasepointLocal, commitmentPoint),
    delayedKey: derivePubKey(delayedPaymentBasepointLocal, commitmentPoint),
    localKey: derivePubKey(paymentBasepointLocal, commitmentPoint),
    remoteKey: derivePubKey(paymentBasepointRemote, commitmentPoint)
  }
}

export let getCommitmentTransaction = (input, obscuredHash, stateLocal, feeRate, dustLimit, toSelfDelay, keySet, funded) => {
  let builder = new bcoin.mtx()
  builder.version = 2

  let txNumber = stateLocal.get('commitmentNumber')

  let sequence = getCommitmenSequence(obscureTransactionNumber(txNumber, obscuredHash))
  let locktime = getCommitmentLocktime(obscureTransactionNumber(txNumber, obscuredHash))

  let prevOut = new bcoin.outpoint(
    reverseBytes(input.getIn(['outpoint', 'hash'])).toString('hex'),
    input.getIn(['outpoint', 'n']))

  builder.addInput({
    prevout: prevOut,
    sequence: sequence,
    script: null
  })

  builder.setLocktime(locktime)

  let payments = stateLocal.get('committed')
  let paymentsTrimmed = payments.filter(trimPredicate(feeRate, dustLimit))

  // Calculate the total fee for the commitment transaction
  let fee = baseFee(paymentsTrimmed.length, feeRate)

  // Substract fee from whoever funded the channel
  stateLocal = stateLocal.update(substractFeeFromFunder(funded, fee))
  let amountLocal = stateLocal.get('amountMsatLocal').div(1000).toNumber()
  let amountRemote = stateLocal.get('amountMsatRemote').div(1000).toNumber()

  let revocationKey = keySet.revocationKey.pub
  let delayedKey = keySet.delayedKey.pub
  let localKey = keySet.localKey.pub
  let remoteKey = keySet.remoteKey.pub

  if (amountLocal >= dustLimit) {
    builder.addOutput(
      ScriptBcoin.fromRaw(
        Script.wrapP2WSH(
          Script.getToLocalOutputScript(revocationKey, toSelfDelay, delayedKey))), amountLocal)
  }

  if (amountRemote >= dustLimit) {
    builder.addOutput(
      ScriptBcoin.fromRaw(
        Script.getToRemoteOutputScript(remoteKey)), amountRemote)
  }

  paymentsTrimmed
    .forEach(p => {
      let {direction, _, payment} = p.toJS()
      if (direction === Direction.OFFERED) {
        builder.addOutput(
          ScriptBcoin.fromRaw(
            Script.wrapP2WSH(Script.getOfferedHTLCOutput(revocationKey, remoteKey, localKey, payment.paymentHash))),
            roundDown(payment.amount))
      } else {
        builder.addOutput(
          ScriptBcoin.fromRaw(
            Script.wrapP2WSH(Script.getReceivedHTLCOutput(revocationKey, remoteKey, localKey, payment.paymentHash, payment.cltvTimeout))),
            roundDown(payment.amount))
      }
    })

  builder.sortMembers()
  return builder.toTX().toRaw()
}

export let signCommitmentTransaction = (inputValue, tx, keySign, keyRemote) => {
  let t = Tx.fromRaw(tx)
  let inputScript = ScriptBcoin.fromRaw(Script.getFundingOutputScript(keySign.pub, keyRemote.pub))
  let hash = t.signatureHash(0, inputScript, inputValue, 1, 1)
  let sig = ec.sign(hash, keySign.priv)
  return Buffer.concat([sig, Buffer.from('01', 'hex')])
}

export let addWitness = (tx, index, script) => {
  let t = new bcoin.mtx.fromRaw(tx)
  t.inputs[index].witness = new bcoin.witness(script)
  return t.toTX().toRaw()
}
