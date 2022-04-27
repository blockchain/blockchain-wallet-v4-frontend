export type AddressData = {
  data: {
    label: string
    options: {
      label: string
      value: {
        address: string
        balance: number
        coin: string
        label: string
        type: string
      }
    }[]
    value: string
  }[]
}

export type WalletsHookData = {
  address: string
  balance: number
  coin: string
  label: string
  type: string
}
