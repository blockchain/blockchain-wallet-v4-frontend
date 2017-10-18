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

export let ChannelParams = (fundingKey, dustLimitSatoshis, maxHtlcValueInFlightMsat, channelReserveSatoshis, htlcMinimumMsat, toSelfDelay, maxAcceptedHtlcs, revocationBasepoint, paymentBasepoint, delayedPaymentBasepoint, globalFeatures, localFeatures) =>
                    fromJS({fundingKey, dustLimitSatoshis, maxHtlcValueInFlightMsat, channelReserveSatoshis, htlcMinimumMsat, toSelfDelay, maxAcceptedHtlcs, revocationBasepoint, paymentBasepoint, delayedPaymentBasepoint, globalFeatures, localFeatures})

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
export let ChannelUpdateWrapper = (type, direction, msg) => fromJS({type, direction, msg})

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
  staged: []

  // Dictionaries containing all payments
  // These dictionaries will include payments that haven't been committed yet.
  // Ideally we should prune these on connection and remove all uncommitted payments

  // payments: {
  //  mapI: {},
  //  mapO: {}
  // }
})

export let Channel = () => fromJS({
  channelId: null,
  staticRemote: null,

  paramsLocal: null,
  paramsRemote: null,

  remote: ChannelState(),
  local: ChannelState(),

  commitmentObscureHash: null,

  messageOut: []
})

export let PaymentWrapper = (direction, id, payment) =>
                     fromJS({direction, id, payment})

export let Payment = (amount, paymentHash, onionRoutingPackage, cltvTimeout) =>
              fromJS({amount, paymentHash, onionRoutingPackage, cltvTimeout})

