/* eslint-disable new-cap */
import * as Script from './scripts'
import xor from 'buffer-xor'
import {Direction, Funded} from './state'
import {derivePubKey, deriveRevocationPubKey} from './key_derivation'

let bcoin = require('bcoin/lib/bcoin-browser')
let Tx = bcoin.tx
let ScriptBcoin = bcoin.script
let ec = bcoin.secp256k1
let Long = require('long')

export let Commitment = (commitmentTx, commitmentSig, payments, paymentTxs, paymentSigs) =>
                      ({ commitmentTx, commitmentSig, payments, paymentTxs, paymentSigs })

// https://github.com/lightningnetwork/lightning-rfc/blob/master/03-transactions.md#fee-calculation
let commitmentWeight = htlcCount => 724 + 172 * htlcCount
let htlcTimeoutWeight = 663
let htlcSuccessWeight = 703

let baseWeight = paymentAmount => commitmentWeight(paymentAmount)
let baseFee = (paymentAmount, feePerKw) => weightToFee(baseWeight(paymentAmount), feePerKw)

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

export let addWitness = (tx, index, script) => {
  let t = new bcoin.mtx.fromRaw(tx)
  t.inputs[index].witness = new bcoin.witness(script)
  return t.toTX().toRaw()
}

export let trimPredicate = (feePerKw, dustLimit) => p => {
  let {direction, _, payment} = p.toJS()
  dustLimit = Long.fromNumber(dustLimit)

  if (direction === Direction.OFFERED) {
    return payment.amount.div(1000).sub(htlcTimeoutFee(feePerKw)).greaterThanOrEqual(dustLimit)
  } else {
    return payment.amount.div(1000).sub(htlcSuccessFee(feePerKw)).greaterThanOrEqual(dustLimit)
  }
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

let getPaymentOutputScript = (revocationKey, remoteKey, localKey, p) => {
  let {direction, _, payment} = p.toJS()
  if (direction === Direction.OFFERED) {
    return Script.getOfferedHTLCOutput(revocationKey, remoteKey, localKey, payment.paymentHash)
  } else {
    return Script.getReceivedHTLCOutput(revocationKey, remoteKey, localKey, payment.paymentHash, payment.cltvTimeout)
  }
}

let getPaymentOutputScriptP2SH = (revocationKey, remoteKey, localKey, p) => {
  return ScriptBcoin.fromRaw(
      Script.wrapP2WSH(
        getPaymentOutputScript(revocationKey, remoteKey, localKey, p)))
}

let getPaymentAmount = p => p.getIn(['payment', 'amount'])

export let getCommitmentTransaction =
  (input, obscuredHash, payments, commitmentNumber, amountMsatLocal, amountMsatRemote,
   feeRate, dustLimit, toSelfDelay, keySet, funded) => {
    let commitmentBuilder = new bcoin.mtx()

    let sequence = getCommitmenSequence(obscureTransactionNumber(commitmentNumber, obscuredHash))
    let locktime = getCommitmentLocktime(obscureTransactionNumber(commitmentNumber, obscuredHash))

    let prevOut = new bcoin.outpoint(reverseBytes(input.hash).toString('hex'), input.n)

    commitmentBuilder.version = 2
    commitmentBuilder.addInput({prevout: prevOut, sequence: sequence})
    commitmentBuilder.setLocktime(locktime)

    let revocationKey = keySet.revocationKey.pub
    let delayedKey = keySet.delayedKey.pub
    let localKey = keySet.localKey
    let remoteKey = keySet.remoteKey.pub

    let paymentsTrimmed = payments
        .filter(trimPredicate(feeRate, dustLimit))
        .sort(sortPayments(revocationKey, remoteKey, localKey.pub))

    // Calculate the total fee for the commitment transaction
    let fee = baseFee(paymentsTrimmed.length, feeRate)

    let amountLocal = amountMsatLocal.div(1000).toNumber()
    let amountRemote = amountMsatRemote.div(1000).toNumber()

    // Substract fee from whoever funded the channel
    if (funded === Funded.LOCAL_FUNDED) {
      amountLocal -= fee
    } else {
      amountRemote -= fee
    }

    if (amountLocal >= dustLimit) {
      commitmentBuilder.addOutput(
        ScriptBcoin.fromRaw(
          Script.wrapP2WSH(
            Script.getToLocalOutputScript(revocationKey, toSelfDelay, delayedKey))), amountLocal)
    }

    if (amountRemote >= dustLimit) {
      commitmentBuilder.addOutput(
        ScriptBcoin.fromRaw(
          Script.getToRemoteOutputScript(remoteKey)), amountRemote)
    }

    paymentsTrimmed.forEach(p => {
      commitmentBuilder.addOutput(
        getPaymentOutputScriptP2SH(revocationKey, remoteKey, localKey.pub, p),
          roundDown(getPaymentAmount(p)))
    })

    commitmentBuilder.sortMembers()
    let commitmentTx = commitmentBuilder.toTX().toRaw()

    let commitmentSig
    if (keySet.fundingLocalKey.priv !== undefined) {
      commitmentSig = signCommitmentTransaction(
        input.value,
        commitmentTx,
        keySet.fundingLocalKey,
        keySet.fundingRemoteKey
      )
    }

    let paymentTxs = []
    let paymentTxsSigs = []

    for (let i = 0; i < paymentsTrimmed.length; i++) {
      let payment = paymentsTrimmed[i]
      let paymentPrevOut = new bcoin.outpoint(commitmentBuilder.hash().toString('hex'), i)
      let paymentTx = getPaymentTransaction(paymentPrevOut, feeRate, toSelfDelay, keySet, payment)

      if (localKey.priv !== undefined) {
        paymentTxsSigs.push(signPaymentTransaction(paymentTx, payment, revocationKey, remoteKey, localKey))
      }
      paymentTxs.push(paymentTx)
    }

    return Commitment(
      commitmentTx,
      commitmentSig,
      paymentsTrimmed,
      paymentTxs,
      paymentTxsSigs
    )
  }

export let signCommitmentTransaction = (inputValue, tx, keySign, keyRemote) => {
  let t = Tx.fromRaw(tx)
  let inputScript = ScriptBcoin.fromRaw(Script.getFundingOutputScript(keySign.pub, keyRemote.pub))
  let hash = t.signatureHash(0, inputScript, inputValue, 1, 1)
  let sig = ec.sign(hash, keySign.priv)
  return Buffer.concat([sig, Buffer.from('01', 'hex')])
}

export let sortPayments = (revocationKey, remoteKey, localKey) => (a, b) => {
  let cmp = a.getIn(['payment', 'amount']).div(1000).sub(
    b.getIn(['payment', 'amount']).div(1000)).toNumber()

  if (cmp !== 0) {
    return cmp
  }

  let scriptA = getPaymentOutputScriptP2SH(revocationKey, remoteKey, localKey, a)
  let scriptB = getPaymentOutputScriptP2SH(revocationKey, remoteKey, localKey, b)

  return scriptA.toRaw().compare(scriptB.toRaw())
}

export let getPaymentTransaction = (outpoint, feeRate, toSelfDelay, keySet, p) => {
  let {direction, _, payment} = p.toJS()

  let builder = new bcoin.mtx()
  builder.version = 2

  builder.addInput({
    prevout: outpoint,
    sequence: 0,
    script: null
  })

  let revocationKey = keySet.revocationKey.pub
  let delayedKey = keySet.delayedKey.pub

  let amount
  if (direction === Direction.OFFERED) {
    builder.setLocktime(payment.cltvTimeout)
    amount = roundDown(payment.amount) - htlcTimeoutFee(feeRate)
  } else {
    amount = roundDown(payment.amount) - htlcSuccessFee(feeRate)
  }

  let script = ScriptBcoin.fromRaw(
      Script.wrapP2WSH(Script.getHTLCFollowUpTx(revocationKey, toSelfDelay, delayedKey)))

  builder.addOutput(script, amount)
  return builder.toTX().toRaw()
}

export let signPaymentTransaction = (tx, p, revocationKey, remoteKey, localKey) => {
  let t = Tx.fromRaw(tx)
  let inputScript = ScriptBcoin.fromRaw(getPaymentOutputScript(revocationKey, remoteKey, localKey.pub, p))
  let hash = t.signatureHash(0, inputScript, p.getIn(['payment', 'amount']).div(1000).toNumber(), 1, 1)
  let sig = ec.sign(hash, localKey.priv)
  return Buffer.concat([sig, Buffer.from('01', 'hex')])
}

export let getPaymentInputScript = (revocationKey, remoteKey, localKey, p, sigRemote, sigLocal) => {
  let inputScript = getPaymentOutputScript(revocationKey.pub, remoteKey.pub, localKey.pub, p)
  let direction = p.get('direction')
  if (direction === Direction.OFFERED) {
    // This is the timeout transaction
    return [
      [],
      sigRemote,
      sigLocal,
      [],
      inputScript
    ]
  } else {
    // This is trying to redeem this transaction
    let paymentPreImage = p.getIn(['payment', 'paymentPreImage'])

    return [
      [],
      sigRemote,
      sigLocal,
      paymentPreImage,
      inputScript
    ]
  }
}
