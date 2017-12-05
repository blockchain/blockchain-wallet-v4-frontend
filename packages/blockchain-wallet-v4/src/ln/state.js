import {fromJS} from 'immutable'

var Long = require('long')

export let State = () => fromJS({
  channels: {},
  connections: [],

  connected: false
})

export let Connection = () => ({
  connected: true,
  initSent: true,
  initReceived: false,

  gfRemote: [],
  lfRemote: [],

  channels: [],

  lastPing: 0,

  error: null
})

export let Wallet = () => ({
  unspents: [
    {privKey: Buffer.from('92fc477d4310b63613c84cbb17ce39f7bb16b5a55daeb3462cb4aabbccddeeff', 'hex'), hash: Buffer.from('41935e3f9332ea8e2da79c3cc926ac1df66307809b6cb93a27ac62518ea6122d', 'hex'), n: 0, value: 900000}
  ]
})

export let TransactionOutpoint = (hash, n) =>
                          fromJS({hash, n})

export let ChannelParams = (fundingKey, dustLimitSatoshis, maxHtlcValueInFlightMsat, channelReserveSatoshis, htlcMinimumMsat, feeRatePerKw, toSelfDelay, maxAcceptedHtlcs, revocationBasepoint, paymentBasepoint, delayedPaymentBasepoint, globalFeatures, localFeatures) =>
                    fromJS({fundingKey, dustLimitSatoshis, maxHtlcValueInFlightMsat, channelReserveSatoshis, htlcMinimumMsat, feeRatePerKw, toSelfDelay, maxAcceptedHtlcs, revocationBasepoint, paymentBasepoint, delayedPaymentBasepoint, globalFeatures, localFeatures})

export let ChannelUpdateTypes = {
  ADD: 1,
  FULFILL: 2,
  FAIL: 3,
  FAIL_MALFORMED: 4
}
export let Direction = {
  OFFERED: 1,
  RECEIVED: 2
}
export let Funded = {
  LOCAL_FUNDED: 1,
  REMOTE_FUNDED: 2
}
export let ChannelUpdateWrapper = (type, direction, index, msg) => fromJS({type, direction, index, msg})

export let ChannelState = () => fromJS({
  amountMsatLocal: null,
  amountMsatRemote: null,

  indexes: {
    in: new Long(0),
    inU: new Long(0)
  },

  committed: [],
  ack: [],
  unack: [],

  // This is the index of the update this state was on before a commit message
  // Upon an ack message, we move all unack messages into the other ack state, which are <= this index
  updateCounter: new Long(0),
  commitIndex: new Long(0),

  currentCommitmentPoint: null,
  nextCommitmentPoint: null,
  commitmentNumber: 0
})

export let Channel = () => fromJS({
  channelId: null,
  staticRemote: null,

  outpoint: null,

  paramsLocal: null,
  paramsRemote: null,

  remote: ChannelState(),
  local: ChannelState(),

  commitmentObscureHash: null,

  commitmentSecretSeed: null,
  commitmentStorage: [],

  messageOut: []
})

export let PaymentWrapper = (direction, id, payment) =>
                     fromJS({direction, id, payment})

export let Payment = (amount, paymentHash, onionRoutingPackage, cltvTimeout, paymentPreImage) =>
              fromJS({amount, paymentHash, onionRoutingPackage, cltvTimeout, paymentPreImage})
