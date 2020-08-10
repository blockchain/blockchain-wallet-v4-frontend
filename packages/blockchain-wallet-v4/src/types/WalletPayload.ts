export type ImportedAddrType = {
  addr: string
  created_device_name: string
  created_device_version: string
  created_time: number
  info: {
    address: string
    final_balance: number
    n_tx: number
    total_received: number
    total_sent: number
  }
  label?: string
  priv: null | string
  tag: number
}
