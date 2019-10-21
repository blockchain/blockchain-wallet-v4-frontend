import { BtcAPI } from './api/btc/BtcAPI'
import { MiscAPI } from './api/misc/MiscAPI'
import { WalletAPI } from './api/wallet/WalletAPI'

export type API = BtcAPI & MiscAPI & WalletAPI
