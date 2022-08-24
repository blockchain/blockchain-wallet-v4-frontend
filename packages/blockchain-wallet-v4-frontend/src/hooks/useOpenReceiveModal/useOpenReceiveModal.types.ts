export type OpenReceiveModalCallback = (wallet: {
  baseCoin: string
  coin: string
  label: string
  type: string
}) => Promise<void>

export type OpenReceiveModalHook = () => OpenReceiveModalCallback
