export default () => ({
  channels: [],
  connections: [],
  payments: [],

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
                          ({fundingKey, dustLimitSatoshis, maxHtlcValueInFlightMsat, channelReserveSatoshis, htlcMinimumMsat, toSelfDelay, maxAcceptedHtlcs, revocationBasepoint, paymentBasepoint, delayedPaymentBasepoint, globalFeatures, localFeatures})

export let Channel = () => ({
  channelId: null,
  amountMsatLocal: null,
  amountMsatRemote: null,
  staticRemote: null,
  paramsLocal: null,
  paramsRemote: null
})

export let Payment = (channelId, amount, paymentHash, route) =>
                    ({channelId, amount, paymentHash, route})
