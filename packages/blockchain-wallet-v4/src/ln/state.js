export default () => ({
  channels: {},
  connections: {},

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

export let Channel = () => {

}
