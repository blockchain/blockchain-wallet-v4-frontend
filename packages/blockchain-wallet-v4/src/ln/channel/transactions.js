/* eslint-disable new-cap */
import * as Script from '../scripts'
import xor from 'buffer-xor'
import {Direction, Funded} from './state'
import {deriveKey, deriveRevocationPubKey} from '../key_derivation'
import {assertPubKey, sigToBitcoin, wrapHex} from '../helper'

let Tx = require('bcoin/lib/primitives/tx')
let MTx = require('bcoin/lib/primitives/mtx')
let Outpoint = require('bcoin/lib/primitives/outpoint')
let Witness = require('bcoin/lib/script/witness')
let ScriptBcoin = require('bcoin/lib/script/script')
let ec = require('secp256k1')
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

let getPaymentAmount = p => p.payment.amount

let getCommitmentLocktime = obscuredTxNum => {
  let b = wrapHex('20000000')
  obscuredTxNum.copy(b, 1, 3, 6)
  return b.readUInt32BE(0)
}

let getCommitmentSequence = obscuredTxNum => {
  let b = wrapHex('80000000')
  obscuredTxNum.copy(b, 1, 0, 3)
  return b.readUInt32BE(0)
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
  let t = new MTx.fromRaw(tx)
  t.inputs[index].witness = new Witness(script)
  return t.toTX().toRaw()
}

export let trimPredicate = (feePerKw, dustLimit) => p => {
  let {direction, _, payment} = p
  dustLimit = Long.fromNumber(dustLimit)

  let fee = direction === Direction.OFFERED ? htlcTimeoutFee(feePerKw) : htlcSuccessFee(feePerKw)
  return payment.amount.div(1000).sub(fee).greaterThanOrEqual(dustLimit)
}

export let createSigCheckKeySet = (channel) => {
  let stateRemote = channel.remote
  let paramsLocal = channel.paramsLocal
  let paramsRemote = channel.paramsRemote

  return createKeySetInternal(
    stateRemote.nextCommitmentPoint,
    paramsLocal.revocationBasepoint,
    paramsRemote.paymentBasepoint,
    paramsRemote.delayedPaymentBasepoint,
    paramsLocal.htlcBasepoint,
    paramsRemote.htlcBasepoint,
    paramsLocal.fundingKey,
    paramsRemote.fundingKey)
}

export let createSigCreateKeySet = (channel) => {
  let stateLocal = channel.local
  let paramsLocal = channel.paramsLocal
  let paramsRemote = channel.paramsRemote

  return createKeySetInternal(
    stateLocal.nextCommitmentPoint,
    paramsRemote.revocationBasepoint,
    paramsLocal.paymentBasepoint,
    paramsLocal.delayedPaymentBasepoint,
    paramsRemote.htlcBasepoint,
    paramsLocal.htlcBasepoint,
    paramsLocal.fundingKey,
    paramsRemote.fundingKey)
}

let createKeySetInternal = (
  commitmentPoint,
  revocationPaymentBasepoint,
  paymentBasepoint,
  delayedPaymentBasepoint,
  localHtlcBasepoint,
  remoteHtlcBasepoint,
  localFundingKey,
  remoteFundingKey) => {
  assertPubKey(commitmentPoint)
  assertPubKey(revocationPaymentBasepoint.pub)
  assertPubKey(paymentBasepoint.pub)
  assertPubKey(delayedPaymentBasepoint.pub)
  assertPubKey(localHtlcBasepoint.pub)
  assertPubKey(remoteHtlcBasepoint.pub)

  assertPubKey(localFundingKey.pub)
  assertPubKey(remoteFundingKey.pub)

  // If we generate a transaction for the other party, we need the secret to generate the corresponding signatures
  // If we just want to check signatures from the other party, all we need are the public keys
  return {
    revocationKey: deriveRevocationPubKey(revocationPaymentBasepoint.pub, commitmentPoint),
    remoteKey: deriveKey(paymentBasepoint, commitmentPoint),
    delayedKey: deriveKey(delayedPaymentBasepoint, commitmentPoint),
    localHtlcKey: deriveKey(localHtlcBasepoint, commitmentPoint),
    remoteHtlcKey: deriveKey(remoteHtlcBasepoint, commitmentPoint),
    localFundingKey,
    remoteFundingKey
  }
}

let getPaymentOutputScript = (revocationKey, remoteHtlcKey, localHtlcKey, p) => {
  let {direction, _, payment} = p
  if (direction === Direction.OFFERED) {
    return Script.getOfferedHTLCOutput(revocationKey, remoteHtlcKey, localHtlcKey, payment.paymentHash)
  } else {
    return Script.getReceivedHTLCOutput(revocationKey, remoteHtlcKey, localHtlcKey, payment.paymentHash, payment.cltvTimeout)
  }
}

let getPaymentOutputScriptP2SH = (revocationKey, remoteHtlcKey, localHtlcKey, p) => {
  return ScriptBcoin.fromRaw(
      Script.wrapP2WSH(
        getPaymentOutputScript(revocationKey, remoteHtlcKey, localHtlcKey, p)))
}

export let getFundingTransaction =
  (inputs, remoteKey, localKey, amount, feeRatePerKw) => {
    let txBuilder = new MTx()

    let totalIn = 0
    for (let input of inputs) {
      txBuilder.addInput({prevout: new Outpoint(input.hash.reverse().toString('hex'), input.n)})
      totalIn += input.value
    }

    txBuilder.version = 2
    txBuilder.addOutput(
      ScriptBcoin.fromRaw(
        Script.wrapP2WSH(
          Script.getFundingOutputScript(localKey, remoteKey))
      ), amount)

    // TODO add change output
    // TODO calculate fee
    // ^ these TODOs can be solved by using our JS wallet instead

    let i = 0
    for (let input of inputs) {
      let pubkey = ec.publicKeyCreate(input.privKey, true)
      let inputScript = ScriptBcoin.fromRaw(Script.getP2PKHScript(pubkey))
      let hash = txBuilder.toTX().signatureHash(i, inputScript, input.value, 1, 1)
      let sig = ec.sign(hash, input.privKey).signature
      txBuilder.inputs[0].witness = new Witness(Script.getP2WPKHRedeemScript(pubkey, sig))

      i++
    }

    return txBuilder.toTX()
  }

export let getCommitmentTransaction =
  (input, obscuredHash, payments, commitmentNumber, amountMsatLocal, amountMsatRemote,
   feeRate, dustLimit, toSelfDelay, keySet, funded) => {
    let commitmentBuilder = new MTx()

    let sequence = getCommitmentSequence(obscureTransactionNumber(commitmentNumber, obscuredHash))
    let locktime = getCommitmentLocktime(obscureTransactionNumber(commitmentNumber, obscuredHash))

    let prevOut = new Outpoint(input.hash.toString('hex'), input.n)

    commitmentBuilder.version = 2
    commitmentBuilder.addInput({prevout: prevOut, sequence: sequence})
    commitmentBuilder.setLocktime(locktime)

    let revocationKey = keySet.revocationKey
    let delayedKey = keySet.delayedKey.pub
    let remoteKey = keySet.remoteKey.pub
    let remoteHtlcKeyPub = keySet.remoteHtlcKey.pub
    let localHtlcKeyPub = keySet.localHtlcKey.pub

    let paymentsTrimmed = payments
        .filter(trimPredicate(feeRate, dustLimit))
        .sort(sortPayments(revocationKey, remoteHtlcKeyPub, localHtlcKeyPub))

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
        getPaymentOutputScriptP2SH(revocationKey, remoteHtlcKeyPub, localHtlcKeyPub, p),
          roundDown(getPaymentAmount(p)))
    })

    commitmentBuilder.sortMembers()
    console.info('Built commitment Tx: ' + commitmentBuilder.toTX().toRaw().toString('hex'))
    let commitmentTx = commitmentBuilder.toTX().toRaw()

    let commitmentSig
    if (keySet.localFundingKey.priv !== null) {
      commitmentSig = signCommitmentTransaction(
        input.value,
        commitmentTx,
        keySet.localFundingKey,
        keySet.remoteFundingKey
      )
    }

    let paymentTxs = []
    let paymentTxsSigs = []

    for (let i = 0; i < paymentsTrimmed.length; i++) {
      let payment = paymentsTrimmed[i]
      let paymentPrevOut = new Outpoint(commitmentBuilder.hash().toString('hex'), i)
      let paymentTx = getPaymentTransaction(paymentPrevOut, feeRate, toSelfDelay, keySet, payment)

      paymentTxsSigs.push(signPaymentTransaction(paymentTx, payment, revocationKey, remoteHtlcKeyPub, keySet.localHtlcKey))
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
  return ec.sign(hash, keySign.priv).signature
}

export let checkCommitmentSignature = (inputValue, tx, keyLocal, keyRemote, sig) => {
  let t = Tx.fromRaw(tx)
  let inputScript = ScriptBcoin.fromRaw(Script.getFundingOutputScript(keyLocal.pub, keyRemote.pub))
  let hash = t.signatureHash(0, inputScript, inputValue, 1, 1)
  return ec.verify(hash, sig, keyRemote.pub)
}

export let sortPayments = (revocationKey, remoteKey, localKey) => (a, b) => {
  let cmp = a.payment.amount.div(1000).sub(
    b.payment.amount.div(1000)).toNumber()

  if (cmp !== 0) {
    return cmp
  }

  let scriptA = getPaymentOutputScriptP2SH(revocationKey, remoteKey, localKey, a)
  let scriptB = getPaymentOutputScriptP2SH(revocationKey, remoteKey, localKey, b)

  return scriptA.toRaw().compare(scriptB.toRaw())
}

export let getPaymentTransaction = (outpoint, feeRate, toSelfDelay, keySet, p) => {
  let {direction, _, payment} = p

  let builder = new MTx()
  builder.version = 2

  builder.addInput({
    prevout: outpoint,
    sequence: 0,
    script: null
  })

  let revocationKey = keySet.revocationKey
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
  let hash = t.signatureHash(0, inputScript, p.payment.amount.div(1000).toNumber(), 1, 1)
  let sig = ec.sign(hash, localKey.priv)
  return sig.signature
}

export let getPaymentInputScript = (revocationKey, remoteKey, localKey, p, sigRemote, sigLocal) => {
  let inputScript = getPaymentOutputScript(revocationKey, remoteKey.pub, localKey.pub, p)
  let direction = p.direction
  if (direction === Direction.OFFERED) {
    // This is the timeout transaction
    return [
      [],
      sigToBitcoin(sigRemote),
      sigToBitcoin(sigLocal),
      [],
      inputScript
    ]
  } else {
    // This is trying to redeem this transaction
    let paymentPreImage = p.payment.paymentPreImage

    return [
      [],
      sigToBitcoin(sigRemote),
      sigToBitcoin(sigLocal),
      paymentPreImage,
      inputScript
    ]
  }
}
