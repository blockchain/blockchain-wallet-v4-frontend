import { EthPaymentType, RemoteDataType } from 'blockchain-wallet-v4/src/types'

export type TransferEthState = {
  payment: RemoteDataType<string, EthPaymentType['value']>
}
